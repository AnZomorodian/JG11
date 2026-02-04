import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { exec } from "child_process";
import util from "util";
import session from "express-session";
import MemoryStoreFactory from "memorystore";

const execAsync = util.promisify(exec);
const MemoryStore = MemoryStoreFactory(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
    resave: false,
    saveUninitialized: false,
    secret: 'p-ddl-secret-key'
  }));

  app.post(api.auth.login.path, async (req, res) => {
    const { username, password } = api.auth.login.input.parse(req.body);
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.isBanned) {
      return res.status(401).json({ message: "Account banned" });
    }
    (req.session as any).userId = user.id;
    res.json(user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.json(null);
    const user = await storage.getUser(userId);
    res.json(user || null);
  });

  const requireAuth = async (req: any, res: any, next: any) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await storage.getUser(userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.isBanned) return res.status(401).json({ message: "Banned" });
    req.user = user;
    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: "Admin only" });
    next();
  };

  app.post(api.downloads.analyze.path, requireAuth, async (req, res) => {
    try {
      const { url } = api.downloads.analyze.input.parse(req.body);
      const user = (req as any).user;

      if (user.usedToday >= user.dailyLimit) {
        return res.status(403).json({ message: "Daily limit reached." });
      }

      try {
        const { stdout } = await execAsync(`yt-dlp -J --no-warnings --no-playlist "${url}"`, {
          maxBuffer: 10 * 1024 * 1024
        });

        const info = JSON.parse(stdout);
        const formats = (info.formats || []).map((f: any) => ({
          url: f.url,
          ext: f.ext,
          quality: f.format_note || f.resolution || 'unknown',
          label: f.format || 'unknown'
        })).filter((f: any) => f.url && f.url.startsWith('http'));

        const result = {
          title: info.title || "Unknown Title",
          thumbnail: info.thumbnail || "",
          formats: formats
        };

        await storage.createDownload({
          userId: user.id,
          originalUrl: url,
          title: result.title,
          thumbnail: result.thumbnail,
          formats: result.formats
        });

        await storage.updateUser(user.id, { usedToday: (user.usedToday || 0) + 1, lastUsedAt: new Date() });
        res.json(result);
      } catch (execError: any) {
        return res.status(400).json({ message: "Failed to process video." });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.downloads.history.path, requireAuth, async (req, res) => {
    const user = (req as any).user;
    const history = await storage.getDownloads(user.role === 'admin' ? undefined : user.id);
    res.json(history);
  });

  app.get(api.admin.users.list.path, requireAuth, requireAdmin, async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.post(api.admin.users.create.path, requireAuth, requireAdmin, async (req, res) => {
    const input = api.admin.users.create.input.parse(req.body);
    const user = await storage.createUser(input);
    res.status(201).json(user);
  });

  app.patch(api.admin.users.update.path, requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const updates = api.admin.users.update.input.parse(req.body);
    const user = await storage.updateUser(id, updates);
    res.json(user);
  });

  app.delete(api.admin.users.delete.path, requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteUser(id);
    res.status(204).end();
  });

  return httpServer;
}
