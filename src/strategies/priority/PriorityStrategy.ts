export interface PriorityStrategy {
  score(task: any): number;
}
