import { WSBroker } from '@broker/broker';
import { container } from 'tsyringe';

export function arberResumed(id: string) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'arberResumed',
    data: {
      id: id,
    },
  });
}
