import { type NumerologyResult, type InsertNumerology, type NumerologyInterpretation } from "@shared/schema";

export interface IStorage {
  createResult(result: InsertNumerology & {
    lifePath: number;
    destiny: number;
    heartDesire: number;
    interpretations: NumerologyInterpretation;
  }): Promise<NumerologyResult>;
}

export class MemStorage implements IStorage {
  private results: Map<number, NumerologyResult>;
  private currentId: number;

  constructor() {
    this.results = new Map();
    this.currentId = 1;
  }

  async createResult(data: InsertNumerology & {
    lifePath: number;
    destiny: number;
    heartDesire: number;
    interpretations: NumerologyInterpretation;
  }): Promise<NumerologyResult> {
    const id = this.currentId++;
    const result = { id, ...data };
    this.results.set(id, result);
    return result;
  }
}

export const storage = new MemStorage();