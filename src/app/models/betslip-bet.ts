import { Observable } from 'rxjs';

export interface BetslipBetPartial {
  pick: {
    name: string;
    odds: number;
    eventDate: string;
    eventName: string;
    id: string;
    betDate: string;
  };
  money: {
    stake: number;
    winnings: number;
    cashout: number;
  };
}

export interface BetslipBet extends BetslipBetPartial {
  cashout: () => Promise<{
    confirmed: boolean;
    cash: number;
  }>;
  listen: (
    polling?: number,
  ) => Observable<{
    cash: number;
    cashout: () => Promise<{ confirmed: boolean; cash: number }>;
  }>;
}
