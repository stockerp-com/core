export const S3_PATHS = [
  'Tenants/<tenantId>/Private/Imports',
  'Tenants/<tenantId>/Private/Documents',
  'Tenants/<tenantId>/Private/Exports',
  'Tenants/<tenantId>/Private/Analytics',
  'Tenants/<tenantId>/Private/Messages/Attachments',
  'Tenants/<tenantId>/Public/Exports',
  'Tenants/<tenantId>/Public/Customers/Avatars',
  'Tenants/<tenantId>/Public/Customers/Attachments',
  'Tenants/<tenantId>/Public/Goods/Media/<goodId>/Compressed',
  'Tenants/<tenantId>/Public/Goods/Media/<goodId>/Original',
  'Tenants/<tenantId>/Public/Categories/Media/<categoryId>/Compressed',
  'Tenants/<tenantId>/Public/Categories/Media/<categoryId>/Original',
  'Shared/Employees/Avatars',
  'Shared/Assets',
  'Shared/Docs',
  'System/Backups',
  'System/Logs',
  'System/Configs',
  'System/Temp',
] as const;
export type S3Path = (typeof S3_PATHS)[number];
