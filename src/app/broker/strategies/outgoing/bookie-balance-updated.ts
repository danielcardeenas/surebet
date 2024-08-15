import { WSBroker } from '@broker/broker';
import { container } from 'tsyringe';

export function bookieBalanceUpdated(id: string, balance: number) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'bookieBalanceUpdated',
    data: {
      bookieId: id,
      balance: balance,
    },
  });
}
