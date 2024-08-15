import { WSStore } from '@broker/store';
import { container } from 'tsyringe';

export function pauseBookie(data: { bookieId: string }) {
  const store = container.resolve(WSStore);
  const bookie = store.getBookieInstance(data.bookieId);
  if (bookie) {
    console.log('Pausing', bookie.name);
    bookie.pause();
  } else {
    console.log(
      `Failed to pause. Bookie with id: "${data.bookieId}" not found`,
    );
  }
}
