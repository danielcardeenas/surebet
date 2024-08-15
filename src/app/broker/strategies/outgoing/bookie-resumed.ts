import { WSBroker } from '@broker/broker';
import { container } from 'tsyringe';

export function bookieResumed(id: string) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'bookieResumed',
    data: {
      bookieId: id,
      paused: false,
    },
  });
}
