import { WSBroker } from '@broker/broker';
import { InstanceStatus } from '@broker/models';
import { container } from 'tsyringe';

export function bookieStatusUpdated(id: string, status: InstanceStatus) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'bookieStatusChanged',
    data: {
      bookieId: id,
      status: status,
    },
  });
}
