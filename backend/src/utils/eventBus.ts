import EventEmitter from "events";

/**
 * EventBus — Central message hub implementing the Observer Pattern.
 * Decouples core business services from side-effects (Notifications, Emails).
 */
class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(20);
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public publish(eventName: string, payload: Record<string, any>): void {
    this.emit(eventName, payload);
  }

  public subscribe(eventName: string, listener: (...args: any[]) => void): void {
    this.on(eventName, listener);
  }

  public unsubscribe(eventName: string, listener: (...args: any[]) => void): void {
    this.removeListener(eventName, listener);
  }
}

export default EventBus.getInstance();
