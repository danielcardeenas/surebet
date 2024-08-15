import { WSBroker } from '@broker/broker';
import * as os from 'os';
import { container } from 'tsyringe';

export function clientConnected() {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'clientConnected',
    data: {
      message: `connected from ${os.hostname()}`,
    },
  });
}
