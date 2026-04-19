"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeadlineStrategy = void 0;
class DeadlineStrategy {
    score(task) {
        if (!task.dueDate)
            return 0;
        const diff = new Date(task.dueDate).getTime() - Date.now();
        return Math.max(0, 1 / diff);
    }
}
exports.DeadlineStrategy = DeadlineStrategy;
exports.default = DeadlineStrategy;
