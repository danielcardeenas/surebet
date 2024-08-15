import * as puppeteer from 'puppeteer';
import { Observable } from 'rxjs';
import { BookieReference } from '../bookies/playdoit/models';
import { Genetic } from '../genetics';
import { BookieName } from './defs/bookie-name.enum';
import { PostulateResult } from './types/postulate-result';

export type ExchangeType = 'lay' | 'back';

export interface Bet extends PartialBet {
  element: puppeteer.ElementHandle<Element>;
  postulate: (amount: number | string, ...args: any[]) => Promise<PostulateResult>;
  place: () => Promise<boolean>;
  clean?: () => Promise<boolean>;
  track?: (polling?: number) => Observable<Bet>;
  genetic?: Genetic;
  bookie?: BookieName;
  page?: puppeteer.Page | BookieReference;
}

export interface PartialBet {
  title: string;
  odds: number;
  exchangeType?: ExchangeType;
}

export type BetGroup = Bet[];
