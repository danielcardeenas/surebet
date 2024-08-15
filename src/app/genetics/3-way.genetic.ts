import { Bet, BetFamily } from '@models';
import * as fuzz from 'fuzzball';
import { Genetic } from './base/genetic';

export class ThreeWay extends Genetic {
  public family: BetFamily = BetFamily.ThreeWay;
  public isDraw = false;
  constructor(private title: string) {
    super();
    this.isDraw = this.title === 'Draw';
  }

  arbitrableTo(bet: Bet) {
    if (bet.genetic.family !== this.family) {
      return false;
    }

    const equivalent = fuzz.partial_ratio(bet.title, this.title) <= 50;
    return equivalent;
  }

  equivalentTo(bet: Bet) {
    if (!this.sameGenetic(bet)) {
      return false;
    }

    if (bet.title.length < this.title.length) {
      return fuzz.partial_ratio(bet.title, this.title) >= 80;
    } else {
      return fuzz.token_sort_ratio(bet.title, this.title) >= 80;
    }
  }

  equivalentFrom(bets: Bet[]) {
    // Quick handle draw cases
    if (this.isDraw) {
      const drawEquivalent = bets.find((bet) => (<ThreeWay>bet.genetic).isDraw);
      if (!drawEquivalent) {
        throw new Error(
          `Draw equivalent not found in bets ${bets} for bookie ${bets[0]?.bookie}`,
        );
      }

      return drawEquivalent;
    }

    // Remove draw case from case
    const test = bets.filter((bet) => !(<ThreeWay>bet.genetic).isDraw);

    // Get ratios
    const ratios = test.map((bet) => {
      if (!this.sameGenetic(bet)) {
        return 0;
      }

      if (bet.title.length < this.title.length) {
        return fuzz.partial_ratio(bet.title, this.title);
      } else {
        return fuzz.token_sort_ratio(bet.title, this.title);
      }
    });

    // Return index of max
    const indexOfMax = ratios.reduce(
      (prev, curr, index, arr) => (curr > arr[prev] ? index : prev),
      0,
    );

    return test[indexOfMax];
  }

  toString() {
    return this.title;
  }
}
