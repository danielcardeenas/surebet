export interface BalanceResponse {
  Data: Data;
  valid: string;
}

interface Data {
  AmountAtRisk: string;
  AvailBalance: string;
  BonusPoints: string;
  Currency: string;
  CurrentBalance: string;
  FreePlayAmount: string;
  IdCurrency: string;
  IdPlayer: string;
  LastMoneyChange: string;
  RolloverBalance: string;
  DisplayRolloverBalance: string;
  IsOneTimeRo: string;
  PlayerID: string;
  RealBalance: string;
  IsCreditPlayer: boolean;
}
