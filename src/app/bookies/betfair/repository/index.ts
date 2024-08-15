import { ExchangeType } from '@models';
import { Browser, Page } from 'puppeteer';
import { BasketballH2H } from './live/basketball/basketball-h2h';
import { MMAH2H } from './live/mma/mma-h2h';
import { Soccer1x2 } from './live/soccer/soccer-1x2';
import { TennisH2H } from './live/tennis/tennis-h2h';
import { PreliveTennisH2H } from './prelive/tennis/tennis-h2h.prelive';

export const repo = (page: Page, browser: Browser) => {
  return {
    live: {
      tennis: {
        h2h: (options: { include: ExchangeType[] } = { include: ['back'] }) =>
          TennisH2H.get(browser, page, options),
      },
      basketball: {
        h2h: (options: { include: ExchangeType[] } = { include: ['back'] }) =>
          BasketballH2H.get(browser, page, options),
      },
      soccer: {
        _1x2: (options: { include: ExchangeType[] } = { include: ['back'] }) =>
          Soccer1x2.get(browser, page, options),
      },
      mma: {
        h2h: (options: { include: ExchangeType[] } = { include: ['back'] }) =>
          MMAH2H.get(browser, page, options),
      },
    },
    prelive: {
      tennis: {
        h2h: (options: { include: ExchangeType[] } = { include: ['back'] }) =>
          PreliveTennisH2H.get(browser, page, options),
      },
    },
  };
};
