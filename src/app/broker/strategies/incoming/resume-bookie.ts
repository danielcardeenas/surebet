import { WSStore } from '@broker/store';
import { container } from 'tsyringe';

export function resumeBookie(data: { bookieId: string }) {
  const store = container.resolve(WSStore);
  const bookie = store.getBookieInstance(data.bookieId);
  if (bookie) {
    console.log('Resuming', bookie.name);
    bookie.resume();
  } else {
    console.log(
      `Failed to resume. Bookie with id: "${data.bookieId}" not found`,
    );
  }
}
