import { WSStore } from '@broker/store';
import { container } from 'tsyringe';

export function closeBookie(data: { bookieId: string }) {
  const store = container.resolve(WSStore);
  const bookie = store.getBookieInstance(data.bookieId);
  if (bookie) {
    console.log('Closing', bookie.name);
    bookie.close();
  } else {
    console.log(
      `Failed to pause. Bookie with id: "${data.bookieId}" not found`,
    );
  }
}
