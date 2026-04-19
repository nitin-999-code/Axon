import { PriorityStrategy } from "./PriorityStrategy.js";

export class ComplexityStrategy implements PriorityStrategy {
  score(task: any): number {
    return task.storyPoints || 1;
  }
}

export default ComplexityStrategy;
