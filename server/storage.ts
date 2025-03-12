import { type NumerologyResult, type InsertNumerology, type NumerologyInterpretation, type User, type InsertUser, type VerificationCode, type DreamRecord, type InsertDream } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  createResult(result: InsertNumerology & {
    lifePath: number;
    destiny: number;
    heartDesire: number;
    interpretations: NumerologyInterpretation;
    userId?: number | null;
  }): Promise<NumerologyResult>;

  getLatestNumerologyResult(userId: number): Promise<NumerologyResult | null>;
  getUserById(userId: number): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  verifyUser(userId: number): Promise<void>;
  createVerificationCode(code: { userId: number; code: string; expiresAt: Date }): Promise<VerificationCode>;
  getLatestVerificationCode(userId: number): Promise<VerificationCode | null>;

  // Dream record methods
  createDreamRecord(record: InsertDream & {
    userId?: number | null;
    numerologyFactors: Record<string, number>;
    interpretation: Record<string, any>;
  }): Promise<DreamRecord>;

  getDreamRecordsByUserId(userId: number): Promise<DreamRecord[]>;
  getDreamRecord(id: number): Promise<DreamRecord | null>;

  sessionStore: session.Store;
  updatePassword(userId: number, hashedPassword: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private results: Map<number, NumerologyResult>;
  private userResults: Map<number, number[]>; // userId -> resultIds
  private users: Map<number, User>;
  private verificationCodes: Map<number, VerificationCode>;
  private dreamRecords: Map<number, DreamRecord>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.results = new Map();
    this.userResults = new Map();
    this.users = new Map();
    this.verificationCodes = new Map();
    this.dreamRecords = new Map();
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

    // Track user's results
    if (data.userId) {
      const userResults = this.userResults.get(data.userId) || [];
      userResults.push(id);
      this.userResults.set(data.userId, userResults);
    }

    return result;
  }

  async getLatestNumerologyResult(userId: number): Promise<NumerologyResult | null> {
    const userResults = this.userResults.get(userId);
    if (!userResults || userResults.length === 0) {
      return null;
    }

    // Get the latest result (last in the array)
    const latestResultId = userResults[userResults.length - 1];
    return this.results.get(latestResultId) || null;
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.users.get(userId) || null;
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
    // Initialize empty results array for new user
    this.userResults.set(id, []);
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

  async createDreamRecord(data: InsertDream & {
    userId?: number | null;
    numerologyFactors: Record<string, number>;
    interpretation: Record<string, any>;
  }): Promise<DreamRecord> {
    const id = this.currentId++;
    const dreamRecord: DreamRecord = {
      id,
      userId: data.userId || null,
      dreamDate: new Date(data.dreamDate),
      description: data.description,
      emotions: data.emotions,
      symbols: data.symbols,
      numerologyFactors: data.numerologyFactors,
      interpretation: data.interpretation
    };
    this.dreamRecords.set(id, dreamRecord);
    return dreamRecord;
  }

  async getDreamRecordsByUserId(userId: number): Promise<DreamRecord[]> {
    return Array.from(this.dreamRecords.values())
      .filter(record => record.userId === userId);
  }

  async getDreamRecord(id: number): Promise<DreamRecord | null> {
    return this.dreamRecords.get(id) || null;
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.password = hashedPassword;
      this.users.set(userId, user);
    }
  }
}

export const storage = new MemStorage();