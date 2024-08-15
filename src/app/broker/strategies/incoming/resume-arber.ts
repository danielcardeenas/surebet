import { WSStore } from '@broker/store';
import { container } from 'tsyringe';

export function resumeArber(data: { arberId: string }) {
  const store = container.resolve(WSStore);
  const arber = store.getArberInstance(data.arberId);
  if (arber) {
    console.log('Resuming', arber.name);
    arber.resume();
  } else {
    console.log(
      `Failed to resume. Arber with id: "${data.arberId}" not found`,
    );
  }
}
