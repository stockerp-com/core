import { CurrencyId, DistributionChannel, Prisma, PrismaTX } from '@core/db';
import { trackArrayObjectsChanges } from '@core/utils/array';
import { calculatePriceDiscountFullPrice } from '@core/utils/financial';
import {
  EditGoodFieldsSchemaInput,
  EditGoodSchemaInput,
} from '@core/validation/erp/good/edit.schema';

export type EditGoodExistingDataInput = Prisma.GoodGetPayload<{
  include: {
    additionalIdentificators: true;
    retailPrices: true;
    bulkPrices: true;
    media: {
      include: {
        file: true;
      };
    };
    attributes: {
      include: {
        values: true;
      };
    };
    stock: true;
    localizations: true;
  };
}>;

export async function editUtil({
  editData,
  oldData,
  editFields,
  tx,
}: {
  editData: EditGoodSchemaInput;
  oldData: EditGoodExistingDataInput;
  editFields: EditGoodFieldsSchemaInput;
  tx: PrismaTX;
}) {
  const goodId = editData.id;
  if (!goodId || !oldData || !oldData.id) return;

  let retailGroupId: number | undefined;
  if (editFields.retailGroupId) {
    retailGroupId = editData.retailGroupId;
  }

  let distributionChannel: DistributionChannel | undefined;
  if (editFields.distributionChannel) {
    distributionChannel = editData.distributionChannel;
  }

  let sku: string | undefined;
  if (editFields.sku) {
    sku = editData.sku;
  }

  let isArchived: boolean | undefined;
  if (editFields.isArchived) {
    isArchived = editData.isArchived;
  }

  let additionalIdentificators:
    | Prisma.AdditionalGoodIdentificatorValueUncheckedUpdateManyWithoutGoodNestedInput
    | undefined;
  if (editFields.additionalIdentificators.edit) {
    const oldDataArray = oldData.additionalIdentificators
      ? oldData.additionalIdentificators.map((item) => ({
          name: item.identificatorName,
          value: item.value,
        }))
      : [];

    const newDataArray = editData.additionalIdentificators || [];

    const { newData, updatedData, deletedData } = trackArrayObjectsChanges(
      oldDataArray,
      newDataArray,
      ['name', 'value'],
    );

    additionalIdentificators = {
      createMany:
        newData && newData.length > 0
          ? {
              data: newData.map(({ item }) => ({
                identificatorName: item.name,
                value: item.value,
              })),
            }
          : undefined,
      update:
        updatedData && updatedData.length > 0
          ? updatedData.map(({ item }) => ({
              where: {
                identificatorName_goodId: {
                  goodId,
                  identificatorName: item.name,
                },
              },
              data: {
                value: item.value,
              },
            }))
          : undefined,
      deleteMany:
        editFields.additionalIdentificators.delete &&
        deletedData &&
        deletedData.length > 0
          ? {
              goodId,
              identificatorName: {
                in: deletedData.map(({ name }) => name),
              },
            }
          : undefined,
    };
  }

  let retailPrices:
    | Prisma.RetailPriceUncheckedUpdateManyWithoutGoodNestedInput
    | undefined;
  if (editFields.retailPrices.edit) {
    const oldDataArray = oldData.retailPrices
      ? oldData.retailPrices.map((item) => ({
          currencyId:
            item.currencyId as (typeof CurrencyId)[keyof typeof CurrencyId],
          price: item.price,
          discount: item.discount,
          fullPrice: item.fullPrice,
        }))
      : [];

    const newDataArray = editData.retailPrices
      ? editData.retailPrices.map((item) => ({
          currencyId: item.currencyId,
          price: item.price,
          discount: item.discount || new Prisma.Decimal('0'),
          fullPrice: item.fullPrice || new Prisma.Decimal('0'),
        }))
      : [];

    const { newData, updatedData, deletedData } = trackArrayObjectsChanges(
      oldDataArray,
      newDataArray,
      ['currencyId', 'price'],
    );

    retailPrices = {
      createMany:
        newData && newData.length > 0
          ? {
              data: newData.map(({ item }) => ({
                ...calculatePriceDiscountFullPrice(
                  item.price,
                  item.discount,
                  item.fullPrice,
                ),
                currencyId: item.currencyId,
              })),
            }
          : undefined,
      update:
        updatedData && updatedData.length > 0
          ? updatedData.map(({ item }) => ({
              where: {
                goodId_currencyId: {
                  currencyId: item.currencyId,
                  goodId,
                },
              },
              data: calculatePriceDiscountFullPrice(
                item.price,
                item.discount,
                item.fullPrice,
              ),
            }))
          : undefined,
      deleteMany:
        editFields.retailPrices.delete && deletedData && deletedData.length > 0
          ? {
              goodId,
              currencyId: {
                in: deletedData.map(({ currencyId }) => currencyId),
              },
            }
          : undefined,
    };
  }

  let bulkPrices:
    | Prisma.BulkPriceUncheckedUpdateManyWithoutGoodNestedInput
    | undefined;
  if (editFields.bulkPrices.edit) {
    const oldDataArray = oldData.bulkPrices
      ? oldData.bulkPrices.map((item) => ({
          currencyId:
            item.currencyId as (typeof CurrencyId)[keyof typeof CurrencyId],
          price: item.price,
          discount: item.discount,
          fullPrice: item.fullPrice,
        }))
      : [];

    const newDataArray = editData.bulkPrices
      ? editData.bulkPrices.map((item) => ({
          currencyId: item.currencyId,
          price: item.price,
          discount: item.discount || new Prisma.Decimal('0'),
          fullPrice: item.fullPrice || new Prisma.Decimal('0'),
        }))
      : [];

    const { newData, updatedData, deletedData } = trackArrayObjectsChanges(
      oldDataArray,
      newDataArray,
      ['currencyId', 'price'],
    );

    bulkPrices = {
      createMany:
        newData && newData.length > 0
          ? {
              data: newData.map(({ item }) => ({
                ...calculatePriceDiscountFullPrice(
                  item.price,
                  item.discount,
                  item.fullPrice,
                ),
                currencyId: item.currencyId,
              })),
            }
          : undefined,
      update:
        updatedData && updatedData.length > 0
          ? updatedData.map(({ item }) => ({
              where: {
                goodId_currencyId: {
                  currencyId: item.currencyId,
                  goodId,
                },
              },
              data: calculatePriceDiscountFullPrice(
                item.price,
                item.discount,
                item.fullPrice,
              ),
            }))
          : undefined,
      deleteMany:
        editFields.bulkPrices.delete && deletedData && deletedData.length > 0
          ? {
              goodId,
              currencyId: {
                in: deletedData.map(({ currencyId }) => currencyId),
              },
            }
          : undefined,
    };
  }

  let media:
    | Prisma.GoodMediaUncheckedUpdateManyWithoutGoodNestedInput
    | undefined;
  if (editFields.media.edit) {
    const oldDataArray = oldData.media
      ? oldData.media
          .sort((a, b) => (a.index > b.index ? 1 : -1))
          .map(({ file }) => ({
            key: file.key,
            name: file.name,
            type: file.type,
            size: file.size,
          }))
      : [];

    const newDataArray = editData.media || [];

    const { newData, updatedData, deletedData } = trackArrayObjectsChanges(
      oldDataArray,
      newDataArray,
      ['key'],
      true,
    );

    media = {
      create:
        newData && newData.length > 0
          ? newData.map(({ index, item }) => ({
              file: {
                connectOrCreate: {
                  where: {
                    key: item.key,
                  },
                  create: item,
                },
              },
              index,
            }))
          : undefined,
      update:
        updatedData && updatedData.length > 0
          ? updatedData.map(({ item, newIndex }) => ({
              where: {
                fileKey_goodId: {
                  fileKey: item.key,
                  goodId,
                },
              },
              data: {
                index: newIndex,
              },
            }))
          : undefined,
      deleteMany:
        editFields.media.delete && deletedData && deletedData.length > 0
          ? {
              goodId,
              fileKey: {
                in: deletedData.map(({ key }) => key),
              },
            }
          : undefined,
    };
  }

  let attributes:
    | Prisma.GoodAttributesUncheckedUpdateManyWithoutGoodNestedInput
    | undefined;
  if (editFields.attributes.edit) {
    const oldDataArray = oldData.attributes
      ? oldData.attributes
          .sort((a, b) => (a.index > b.index ? 1 : -1))
          .map(({ attributeId, values }) => ({
            id: attributeId,
            valueIds: values.map(({ id }) => id),
          }))
      : [];

    const newDataArray = editData.attributes || [];

    const { newData, deletedData, updatedData } = trackArrayObjectsChanges(
      oldDataArray,
      newDataArray,
      ['id', 'valueIds'],
      true,
    );

    attributes = {
      create:
        newData && newData.length > 0
          ? newData.map(({ index, item }) => ({
              attributeId: item.id,
              index,
              values: {
                connect: item.valueIds.map((id) => ({
                  id,
                })),
              },
            }))
          : undefined,
      update:
        updatedData && updatedData.length > 0
          ? updatedData.map(({ item, newIndex }) => ({
              where: {
                attributeId_goodId: {
                  goodId,
                  attributeId: item.id,
                },
              },
              data: {
                index: newIndex,
              },
            }))
          : undefined,
      deleteMany:
        editFields.attributes.delete && deletedData && deletedData.length > 0
          ? {
              goodId,
              attributeId: {
                in: deletedData.map(({ id }) => id),
              },
            }
          : undefined,
    };
  }

  let stock: Prisma.StockUncheckedUpdateManyWithoutGoodNestedInput | undefined;
  if (editFields.stock.edit) {
    const oldDataArray = oldData.stock
      ? oldData.stock.map(({ quantity, stockpointId }) => ({
          quantity,
          stockpointId,
        }))
      : [];

    const newDataArray = editData.stock || [];

    const { newData, deletedData, updatedData } = trackArrayObjectsChanges(
      oldDataArray,
      newDataArray,
      ['stockpointId', 'quantity'],
    );

    stock = {
      createMany:
        newData && newData.length > 0
          ? {
              data: newData.map(({ item }) => ({
                stockpointId: item.stockpointId,
                quantity: item.quantity,
              })),
            }
          : undefined,
      update:
        updatedData && updatedData.length > 0
          ? updatedData.map(({ item }) => ({
              where: {
                stockpointId_goodId: {
                  goodId,
                  stockpointId: item.stockpointId,
                },
              },
              data: {
                quantity: item.quantity,
              },
            }))
          : undefined,
      deleteMany:
        editFields.stock.delete && deletedData && deletedData.length > 0
          ? {
              goodId,
              stockpointId: {
                in: deletedData.map(({ stockpointId }) => stockpointId),
              },
            }
          : undefined,
    };
  }

  let localizations:
    | Prisma.GoodLocalizationUncheckedUpdateManyWithoutGoodNestedInput
    | undefined;
  if (editFields.localizations.edit) {
    const oldDataArray = oldData.localizations
      ? oldData.localizations.map(({ locale, name }) => ({
        locale,
          name,
        }))
      : [];

    const newDataArray = editData.localizations || [];

    const { newData, deletedData, updatedData } = trackArrayObjectsChanges(
      oldDataArray,
      newDataArray,
      ['locale', 'name'],
    );

    localizations = {
      createMany:
        newData && newData.length > 0
          ? {
              data: newData.map(({ item }) => ({
                locale: item.locale,
                name: item.name,
              })),
            }
          : undefined,
      update:
        updatedData && updatedData.length > 0
          ? updatedData.map(({ item }) => ({
              where: {
                goodId_locale: {
                  goodId,
                  locale: item.locale,
                },
              },
              data: {
                locale: item.locale,
                name: item.name,
              },
            }))
          : undefined,
      deleteMany:
        editFields.localizations.delete && deletedData && deletedData.length > 0
          ? {
              goodId,
              locale: {
                in: deletedData.map(({ locale }) => locale),
              },
            }
          : undefined,
    };
  }

  return tx.good.update({
    where: {
      id: goodId,
    },
    data: {
      retailGroupId,
      distributionChannel,
      sku,
      isArchived,
      additionalIdentificators,
      retailPrices,
      bulkPrices,
      media,
      attributes,
      stock,
      localizations,
    },
  });
}
