import { Decimal } from 'decimal.js';

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'UAH'] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export function calculatePriceDiscountFullPrice(
  price: Decimal = new Decimal(0),
  discount: Decimal = new Decimal(0),
  fullPrice: Decimal = new Decimal(0),
) {
  const priceDecimal = new Decimal(price);
  const discountDecimal = new Decimal(discount);
  let fullPriceDecimal = new Decimal(fullPrice);

  const zero = new Decimal(0);
  const hundred = new Decimal(100);

  if (
    !priceDecimal.eq(zero) &&
    !discountDecimal.eq(zero) &&
    fullPriceDecimal.eq(zero)
  ) {
    // Case 1: Price and discount are provided, but full price is not
    fullPriceDecimal = priceDecimal.div(
      Decimal.sub(1, discountDecimal.div(hundred)),
    );
  } else if (
    !priceDecimal.eq(zero) &&
    discountDecimal.eq(zero) &&
    !fullPriceDecimal.eq(zero)
  ) {
    // Case 2: Price and full price are provided, but discount is not
    const discountAmount = fullPriceDecimal.sub(priceDecimal);
    const discountPercent = discountAmount.div(fullPriceDecimal).mul(hundred);
    return {
      price: priceDecimal,
      discount: discountPercent,
      fullPrice: fullPriceDecimal,
    };
  } else if (
    !priceDecimal.eq(zero) &&
    discountDecimal.eq(zero) &&
    fullPriceDecimal.eq(zero)
  ) {
    // Case 3: Only price is provided
    // Assume no discount and no full price
    return {
      price: priceDecimal,
      discount: zero,
      fullPrice: priceDecimal,
    };
  } else {
    // Invalid input or other cases
    return {
      price: zero,
      discount: zero,
      fullPrice: zero,
    };
  }

  // Ensure discount is a percentage with 7 digits of precision and within the maximum value
  const maxDiscount = new Decimal('99999.9999999');
  const adjustedDiscount = Decimal.min(
    maxDiscount,
    discountDecimal.toDecimalPlaces(7),
  );

  return {
    price: priceDecimal,
    discount: adjustedDiscount,
    fullPrice: fullPriceDecimal,
  };
}
