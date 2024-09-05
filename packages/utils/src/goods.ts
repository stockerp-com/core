export const DISTRIBUTION_CHANNELS = ['BULK', 'RETAIL'] as const;
export type DistributionChannel = (typeof DISTRIBUTION_CHANNELS)[number];
