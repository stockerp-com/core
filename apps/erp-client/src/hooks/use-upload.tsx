import { EmployeeSession } from '@core/constants';
import { toast } from '@core/ui/lib/toast';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UploadProps {
  accessToken: string;
  session: EmployeeSession;
  file: File;
  path: 'employees' | 'organizations';
  directory: string;
}

export default function useUpload() {
  const { t } = useTranslation();

  const [status, setStatus] = useState<{
    [key: string]: 'uploading' | 'error' | 'success';
  }>({});

  return {
    uploadStatus: status,
    uploadOne: async (props: UploadProps) => {
      setStatus((prev) => ({
        ...prev,
        [props.file.name]: 'uploading',
      }));

      try {
        const formData = new FormData();
        formData.append('file', props.file);
        formData.append('directory', props.directory);

        const response = await fetch(
          `${import.meta.env.VITE_WORKER_URL}/r2/${props.path}/${props.path === 'employees' ? props.session.id : props.session.organization?.id}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${props.accessToken}`,
            },
            body: formData,
          },
        );

        if (!response.ok) {
          setStatus((prev) => ({
            ...prev,
            [props.file.name]: 'error',
          }));
          toast.error(t('res:upload.failed', { filename: props.file?.name }));
          return null;
        }

        const data = await response.json();
        if (!data.key) {
          setStatus((prev) => ({
            ...prev,
            [props.file.name]: 'error',
          }));
          toast.error(t('res:upload.failed', { filename: props.file?.name }));
          return null;
        }

        return String(data.key);
      } catch (error) {
        setStatus((prev) => ({
          ...prev,
          [props.file.name]: 'error',
        }));
        return null;
      }
    },
  };
}
