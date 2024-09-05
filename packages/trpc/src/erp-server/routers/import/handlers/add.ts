import { addImportSchema } from '@core/validation/erp/import/add.schema';
import { tenantProcedure } from '../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';
import { parseImportSchema } from '../utils/parse-import-schema.js';
import { readExcel } from '../../../utils/reader.js';
import { Context } from '../../../context.js';
import {
  importGoodsMapSchema,
  importSchemaSchema,
} from '@core/validation/erp/import/schema/schema.schema';
import { z } from 'zod';
import { addUtil } from '../../good/utils/add.js';
import { EditGoodExistingDataInput, editUtil } from '../../good/utils/edit.js';
import { Prisma, PrismaTX } from '@core/db';

type TransformedRow = {
  sku: string;
  price: Prisma.Decimal;
  discount: Prisma.Decimal;
  fullPrice: Prisma.Decimal;
  quantity: Prisma.Decimal;
  name: string;
  groupName: string;
  media: string[];
  retailGoodsGroupId: number;
  attributes?: { id: number; value: string }[];
  additionalIdentificators: { name: string; value: string }[];
};

export const addHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(addImportSchema)
  .mutation(async ({ ctx, input }) => {
    await ctx.tenantDb?.$transaction(async (tx) => {
      const [importObject, importSchemaData] = await Promise.all([
        ctx.aws?.s3.getObject({ key: input.importFileKey }),
        tx.importSchema.findUnique({
          where: {
            id: input.schemaId,
          },
          include: {
            additionalIdentificators: {
              orderBy: {
                index: 'asc',
              },
              select: {
                identificatorName: true,
              },
            },
          },
        }),
      ]);
      if (!importObject) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ctx.t?.('res:import.add.import_object_not_found'),
        });
      }
      if (!importObject.Body) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ctx.t?.('res:import.add.import_object_empty'),
        });
      }
      if (!importSchemaData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ctx.t?.('res:import.add.import_schema_not_found'),
        });
      }

      const importSchema = parseImportSchema(importSchemaData.schema);

      const transformedGoods: TransformedRow[] = [];

      if (
        importObject.ContentType === 'application/vnd.ms-excel' ||
        importObject.ContentType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        const goodsSheetName = importSchema.goods.sheetName;
        if (!goodsSheetName) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: ctx.t?.('res:import.add.no_goods_sheet_name'),
          });
        }

        const goodsJsonData = readExcel(
          await importObject.Body.transformToByteArray(),
          goodsSheetName,
        );
        if (!goodsJsonData) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: ctx.t?.('res:import.add.invalid_goods_sheet_name'),
          });
        }

        for (let i = 0; i < goodsJsonData.length; i++) {
          transformedGoods.push(
            await transformRow(
              goodsJsonData,
              i,
              importSchema.goods.map,
              importSchema.goods.organizeGoodsGroupsBy ?? [],
              ctx,
              tx,
              importSchema,
            ),
          );
        }
      }

      for (const good of transformedGoods) {
        let existingGood: EditGoodExistingDataInput | null = null;

        for (const {
          identificatorName,
        } of importSchemaData.additionalIdentificators) {
          const value = good.additionalIdentificators.find(
            (o) => o.name === identificatorName,
          )?.value;

          if (value) {
            const good = await ctx.tenantDb?.good.findFirst({
              where: {
                additionalIdentificators: {
                  some: {
                    identificatorName,
                    value,
                  },
                },
              },
              include: {
                additionalIdentificators: true,
                attributes: {
                  include: {
                    values: true,
                  },
                },
                media: {
                  include: {
                    file: true,
                  },
                },
                bulkPrices: true,
                retailPrices: true,
                stock: true,
                localizations: true,
              },
            });

            if (good) {
              existingGood = good;
              break;
            }
          }
        }

        const media: {
          key: string;
          type: string;
          name: string;
          size: number;
        }[] = [];
        for (const key of good.media) {
          const file = await ctx.tenantDb?.file.findUnique({
            where: {
              key,
            },
          });

          if (file) {
            media.push({
              key: file.key,
              type: file.type,
              name: file.name,
              size: file.size,
            });
          } else {
            const object = await ctx.aws?.s3.getObject({ key });

            const newFile = await ctx.tenantDb?.file.create({
              data: {
                key,
                name: key.split('/').pop() ?? '-',
                size: object?.ContentLength ?? 0,
                type: object?.ContentType ?? 'application/octet-stream',
              },
            });

            if (newFile) {
              media.push({
                key: newFile.key,
                type: newFile.type,
                name: newFile.name,
                size: newFile.size,
              });
            }
          }
        }

        const attributes: { id: number; valueIds: number[] }[] = [];
        for (const { id, value: attributeValue } of good.attributes ?? []) {
          const attribute = await ctx.tenantDb?.attribute.findUnique({
            where: {
              id,
            },
          });

          if (!attribute) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: ctx.t?.('res:import.add.attribute_not_found', { id }),
            });
          }

          const value = await ctx.tenantDb?.attributeValue.findFirst({
            where: {
              attributeId: id,
              localizations: {
                some: {
                  data: {
                    equals: JSON.stringify(attributeValue),
                  },
                },
              },
            },
          });

          if (value) {
            attributes.push({
              id,
              valueIds: [value.id],
            });
          } else {
            const newValue = await ctx.tenantDb?.attributeValue.create({
              data: {
                attributeId: id,
                dataType: 'STRING',
                localizations: {
                  create: {
                    data: JSON.stringify(attributeValue),
                    languageName: importSchema.languageName,
                  },
                },
              },
            });

            if (newValue) {
              attributes.push({
                id,
                valueIds: [newValue.id],
              });
            }
          }
        }
        if (existingGood) {
          await editUtil({
            editFields: importSchema.goods.editFields,
            tx,
            editData: {
              id: existingGood.id,
              media,
              attributes,
              distributionChannel: 'RETAIL',
              isArchived: false,
              sku: good.sku,
              additionalIdentificators: good.additionalIdentificators,
              retailPrices: [
                {
                  currencyId: importSchema.currency,
                  price: good.price,
                  discount: good.discount,
                  fullPrice: good.fullPrice,
                },
              ],
              localizations: [
                {
                  languageName: importSchema.languageName,
                  name: good.name,
                },
              ],
              stock: [
                {
                  stockpointId: importSchema.goods.stockpointId,
                  quantity: good.quantity,
                },
              ],
            },
            oldData: existingGood,
          });
        } else {
          await addUtil({
            data: {
              media,
              attributes,
              distributionChannel: 'RETAIL',
              isArchived: false,
              sku: good.sku,
              additionalIdentificators: good.additionalIdentificators,
              retailPrices: [
                {
                  currencyId: importSchema.currency,
                  price: good.price,
                  discount: good.discount,
                  fullPrice: good.fullPrice,
                },
              ],
              localizations: [
                {
                  languageName: importSchema.languageName,
                  name: good.name,
                },
              ],
              stock: [
                {
                  stockpointId: importSchema.goods.stockpointId,
                  quantity: good.quantity,
                },
              ],
            },
            tx,
          });
        }
      }
    });
  });

async function transformRow(
  rows: unknown[],
  index: number,
  map: z.infer<typeof importGoodsMapSchema>,
  organizeGoodsGroupsBy: string[],
  ctx: Context,
  tx: PrismaTX,
  importSchema: z.infer<typeof importSchemaSchema>,
) {
  const row = rows[index] as Record<string, unknown>;
  const result: TransformedRow = {
    sku: '',
    name: '',
    groupName: '',
    fullPrice: new Prisma.Decimal('0'),
    discount: new Prisma.Decimal('0'),
    price: new Prisma.Decimal('0'),
    retailGoodsGroupId: 0,
    additionalIdentificators: [],
    attributes: [],
    media: [],
    quantity: new Prisma.Decimal('0'),
  };

  if (row[map.sku]) {
    result.sku = row[map.sku] as string;
  } else {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: ctx.t?.('res:import.add.empty_sku', { index: index + 1 }),
    });
  }

  if (row[map.name]) {
    result.name = row[map.name] as string;
  }

  if (row[map.groupName]) {
    result.groupName = row[map.groupName] as string;
  }

  if (map.quantity && row[map.quantity]) {
    const quantity = row[map.quantity] ? String(row[map.quantity]) : '0';

    result.quantity = new Prisma.Decimal(quantity);
  }

  if (row[map.fullPrice]) {
    const fullPrice = row[map.fullPrice] ? String(row[map.fullPrice]) : '0';

    result.fullPrice = new Prisma.Decimal(fullPrice);
  }

  if (map.discount && row[map.discount]) {
    const discount = row[map.discount] ? String(row[map.discount]) : '0';

    result.discount = new Prisma.Decimal(discount);
  }

  if (map.price && row[map.price]) {
    const price = row[map.price] ? String(row[map.price]) : '0';

    result.price = new Prisma.Decimal(price);
  }

  for (const additionalIdentificator of map.additionalIdentificators) {
    if (row[additionalIdentificator.field]) {
      result.additionalIdentificators.push({
        name: additionalIdentificator.name,
        value: String(row[additionalIdentificator.field]),
      });
    }
  }

  if (map.attributes) {
    for (const attribute of map.attributes) {
      if (row[attribute.field]) {
        result.attributes?.push({
          id: attribute.id,
          value: String(row[attribute.field]),
        });
      }
    }
  }

  if (map.media) {
    if (row[map.media.field]) {
      const mediaArray = String(row[map.media.field])
        .replace(/ /g, '')
        .split(',');

      if (mediaArray.length === 1) {
        if (map.media.type === 'key') {
          for (const item of mediaArray) {
            const key = ctx.aws?.s3.getKey({
              path: 'Tenants/<tenantId>/Public/Goods/Media/<goodId>/Original',
              fileName: item,
              tenantId: ctx.session?.currentOrganization?.id,
            });

            if (key) {
              result.media.push(key);
            }
          }
        }
      }
    }
  }

  let groupIdentifier = '';
  for (const field of organizeGoodsGroupsBy) {
    if (row[field]) {
      groupIdentifier += String(row[field]);
    }
  }

  const goodsGroup = await tx.goodsRetailGroup.findFirst({
    where: {
      additionalIdentificators: {
        some: {
          name: groupIdentifier,
        },
      },
    },
  });

  if (goodsGroup) {
    result.retailGoodsGroupId = goodsGroup.id;
  } else {
    const newGoodsGroup = await tx.goodsRetailGroup.create({
      data: {
        additionalIdentificators: {
          create: {
            name: groupIdentifier,
          },
        },
        localizations: {
          create: {
            languageName: importSchema.languageName,
            name: result.groupName,
            description: '',
            focusKeyword: '',
            metaDesc: '',
            metaTitle: '',
            slug: '',
          },
        },
      },
    });

    result.retailGoodsGroupId = newGoodsGroup.id;
  }

  return result;
}
