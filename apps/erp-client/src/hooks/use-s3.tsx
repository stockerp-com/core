import { PresignPutUrlInput } from '@retailify/validation/erp/s3/presign-put-url.schema';
import { trpc } from '../utils/trpc';
import { useTranslation } from 'react-i18next';

export default function useS3() {
  const utils = trpc.useUtils();
  const { t } = useTranslation();

  return {
    upload: async (file: File, dir: PresignPutUrlInput['dir']) => {
      try {
        const presignPutUrlResponse = await utils.s3.presignPutUrl.fetch({
          dir,
        });

        if (!presignPutUrlResponse) {
          throw new Error('Could not get presignPutUrl');
        }

        const uploadResponse = await sendPutRequestToS3(
          file,
          presignPutUrlResponse.url,
        );

        if (!uploadResponse.ok) {
          throw new Error('Could not upload file');
        }

        return {
          data: {
            key: presignPutUrlResponse.key,
            name: file.name,
            size: file.size,
            type: file.type,
          },
        };
      } catch (error) {
        console.error(error);
        throw new Error(t('res:s3.upload.error'));
      }
    },
  };
}

function sendPutRequestToS3(file: File, url: string) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });
}
