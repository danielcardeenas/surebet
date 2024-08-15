// Endpoint: /GetConfig
export interface UserConfigResponse {
  PlayerConfig: PlayerConfig;
  HeaderConfig: HeaderConfig;
  FooterConfig: FooterConfig;
  valid: string;
  Global: Global;
}

interface FooterConfig {
  ShowAccount: string;
  ShowSettings: string;
  ShowSecurity: string;
  ShowLegal: string;
  ShowBetpointsFooterLink: boolean;
  ShowSports: string;
  ShowCasino: string;
  ShowRacebook: string;
  ShowContest: string;
  ShowBracketEntries: string;
  ShowBracketContest: string;
  ShowLiveBetting: string;
  ShowCashier: string;
  ShowRules: string;
  ShowFeedback: string;
  ShowReferAFriend: string;
  ShowReferAFriendBanner: string;
  ShowLoyaltyProgram: string;
  EnableParlayCards: string;
  ValidateCountry: string;
  ShowPromotions: string;
  ShowFooterFront: boolean;
  ShowSelfExclusion: boolean;
  ShowCommunicationPreferences: boolean;
  ShowResponsibleGaming: boolean;
  ShowTransferToPoker: string;
  ShowTransferFromPoker: string;
  ShowWelcomePromo: string;
  ShowReloadPromo: string;
  ShowCasinoPromo: string;
  ShowChangePassword: string;
  ShowPinCode: string;
}

interface Global {}

interface HeaderConfig {
  ShowSports: string;
  ShowCasino: string;
  ShowRacebook: string;
  ShowContest: string;
  ShowBracketContest: string;
  ShowBracketEntries: string;
  ShowMarchMadnessEntries: string;
  ShowInbox: string;
  ShowOpenBets: string;
  ShowHistory: string;
  ShowLiveBetting: string;
  ShowCashier: string;
  ShowBalanceAvailable: string;
  ShowBalanceAtRisk: string;
  ShowBalanceTotal: string;
  ShowBetPoints: string;
  ShowBalanceFreeplays: string;
  ShowBalances: string;
  ShowLoyaltyProgram: string;
  EnableParlayCards: string;
  ValidateCountry: string;
  ShowPromotions: string;
  ShowResponsibleGaming: string;
  ShowFinancialLimits: string;
  ShowSelfExclusion: string;
  ShowTimeOut: string;
  hideLinkToClassicInterface: string;
  ChatInHeader: boolean;
  showEntriesOnlyContest: boolean;
  showTransferToPoker: string;
  showChangeLanguage: string;
  showCasinoFront: string;
  showCasinoMultislotsFront: string;
  showLoyaltyFront: string;
}

interface PlayerConfig {
  BookId: number;
  Language: string;
  IdLanguage: string;
  LanguageCulture: string;
  LanguageCultureFull: string;
  Currency: string;
  CurrencySymbol: string;
  PitcherDefault: string;
  LineType: string;
  SessionId: string;
  Gmt: string;
  IdTimeZone: string;
  CountryISO: string;
  LoyaltyLevel: string;
  LoyaltyLevelID: string;
  PlayerIDName: string;
  PlayerIDNamePoker: string;
  PlayerFirstName: string;
  IdPlayer: string;
  OnlineMsg: string;
  LineStyle: string;
  SiteName: string;
  SiteId: string;
  IsDummyPlayer: boolean;
  PlayerRate: string;
  IsMaster: string;
  IsMaltaCountry: boolean;
  IsVipPlayer: boolean;
  EntriesOnlyContest_PlayerEntries: number;
  ProfileID: string;
  BookID: string;
  BookName: string;
  CertifiedAccess: string;
  EnabledLive: boolean;
  UseSkinMMX: boolean;
  FirstTimePlayer: string;
  RSessionId: number;
  LoginFormSignup: boolean;
  Email: string;
}
