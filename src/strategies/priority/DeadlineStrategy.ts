/**
 * DeadlineStrategy - scores purely based on temporal proximity to the Due Date.
 * Relevent for Project Managers emphasizing time-to-delivery.
 */
class DeadlineStrategy {
  calculate(task) {
    if (!task.dueDate) return 0; // Unscheduled tasks have baseline temporal priority

    const msUntilDue = new Date(task.dueDate).getTime() - Date.now();
    const daysUntilDue = Math.ceil(msUntilDue / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return 100; // Overdue items are critical
    if (daysUntilDue <= 1) return 90; // Due within 24h
    if (daysUntilDue <= 3) return 75; // Due within 3 days
    if (daysUntilDue <= 7) return 50; // Due this week
    
    return 10; // Comfortable margin
  }
}

export default DeadlineStrategy;
