import { ArbGroup, BookieRetrieverTuple } from '@models';
import { Money } from '@money/types';
import { Arber } from './arber';

export abstract class EventAccomulatorArber extends Arber {
  constructor(
    protected retrievers: BookieRetrieverTuple[],
    protected investment: Money,
    private ticks = 10,
  ) {
    super(retrievers, investment);
  }

  // Accomulator [matchTitle, accomulations]
  protected accomulator: [string, number][] = [];

  /**
   * Accomulates matches every tick
   * Clears matches if not there constantly
   * @param arbs
   */
  protected accomulate(arbs: ArbGroup[]) {
    // Clean first, get indexes to accomulate
    this.accomulator = this.accomulator.filter((accMatch) => {
      return arbs.some((arb) => this.arbTitle(arb) === accMatch[0]);
    });

    // Upsert
    arbs.forEach((arb) => {
      const accIndex = this.accomulator.findIndex(
        (accMatch) => accMatch[0] === this.arbTitle(arb),
      );

      if (accIndex > -1) {
        // If already there accomulate +1
        this.accomulator[accIndex][1] = this.accomulator[accIndex][1] + 1;
      } else {
        // Push one
        this.accomulator.push([this.arbTitle(arb), 1]);
      }
    });

    if (this.accomulator.length) {
      console.log('Acc:', this.accomulator);
    }
  }

  /**
   * Checks if the arb is being constant inside the accomulator
   * @param arb arb match
   * @param ticks minimum ticks to be considered constant
   */
  protected isConstantArb(arb: ArbGroup, ticks = this.ticks) {
    const accMatch = this.accomulator.find(
      (acc) => acc[0] === this.arbTitle(arb),
    );
    if (accMatch) {
      return accMatch[1] >= ticks;
    } else {
      return false;
    }
  }

  private arbTitle(arb: ArbGroup) {
    return arb.map(({ bet }) => bet.title).join(' ~ ');
  }
}
