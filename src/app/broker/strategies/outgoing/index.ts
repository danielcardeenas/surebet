import { arberClosed } from './arber-closed';
import { arberCreated } from './arber-created';
import { arberInvestmentUpdated } from './arber-investment-update';
import { arberPaused } from './arber-paused';
import { arberResumed } from './arber-resumed';
import { arberStatusUpdated } from './arber-status-updated';
import { bookieBalanceUpdated } from './bookie-balance-updated';
import { bookieClosed } from './bookie-closed';
import { bookieCreated } from './bookie-created';
import { bookieMaxing } from './bookie-maxing';
import { bookiePaused } from './bookie-paused';
import { bookieResumed } from './bookie-resumed';
import { bookieStatusUpdated } from './bookie-status-updated';
import { clientConnected } from './client-connected';

const repo = {
  clientConnected: clientConnected,
  bookieCreated: bookieCreated,
  bookiePaused: bookiePaused,
  bookieResumed: bookieResumed,
  bookieClosed: bookieClosed,
  bookieMaxing: bookieMaxing,
  bookieBalanceUpdated: bookieBalanceUpdated,
  bookieStatusUpdated: bookieStatusUpdated,
  arberCreated: arberCreated,
  arberPaused: arberPaused,
  arberResumed: arberResumed,
  arberClosed: arberClosed,
  arberInvestmentUpdated: arberInvestmentUpdated,
  arberStatusUpdated: arberStatusUpdated,
};

export { repo };

