import { WSBroker } from '@broker/broker';
import { BookieInstance } from '@broker/models';
import { container } from 'tsyringe';

export function bookieCreated(
  id: string,
  bookieName: string,
  currencyCode: string,
) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'bookieCreated',
    data: {
      id: id,
      bookie: bookieName,
      currencyCode: currencyCode,
    } as BookieInstance,
  });
}
