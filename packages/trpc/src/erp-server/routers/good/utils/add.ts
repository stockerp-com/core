import { PrismaTX } from '@core/db';
import { calculatePriceDiscountFullPrice } from '@core/utils/financial';
import { AddGoodSchemaInput } from '@core/validation/erp/good/add.schema';

export async function addUtil({
  data,
  tx,
}: {
  data: AddGoodSchemaInput;
  tx: PrismaTX;
}) {
  return tx.good.create({
    data: {
      retailGroupId: data.retailGroupId,
      distributionChannel: data.distributionChannel,
      sku: data.sku,
      isArchived: data.isArchived,
      additionalIdentificators:
        data.additionalIdentificators &&
        data.additionalIdentificators.length > 0
          ? {
              createMany: {
                data: data.additionalIdentificators.map(({ name, value }) => ({
                  identificatorName: name,
                  value,
                })),
              },
            }
          : undefined,
      retailPrices:
        data.retailPrices && data.retailPrices.length > 0
          ? {
              createMany: {
                skipDuplicates: true,
                data: data.retailPrices.map((retailPrice) => ({
                  ...calculatePriceDiscountFullPrice(
                    retailPrice.price,
                    retailPrice.discount,
                    retailPrice.fullPrice,
                  ),
                  currencyId: retailPrice.currencyId,
                })),
              },
            }
          : undefined,
      bulkPrices:
        data.bulkPrices && data.bulkPrices.length > 0
          ? {
              createMany: {
                skipDuplicates: true,
                data: data.bulkPrices.map((bulkPrice) => ({
                  ...calculatePriceDiscountFullPrice(
                    bulkPrice.price,
                    bulkPrice.discount,
                    bulkPrice.fullPrice,
                  ),
                  currencyId: bulkPrice.currencyId,
                })),
              },
            }
          : undefined,
      media:
        data.media && data.media.length > 0
          ? {
              create: data.media.map((file, index) => ({
                file: {
                  connectOrCreate: {
                    where: {
                      key: file.key,
                    },
                    create: file,
                  },
                },
                index,
              })),
            }
          : undefined,
      attributes:
        data.attributes && data.attributes.length > 0
          ? {
              create: data.attributes.map((attribute, index) => ({
                attributeId: attribute.id,
                index,
                values: {
                  connect: attribute.valueIds.map((id) => ({
                    id,
                  })),
                },
              })),
            }
          : undefined,
      stock:
        data.stock && data.stock.length > 0
          ? {
              createMany: {
                data: data.stock.map(({ quantity, stockpointId }) => ({
                  quantity,
                  stockpointId,
                })),
              },
            }
          : undefined,
      localizations:
        data.localizations && data.localizations.length > 0
          ? {
              createMany: {
                data: data.localizations.map(({ language, name }) => ({
                  language,
                  name,
                })),
              },
            }
          : undefined,
    },
  });
}
