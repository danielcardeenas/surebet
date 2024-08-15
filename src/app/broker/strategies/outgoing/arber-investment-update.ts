import { WSBroker } from '@broker/broker';
import { Money } from '@money/types';
import { container } from 'tsyringe';

export function arberInvestmentUpdated(id: string, investment: Money) {
  const broker = container.resolve(WSBroker);
  broker.send({
    event: 'arberInvestmentUpdated',
    data: {
      arberId: id,
      investment: {
        amount: investment.amount,
        currencyCode: investment.currency.code,
      },
    },
  });
}
