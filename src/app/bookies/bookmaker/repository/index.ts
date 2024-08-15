import { Browser, Page } from 'puppeteer';
import { BasketballH2H } from './live/basketball/basketball-h2h';
import { TableTennisH2H } from './live/table-tennis/table-tennis-h2h';
import { TennisH2H } from './live/tennis/tennis-h2h';
import { UFCH2H } from './live/ufc/ufc-h2h';

export const repo = (page: Page, browser: Browser) => {
  return {
    live: {
      tennis: {
        h2h: () => TennisH2H.get(page, browser),
      },
      tableTennis: {
        h2h: () => TableTennisH2H.get(page, browser),
      },
      basketball: {
        h2h: () => BasketballH2H.get(page, browser),
      },
      ufc: {
        h2h: () => UFCH2H.get(page, browser),
      },
    },
  };
};
