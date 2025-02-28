import { type NumerologyResult, type InsertNumerology, type NumerologyInterpretation, type User, type InsertUser, type VerificationCode } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Existing numerology methods
  createResult(result: InsertNumerology & {
    lifePath: number;
    destiny: number;
    heartDesire: number;
    interpretations: NumerologyInterpretation;
    userId?: number | null;
  }): Promise<NumerologyResult>;

  // User authentication methods
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  verifyUser(userId: number): Promise<void>;
  createVerificationCode(code: { userId: number; code: string; expiresAt: Date }): Promise<VerificationCode>;
  getLatestVerificationCode(userId: number): Promise<VerificationCode | null>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private results: Map<number, NumerologyResult>;
  private users: Map<number, User>;
  private verificationCodes: Map<number, VerificationCode>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.results = new Map();
    this.users = new Map();
    this.verificationCodes = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  async createResult(data: InsertNumerology & {
    lifePath: number;
    destiny: number;
    heartDesire: number;
    interpretations: NumerologyInterpretation;
    userId?: number | null;
  }): Promise<NumerologyResult> {
    const id = this.currentId++;
    const result = { id, ...data };
    this.results.set(id, result);
    return result;
  }

  async createUser(data: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      email: data.email,
      password: data.password,
      verified: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async verifyUser(userId: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.verified = true;
      this.users.set(userId, user);
    }
  }

  async createVerificationCode(data: { userId: number; code: string; expiresAt: Date }): Promise<VerificationCode> {
    const id = this.currentId++;
    const verificationCode: VerificationCode = {
      id,
      userId: data.userId,
      code: data.code,
      expiresAt: data.expiresAt,
      createdAt: new Date()
    };
    this.verificationCodes.set(id, verificationCode);
    return verificationCode;
  }

  async getLatestVerificationCode(userId: number): Promise<VerificationCode | null> {
    let latestCode: VerificationCode | null = null;
    let latestTime = new Date(0);

    for (const code of this.verificationCodes.values()) {
      if (code.userId === userId && code.createdAt > latestTime) {
        latestCode = code;
        latestTime = code.createdAt;
      }
    }

    return latestCode;
  }
}

export const storage = new MemStorage();