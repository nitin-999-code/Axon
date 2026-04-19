"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityScorer = void 0;
class PriorityScorer {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    calculate(task) {
        return this.strategy.score(task);
    }
}
exports.PriorityScorer = PriorityScorer;
exports.default = PriorityScorer;
