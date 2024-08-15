import { WSBroker } from '@broker/broker';
import { container } from 'tsyringe';

export function arberPaused(id: string) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'arberPaused',
    data: {
      id: id,
    },
  });
}
