import { useTranslation } from 'react-i18next';
import { trpc, trpcQueryUtils } from '../../../../../router';
import { useForm } from 'react-hook-form';
import {
  AddAttributeInput,
  addAttributeSchema,
} from '@core/validation/erp/good/attribute/add.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getGenericLocale } from '../../../../../utils/locales';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@core/ui/components/ui/dialog';
import { AddAttributeForm } from './AddAttributeForm';
import { Button } from '@core/ui/components/ui/button';
import SpinnerIcon from '@core/ui/components/ui/spinner-icon';
import { PiPlus } from 'react-icons/pi';
import { toast } from '@core/ui/lib/toast';

export function AddAttributeDialog(props: {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}) {
  const { t, i18n } = useTranslation();
  const { mutate, isPending } = trpc.good.attribute.add.useMutation({
    onSuccess({ message }) {
      toast.success(message);
      trpcQueryUtils.good.attribute.findManyInfinite.invalidate();
      props.setIsOpened(false);
    },
    onError({ message }) {
      toast.error(message);
    },
  });

  const form = useForm<AddAttributeInput>({
    resolver: zodResolver(addAttributeSchema),
    defaultValues: {
      localizations: [
        {
          locale: getGenericLocale(i18n.language),
          name: '',
        },
      ],
    },
    disabled: isPending,
  });

  function onSubmit(values: AddAttributeInput) {
    mutate(values);
  }

  return (
    <Dialog open={props.isOpened} onOpenChange={props.setIsOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('content:erp.good.attribute.add.title')}</DialogTitle>
          <DialogDescription>
            {t('content:erp.good.attribute.add.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[70dvh] p-4">
          <AddAttributeForm form={form} onSubmit={onSubmit} />
        </div>
        <DialogFooter>
          <DialogFooter>
            <Button
              className="w-full flex items-center gap-2"
              onClick={form.handleSubmit(onSubmit)}
            >
              {isPending ? <SpinnerIcon /> : <PiPlus className="h-4 w-4" />}
              {t(`content:erp.good.attribute.add.title`)}
            </Button>
          </DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
