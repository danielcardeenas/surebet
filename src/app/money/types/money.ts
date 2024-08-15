import { Currency } from './currency';

/**
 * Represents money as its most simple form
 * Its amount and its currency
 */
export interface Money {
  amount: number;
  currency: Currency;
}
