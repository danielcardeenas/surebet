import { Arber } from '@arbers';
import { Bookie } from '@bookies';
import { BookieName } from '@models';
import { singleton } from 'tsyringe';

@singleton()
export class WSStore {
  private _instances: Bookie[] = [];
  private _arbers: Arber[] = [];

  constructor() {}

  addArber(arber: Arber) {
    console.log('Adding arber', arber.id);
    this._arbers.push(arber);
  }

  arbers() {
    return this._arbers;
  }

  getArberInstance(id: string) {
    return this._arbers.find((i) => i.id === id);
  }

  closeArber(id: string) {
    this._arbers = this._arbers.filter((i) => i.id !== id);
  }

  addInstance(bookie: Bookie) {
    this._instances.push(bookie);
  }

  instances() {
    return this._instances;
  }

  getBookieInstance(id: string) {
    return this._instances.find((i) => i.id === id);
  }

  closeBookie(id: string) {
    this._instances = this._instances.filter((i) => i.id !== id);
  }

  async closeAll(skip: BookieName[] = []) {
    await Promise.all(
      this._instances.map((i) => {
        if (!skip.includes(i.name)) {
          return i.close();
        }
      }),
    );
  }
}
