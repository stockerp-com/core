export const DISTRIBUTION_CHANNELS = ['BULK', 'RETAIL'] as const;
export type DistributionChannel = (typeof DISTRIBUTION_CHANNELS)[number];

export const ATTRIBUTE_VALUE_TYPES = [
  'STRING',
  'NUMBER',
  'BOOLEAN',
  'DATE',
  'COLOR',
] as const;
export type AttributeValueType = (typeof ATTRIBUTE_VALUE_TYPES)[number];
