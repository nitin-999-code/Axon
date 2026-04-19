import EventBus from "../utils/eventBus.js";

/**
 * Notification Service — Observer watching the EventBus for system events.
 */
class NotificationService {
  constructor() {
    this.initSubscriptions();
  }

  initSubscriptions() {
    EventBus.subscribe("TASK_OVERDUE", this.handleTaskOverdue.bind(this));
    EventBus.subscribe("SPRINT_COMPLETED", this.handleSprintCompleted.bind(this));
    EventBus.subscribe("TASK_ASSIGNED", this.handleTaskAssigned.bind(this));
  }

  async handleTaskOverdue({ task, daysOverdue }) {
    // In a real system: send an email to task.assignee.email or push notification
    console.log(`[NotificationEngine: TASK_OVERDUE] Task ${task.id} ("${task.title}") is overdue by ${daysOverdue} days! Alerting assignee ${task.assigneeId}...`);
  }

  async handleSprintCompleted({ sprint, velocity }) {
    console.log(`[NotificationEngine: SPRINT_COMPLETED] Sprint ${sprint.id} ("${sprint.name}") has completed with a delivery velocity of ${velocity} Story Points. Formatting report...`);
  }

  async handleTaskAssigned({ taskId, assigneeId }) {
    console.log(`[NotificationEngine: TASK_ASSIGNED] User ${assigneeId} was assigned to Task ${taskId}. Sending in-app notification...`);
  }
}

// Instantiate side-effect engine
export default new NotificationService();
