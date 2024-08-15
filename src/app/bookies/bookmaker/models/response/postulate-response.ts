// Endpoint: BetslipProxy.aspx/GetMaxRiskAsync
export interface PostulateResponse {
  Limits: Limits;
}

interface Limits {
  IsRelated: boolean;
  MaxPayout: number;
  PlayerLimit: number;
  Games: Games;
}

interface Games {
  Game: Game[];
}

interface Game {
  Id: number;
  Limit: number;
  Multiplier: number;
  PlayerMultiplier: number;
  Play: number;
}
