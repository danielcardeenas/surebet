export interface Currency {
  code: string;
  minorUnit: number;
  name: string;
}

export type Fiat = Currency & {
  numericCode: number;
};

export type Crypto = Currency & {};
