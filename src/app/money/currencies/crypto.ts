export const cryptos = {
  BTC: {
    code: 'BTC',
    minorUnit: 8,
    name: 'Bitcoin',
  },
  LTC: {
    code: 'LTC',
    minorUnit: 8,
    name: 'Litecoin',
  },
  ETH: {
    code: 'ETH',
    minorUnit: 18,
    name: 'Ethereum',
  },
  USDT: {
    code: 'USDT',
    minorUnit: 2,
    name: 'Tether',
  },
  /**
   * Custom cloudbet helper maker. CloudBet uses 4 minor units
   */
  cloudBet: (custom: { code: string; name: string }) => {
    return {
      code: custom.code,
      minorUnit: 4,
      name: custom.name,
    };
  },
};
