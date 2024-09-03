import { S3Path } from '@core/utils/s3';
import { trpcQueryUtils } from '../router';
import { toast } from '@core/ui/lib/toast';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { randomId } from '../utils/random';
import { z } from 'zod';
import { fileField } from '@core/validation/utils/common';

type UploadingObject = {
  id: string;
  key: string | null;
  uploadUrl: string | null;
  file: File | null;
  index: number;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'error' | 'success';
};

export function useObjectStorage() {
  const { t } = useTranslation();
  const [uploadState, setUploadState] = useState<UploadingObject[]>([]);

  return {
    uploadState,
    getObjectUrl(props: { key: string }) {
      if (props.key.includes('/Private/')) {
        return trpcQueryUtils.aws.cloudfront.getPrivateUrl.fetch({
          key: props.key,
        });
      }

      return `https://${import.meta.env.VITE_AWS_CLOUDFRONT_DOMAIN}/${props.key}`;
    },
    async putObjects(
      props: {
        path: S3Path;
        files: {
          file: File;
          index: number;
        }[];
        categoryId?: number;
        goodId?: number;
        tenantId?: number;
      },
      callback: (objects: z.infer<typeof fileField>[]) => void,
    ) {
      const objects: UploadingObject[] = props.files.map(({ file, index }) => ({
        id: randomId(),
        file,
        index,
        key: null,
        uploadUrl: null,
        status: 'pending',
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setUploadState(objects);

      await Promise.all(
        objects.map(async (object) => {
          const { url, key } = await trpcQueryUtils.aws.s3.presignPutUrl.fetch({
            path: props.path,
            categoryId: props.categoryId,
            goodId: props.goodId,
            tenantId: props.tenantId,
          });

          object.key = key;
          object.uploadUrl = url;
        }),
      );

      await Promise.all(
        objects.map(async (object) => {
          try {
            await fetch(object.uploadUrl as string, {
              method: 'PUT',
              body: object.file,
              headers: {
                'Content-Type': object.type,
                'Content-Length': object.size.toString(),
              },
            });

            object.status = 'success';
            object.file = null;
            const newObjects = [...uploadState];
            const index = newObjects.findIndex((o) => o.id === object.id);
            newObjects[index] = object;
            setUploadState(newObjects);
          } catch (error) {
            object.status = 'error';
            toast.error(
              t('res:aws.s3.put_object.failed', {
                count: objects.length,
              }),
            );
          }
        }),
      );

      callback(
        objects.map(({ key, index, name, size, type }) => ({
          key: key as string,
          index,
          name,
          size,
          type,
        })),
      );
    },
  };
}
