/**
 * Pluggable Priority Scoring wrapper utilizing the Strategy Pattern.
 * Context class that delegates the algorithm execution to the active Strategy.
 */
class PriorityScorer {
  constructor(strategy) {
    this.strategy = strategy;
  }

  /**
   * Extensible method to swap scoring behavior at runtime.
   */
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  /**
   * Calculates the priority score using the active injected strategy.
   * 
   * @param {Object} task The task to evaluate
   * @returns {Number} The computed priority score
   */
  calculate(task) {
    if (!this.strategy) {
      throw new Error("PriorityScorer: No strategy defined.");
    }
    return this.strategy.calculate(task);
  }
}

export default PriorityScorer;
