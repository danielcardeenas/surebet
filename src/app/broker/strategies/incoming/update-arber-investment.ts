import { WSStore } from '@broker/store';
import { money } from '@money/currencies';
import { container } from 'tsyringe';

export function updateArberInvestment(data: {
  arberId: string;
  investment: { amount: number; currencyCode: string };
}) {
  const store = container.resolve(WSStore);
  const arber = store.getArberInstance(data.arberId);
  if (arber) {
    console.log('Updating arber investment for', arber.name, data.investment);
    const currency = money[data.investment.currencyCode];
    if (currency && data.investment.amount) {
      // Update investment
      arber.setInvestment({
        amount: data.investment.amount,
        currency: currency,
      });
    } else {
      console.log(
        `Failed to update investment. Money: "${data.investment}" invalid or not found`,
      );
    }
  } else {
    console.log(
      `Failed to update investment. Arber with id: "${data.arberId}" not found`,
    );
  }
}
