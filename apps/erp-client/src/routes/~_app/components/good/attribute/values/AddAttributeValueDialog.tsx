import { useTranslation } from 'react-i18next';
import { trpc, trpcQueryUtils } from '../../../../../../router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AddAttributeValueInput,
  addAttributeValueSchema,
} from '@core/validation/erp/good/attribute/value/add.schema';
import { getGenericLocale } from '../../../../../../utils/locales';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@core/ui/components/ui/dialog';
import { AddAttributeValueForm } from './AddAttributeValueForm';
import { Button } from '@core/ui/components/ui/button';
import SpinnerIcon from '@core/ui/components/ui/spinner-icon';
import { PiPlus } from 'react-icons/pi';
import { toast } from '@core/ui/lib/toast';

export function AddAttributeValueDialog(props: {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  attributeId: number;
}) {
  const { t, i18n } = useTranslation();
  const { mutate, isPending } = trpc.good.attribute.value.add.useMutation({
    onSuccess({ message }) {
      toast.success(message);
      trpcQueryUtils.good.attribute.value.findManyInfinite.invalidate();
      props.setIsOpened(false);
    },
    onError({ message }) {
      toast.error(message);
    },
  });

  const form = useForm<AddAttributeValueInput>({
    resolver: zodResolver(addAttributeValueSchema),
    defaultValues: {
      localizations: [
        {
          locale: getGenericLocale(i18n.language),
          data: '',
        },
      ],
      attributeId: props.attributeId,
    },
    disabled: isPending,
  });

  function onSubmit(values: AddAttributeValueInput) {
    mutate(values);
  }

  return (
    <Dialog open={props.isOpened} onOpenChange={props.setIsOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('content:erp.good.attribute.value.add.title')}
          </DialogTitle>
          <DialogDescription>
            {t('content:erp.good.attribute.value.add.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[70dvh] p-4">
          <AddAttributeValueForm form={form} onSubmit={onSubmit} />
        </div>
        <DialogFooter>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center gap-2"
              onClick={form.handleSubmit(onSubmit)}
            >
              {isPending ? <SpinnerIcon /> : <PiPlus className="h-4 w-4" />}
              {t('content:erp.good.attribute.value.add.submit')}
            </Button>
          </DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
