import { WSBroker } from '@broker/broker';
import { ArberInstance, ArberStatus } from '@broker/models/arber-instance';
import { Money } from '@money/types';
import { container } from 'tsyringe';

export function arberCreated(
  id: string,
  arberName: string,
  instancesIds: string[],
  investment: Money,
) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'arberCreated',
    data: {
      id: id,
      name: arberName,
      instances: instancesIds,
      investment: {
        amount: investment.amount,
        currencyCode: investment.currency.code,
      },
    } as ArberInstance,
  });
}
