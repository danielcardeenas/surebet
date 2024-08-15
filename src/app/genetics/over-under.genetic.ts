import { Wager } from '../models/defs/wager.enum';
import { BetFamily } from './../models/defs/bet-family.enum';
import { Genetic } from './base/genetic';
import { Bet } from '../models';

export class OverUnder extends Genetic {
  public family: BetFamily = BetFamily.OverUnder;
  constructor(public wager: Wager, public handicap: number) {
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
    return `${this.wager} ${this.handicap}`;
  }
}
