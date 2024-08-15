import { Bet } from '../models';
import { BetFamily } from './../models/defs/bet-family.enum';
import { Genetic } from './base/genetic';

export class AsianHandicap extends Genetic {
  public family: BetFamily = BetFamily.AsianHandicap;
  constructor(public handicap: number) {
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
    return this.handicap.toString();
  }
}
