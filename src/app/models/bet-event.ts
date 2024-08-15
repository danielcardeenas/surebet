import * as puppeteer from 'puppeteer';
import { Bet } from './bet';
import { BookieName } from './defs/bookie-name.enum';

export interface BetEvent {
  bets: Bet[];
  bookie: BookieName;
  title: string;
}
