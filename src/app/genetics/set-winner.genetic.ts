import { Bet } from '../models';
import { BetFamily } from '../models/defs/bet-family.enum';
import { Genetic } from './base/genetic';

export class SetWinner extends Genetic {
  public family: BetFamily = BetFamily.SetH2H;
  constructor(public set: number) {
    super();
  }

  arbitrableTo(bet: Bet) {
    return false;
  }

  equivalentTo(bet: Bet) {
    return false;
  }

  equivalentFrom(bets: Bet[]): Bet {
    throw new Error('Method not implemented.');
  }

  toString() {
    return `Set ${this.set} winner`;
  }
}
