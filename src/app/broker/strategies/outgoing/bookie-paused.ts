import { WSBroker } from '@broker/broker';
import { container } from 'tsyringe';

export function bookiePaused(id: string) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'bookiePaused',
    data: {
      bookieId: id,
      paused: true,
    },
  });
}
