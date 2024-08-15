import * as fuzz from 'fuzzball';
import { Bet } from '../models';
import { BetFamily } from './../models/defs/bet-family.enum';
import { Genetic } from './base/genetic';

export class WillClassify extends Genetic {
  public family: BetFamily = BetFamily.WillClassify;
  constructor(public will: boolean, private driver: string) {
    super();
  }

  arbitrableTo(bet: Bet) {
    if (bet.genetic.family === this.family) {
      return (
        fuzz.token_set_ratio(bet.title, this.driver) >= 80 &&
        (bet.genetic as WillClassify).will !== this.will
      );
    } else {
      return false;
    }
  }

  equivalentTo(bet: Bet) {
    return false;
  }

  equivalentFrom(bets: Bet[]): Bet {
    throw new Error('Method not implemented.');
  }

  toString() {
    return `${this.driver} ${this.will ? 'does' : 'doesn\'t'} classify`;
  }
}
