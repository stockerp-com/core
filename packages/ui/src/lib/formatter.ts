export const formatPercentage = (value: number, locale?: string) =>
  value.toLocaleString(locale ?? 'default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatCurrency = (
  value: number,
  currency: 'USD' | 'EUR' | 'GBP' | 'UAH' | 'RUB',
  locale?: string,
) =>
  value.toLocaleString(locale ?? 'default', {
    style: 'currency',
    currency,
  });

export const formatNameToShorthand = (value: string) =>
  value
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2);
