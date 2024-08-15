import { WSBroker } from '@broker/broker';
import { ArberStatus } from '@broker/models/arber-instance';
import { container } from 'tsyringe';

export function arberStatusUpdated(id: string, status: ArberStatus) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'arberStatusChanged',
    data: {
      arberId: id,
      status: status,
    },
  });
}
