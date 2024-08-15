import { Bet, BetFamily } from '@models';
import * as fuzz from 'fuzzball';
import { Genetic } from './base/genetic';

export class H2HGenetic extends Genetic {
  public family: BetFamily = BetFamily.Head2Head;
  constructor(private title: string) {
    super();
  }

  arbitrableTo(bet: Bet) {
    return false;
  }

  equivalentTo(bet: Bet) {
    if (!this.sameGenetic(bet)) {
      return false;
    }

    return fuzz.partial_ratio(bet.title, this.title) >= 80;
  }

  equivalentFrom(bets: Bet[]) {
    // Get ratios
    const ratios = bets.map((bet) => {
      if (!this.sameGenetic(bet)) {
        return 0;
      }

      return fuzz.partial_ratio(bet.title, this.title);
    });

    // Return index of max
    const indexOfMax = ratios.reduce(
      (prev, curr, index, arr) => (curr > arr[prev] ? index : prev),
      0,
    );

    return bets[indexOfMax];
  }

  toString() {
    return this.title;
  }
}
