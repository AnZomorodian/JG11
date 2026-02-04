import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'DATABASE.JS');

interface LocalDB {
  users: any[];
  downloads: any[];
}

function loadDB(): LocalDB {
  if (!fs.existsSync(DB_FILE)) {
    const initialDB = {
      users: [{
        id: 1,
        username: "Admin",
        password: "Admin123",
        role: "admin",
        dailyLimit: 999999,
        usedToday: 0,
        isBanned: false
      }],
      downloads: []
    };
    fs.writeFileSync(DB_FILE, '// ' + JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const jsonStr = data.replace(/^\/\/\s*/, '');
    return JSON.parse(jsonStr);
  } catch (e) {
    return { users: [], downloads: [] };
  }
}

function saveDB(db: LocalDB) {
  fs.writeFileSync(DB_FILE, '// ' + JSON.stringify(db, null, 2));
}

export interface IStorage {
  getUser(id: number): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
  updateUser(id: number, updates: any): Promise<any>;
  deleteUser(id: number): Promise<void>;
  getUsers(): Promise<any[]>;
  createDownload(download: any): Promise<any>;
  getDownloads(userId?: number): Promise<any[]>;
}

export class LocalFileStorage implements IStorage {
  async getUser(id: number) {
    const db = loadDB();
    return db.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string) {
    const db = loadDB();
    return db.users.find(u => u.username === username);
  }

  async createUser(user: any) {
    const db = loadDB();
    const newUser = { 
      ...user, 
      id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1, 
      usedToday: 0, 
      isBanned: false,
      role: user.role || "user",
      dailyLimit: user.dailyLimit || 10
    };
    db.users.push(newUser);
    saveDB(db);
    return newUser;
  }

  async updateUser(id: number, updates: any) {
    const db = loadDB();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    db.users[index] = { ...db.users[index], ...updates };
    saveDB(db);
    return db.users[index];
  }

  async deleteUser(id: number) {
    const db = loadDB();
    db.users = db.users.filter(u => u.id !== id);
    saveDB(db);
  }

  async getUsers() {
    return loadDB().users;
  }

  async createDownload(download: any) {
    const db = loadDB();
    const newDownload = { 
      ...download, 
      id: db.downloads.length > 0 ? Math.max(...db.downloads.map(d => d.id)) + 1 : 1,
      createdAt: new Date().toISOString() 
    };
    db.downloads.push(newDownload);
    saveDB(db);
    return newDownload;
  }

  async getDownloads(userId?: number) {
    const db = loadDB();
    let downloads = [...db.downloads];
    if (userId) {
      downloads = downloads.filter(d => d.userId === userId);
    }
    return downloads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);
  }
}

export const storage = new LocalFileStorage();
