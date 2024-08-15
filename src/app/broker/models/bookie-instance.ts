export enum InstanceStatus {
  Created = 'created',
  Placing = 'placing',
  Placed = 'placed',
  Postulating = 'postualting',
  Retrieving = 'retrieving',
  Closed = 'closed',
}

export interface BookieInstance {
  id: string;
  bookie: string;
  currencyCode: string;
  status?: InstanceStatus;
  maxing?: boolean;
}
