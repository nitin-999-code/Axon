"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
/**
 * EventBus — Central message hub implementing the Observer Pattern.
 * Decouples core business services from side-effects (Notifications, Emails).
 */
class EventBus extends events_1.default {
    constructor() {
        super();
        this.setMaxListeners(20);
    }
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    publish(eventName, payload) {
        this.emit(eventName, payload);
    }
    subscribe(eventName, listener) {
        this.on(eventName, listener);
    }
    unsubscribe(eventName, listener) {
        this.removeListener(eventName, listener);
    }
}
exports.default = EventBus.getInstance();
