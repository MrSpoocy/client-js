import {AggregatesClient} from "./AggregatesClient";
import {ProjectionsClient} from './ProjectionsClient'
import {FeedsClient} from './FeedsClient'
import {ReactionsClient} from './ReactionsClient'
import {v4 as uuidv4} from 'uuid';

export interface DomainEvent {
}

export class EventEnvelope<E> {

  public readonly eventId = uuidv4();
  public readonly eventType: string;
  public readonly data: E;
  public readonly encryptedData?: string; // TODO: Implement

  constructor(event: E) {
    this.eventType = event.constructor.name;
    this.data = event;
  }

  static fromDomainEvent<E extends DomainEvent>(event: E) {
    return new EventEnvelope<E>(event)
  }
}

export class SerializedInstance {

  constructor(public readonly config) {
  }

  aggregateClient<A>(type): AggregatesClient<A> {
    return new AggregatesClient<A>(type, this.config);
  }

  projectionsClient(): ProjectionsClient {
    return new ProjectionsClient(this.config);
  }

  feedsClient(): FeedsClient {
    return new FeedsClient(this.config);
  }

  reactionsClient(): ReactionsClient {
    return new ReactionsClient(this.config);
  }

}
