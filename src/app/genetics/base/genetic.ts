import { Bet, BetFamily } from '@models';

export abstract class Genetic {
  abstract family: BetFamily;
  abstract arbitrableTo(bet: Bet): boolean;
  abstract equivalentTo(bet: Bet): boolean;
  abstract equivalentFrom(bets: Bet[]): Bet;
  abstract toString(): string;
  protected sameGenetic(bet: Bet) {
    return bet.genetic.family === this.family
  }
}
