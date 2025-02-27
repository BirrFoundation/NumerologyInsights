import { type NumerologyResult, type InsertNumerology } from "@shared/schema";

export interface IStorage {
  createResult(result: InsertNumerology): Promise<NumerologyResult>;
}

export class MemStorage implements IStorage {
  private results: Map<number, NumerologyResult>;
  private currentId: number;

  constructor() {
    this.results = new Map();
    this.currentId = 1;
  }

  async createResult(data: InsertNumerology): Promise<NumerologyResult> {
    const id = this.currentId++;
    const result: NumerologyResult = { ...data, id };
    this.results.set(id, result);
    return result;
  }
}

export const storage = new MemStorage();
