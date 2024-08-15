import { WSStore } from '@broker/store';
import { container } from 'tsyringe';

export function maximizeBookie(data: { bookieId: string; maximize: boolean }) {
  const store = container.resolve(WSStore);
  const bookie = store.getBookieInstance(data.bookieId);
  if (bookie) {
    console.log('Maxing', bookie.name);
    bookie.setMaximize(data.maximize);
  } else {
    console.log(
      `Failed to maximize. Bookie with id: "${data.bookieId}" not found`,
    );
  }
}
