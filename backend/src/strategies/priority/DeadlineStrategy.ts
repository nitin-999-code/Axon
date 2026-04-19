import { PriorityStrategy } from "./PriorityStrategy.js";

export class DeadlineStrategy implements PriorityStrategy {
  score(task: any): number {
    if (!task.dueDate) return 0;
    const diff = new Date(task.dueDate).getTime() - Date.now();
    return Math.max(0, 1 / diff);
  }
}

export default DeadlineStrategy;
