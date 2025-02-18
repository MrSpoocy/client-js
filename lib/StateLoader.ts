import {DomainEvent, EventEnvelope} from "./";

class StateLoader {

  private readonly initialState: any;
  private readonly eventHandlers: any;

  constructor(private readonly stateType) {
    let constructor = stateType.prototype.constructor;
    const instance = new constructor({});
    if (!instance.eventHandlers || instance.eventHandlers.length === 0) {
      throw new Error(`No event handlers configured for aggregate: ${constructor.name}`)
    }
    this.initialState = instance.initialState ? instance.initialState : {};
    this.eventHandlers = instance.eventHandlers;
  }

  loadState(events: EventEnvelope<DomainEvent>[]) {
    let currentState = this.initialState;
    events.forEach((e) => {
      let eventType = e.eventType;
      const handler = this.eventHandlers[e.eventType];
      if (handler) {
        currentState = handler.call({}, currentState, e.data);
      } else {
        return Promise.reject(`Failed to call handler. No match for event ${eventType}`);
      }
    })
    return currentState;
  }

}

export {StateLoader}
