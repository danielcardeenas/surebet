export class OddsConverter {
  public static decimal = {
    toAmerican: function (decimal: number) {
      let moneyline: string;
      decimal < 2.0
        ? (moneyline = (-100 / (decimal - 1)).toPrecision(5))
        : (moneyline = ((decimal - 1) * 100).toPrecision(5));
      return +moneyline;
    },
  };
  public static american = {
    toDecimal: function (moneyline: number) {
      if (moneyline === 0) {
        return 0;
      }

      let decimal: string | number;
      moneyline > 0
        ? (decimal = moneyline / 100 + 1)
        : (decimal = (100 / Math.abs(moneyline) + 1).toPrecision(3));
      return +decimal;
    },
  };
}
