import { WSStore } from '@broker/store';
import { container } from 'tsyringe';

export function pauseArber(data: { arberId: string }) {
  const store = container.resolve(WSStore);
  const arber = store.getArberInstance(data.arberId);
  if (arber) {
    console.log('Pausing', arber.name);
    arber.pause();
  } else {
    console.log(`Failed to pause. Arber with id: "${data.arberId}" not found`);
  }
}
