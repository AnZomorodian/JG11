import { pgTable, text, serial, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").$type<"admin" | "user">().default("user"),
  isBanned: boolean("is_banned").default(false),
  banUntil: timestamp("ban_until"),
  dailyLimit: integer("daily_limit").default(10),
  usedToday: integer("used_today").default(0),
  lastUsedAt: timestamp("last_used_at"),
});

export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  originalUrl: text("original_url").notNull(),
  title: text("title"),
  thumbnail: text("thumbnail"),
  formats: jsonb("formats").$type<Array<{
    url: string;
    ext: string;
    quality?: string;
    label?: string;
  }>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isBanned: true,
  banUntil: true,
  usedToday: true,
  lastUsedAt: true
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  createdAt: true
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Download = typeof downloads.$inferSelect;
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
