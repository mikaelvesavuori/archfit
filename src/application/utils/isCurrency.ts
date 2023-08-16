import { Currency } from '../../interfaces/Currency';

/**
 * @description Checks if the given string is a valid AWS-supported currency.
 */
export function isCurrency(value: string): value is Currency {
  return [
    'AUD',
    'BRL',
    'CAD',
    'CHF',
    'CNY',
    'DKK',
    'EUR',
    'GBP',
    'HKD',
    'JPY',
    'KRW',
    'MYR',
    'NOK',
    'NZD',
    'SEK',
    'SGD',
    'USD',
    'ZAR'
  ].includes(value);
}
