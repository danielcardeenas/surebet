import { WSBroker } from '@broker/broker';
import { ArberStatus } from '@broker/models/arber-instance';
import { container } from 'tsyringe';

export function arberClosed(id: string) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'arberStatusChanged',
    data: {
      arberId: id,
      status: ArberStatus.Closed,
    },
  });
}
