import EventEmitter from "events";

/**
 * EventBus - Central message hub implementing the Observer Pattern.
 * Decouples core business services from side-effects (like Notifications, Emails).
 */
class EventBus extends EventEmitter {
  constructor() {
    super();
    // Increase limit if many listeners are attached to prevent memory leak warnings
    this.setMaxListeners(20);
  }

  /**
   * Publish an event.
   * @param {string} eventName 
   * @param {Object} payload 
   */
  publish(eventName, payload) {
    this.emit(eventName, payload);
  }

  /**
   * Subscribe to an event.
   * @param {string} eventName 
   * @param {Function} listener 
   */
  subscribe(eventName, listener) {
    this.on(eventName, listener);
  }

  /**
   * Remove a subscription.
   */
  unsubscribe(eventName, listener) {
    this.removeListener(eventName, listener);
  }
}

// Export singleton instance
export default new EventBus();
