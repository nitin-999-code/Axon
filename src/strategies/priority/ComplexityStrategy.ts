/**
 * ComplexityStrategy - scores based on raw story points.
 * Relevant for Scrum Masters focusing strictly on heavy-lifting capacity.
 */
class ComplexityStrategy {
  calculate(task) {
    const points = task.storyPoints || 0;

    // Based loosely on Fibonacci sequence estimation thresholds
    if (points >= 13) return 90; // Epic level task, highly prioritized structural risk
    if (points >= 8)  return 75; // Heavy task
    if (points >= 5)  return 50; // Moderate 
    if (points >= 3)  return 30; // Mild
    
    return 10; // Trivial 1 or 2 point task
  }
}

export default ComplexityStrategy;
