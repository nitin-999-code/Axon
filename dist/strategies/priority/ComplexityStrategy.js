"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplexityStrategy = void 0;
class ComplexityStrategy {
    score(task) {
        return task.storyPoints || 1;
    }
}
exports.ComplexityStrategy = ComplexityStrategy;
exports.default = ComplexityStrategy;
