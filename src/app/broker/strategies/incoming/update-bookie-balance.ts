import { WSStore } from '@broker/store';
import { container } from 'tsyringe';

export function updateBookieBalance(data: {
  bookieId: string;
  amount: number;
}) {
  const store = container.resolve(WSStore);
  const bookie = store.getBookieInstance(data.bookieId);
  if (bookie) {
    console.log('Updating balance for', bookie.name, data.amount);
    bookie.setBalance(data.amount);
  } else {
    console.log(
      `Failed to update balance. Bookie with id: "${data.bookieId}" not found`,
    );
  }
}
