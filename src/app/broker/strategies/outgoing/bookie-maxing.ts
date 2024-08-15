import { WSBroker } from '@broker/broker';
import { container } from 'tsyringe';

export function bookieMaxing(id: string, maxing: boolean) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'bookieMaxing',
    data: {
      bookieId: id,
      maxing: maxing,
    },
  });
}
