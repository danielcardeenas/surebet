export enum ArberStatus {
  Created = 'created',
  Placing = 'placing',
  Placed = 'placed',
  Postulating = 'postualting',
  Retrieving = 'retrieving',
  Closed = 'closed',
}

export interface ArberInstance {
  id: string;
  name: string;
  instances: string[];
  investment: { amount: number; currencyCode: string };
  status?: ArberStatus;
  paused?: boolean;
}
