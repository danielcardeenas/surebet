import { WSStore } from '@broker/store';
import { container } from 'tsyringe';

export function closeArber(data: { arberId: string }) {
  const store = container.resolve(WSStore);
  const arber = store.getArberInstance(data.arberId);
  if (arber) {
    console.log('Closing', arber.name);
    arber.close();
  } else {
    console.log(`Failed to close. Arber with id: "${data.arberId}" not found`);
  }
}
