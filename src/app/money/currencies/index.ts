import { cryptos } from './crypto';
import { fiats } from './fiat';

export const currencies = { ...cryptos, ...fiats };
export const money = currencies;
