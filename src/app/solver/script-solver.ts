import * as bookies from '@bookies';
import { Bookie } from '@bookies';
import { BetEvent, BookieName, InputScript } from '@models';
import { money } from '@money/currencies';

const solvePath = <R>(obj: any, path: string) =>
  path.split('.').reduce((o, i) => o[i], obj) as R;

export class ScriptSolver {
  /**
   * Creates arber retrieves from input script
   * @param scripts
   * @returns
   */
  static async solve(scripts: InputScript[]) {
    const _bookies = this.scriptsToInstancers(scripts).map((instancer) =>
      instancer(),
    );
    const bookies = await Promise.all(_bookies);

    const _authenticators = bookies.map((bookie, index) => {
      const credentials = scripts[index].credentials;
      if (!credentials) {
        return () => null;
      }

      return () => bookie.login(credentials);
    });

    const retrievers = bookies.map((bookie, index) => {
      const path = scripts[index].retriever;
      return {
        bookie: bookie,
        retriever: () =>
          solvePath<() => Promise<BetEvent[]>>(bookie.repo(), path)(),
      };
    });

    // Login
    await Promise.all(_authenticators.map((auther) => auther()));

    return retrievers;
  }

  /**
   * Transforms native scripts into instancers functions
   * @param scripts
   * @returns
   */
  private static scriptsToInstancers(
    scripts: {
      bookieName: BookieName;
      args: {
        config: {
          headless: boolean;
        };
        currencyCode: string;
      };
    }[],
  ): (() => Promise<Bookie>)[] {
    const bookiesAvaialble = () => {
      return Object.keys(bookies).map((bookieName) => {
        return bookies[bookieName];
      });
    };

    const books = bookiesAvaialble();
    return scripts.map((script) => {
      const signature = books.find((sign) => sign.name === script.bookieName);
      const currency = money[script.args.currencyCode];
      const config = { ...script.args.config };
      if (!currency || !signature) {
        return () => null;
      }

      return () => signature.instance(config, currency);
    });
  }
}
