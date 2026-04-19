import { PriorityStrategy } from "./PriorityStrategy.js";

export class PriorityScorer {
  private strategy: PriorityStrategy;

  constructor(strategy: PriorityStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PriorityStrategy): void {
    this.strategy = strategy;
  }

  calculate(task: any): number {
    return this.strategy.score(task);
  }
}

export default PriorityScorer;
