import { useTranslation } from 'react-i18next';
import { trpc, trpcQueryUtils } from '../../../../router';
import { toast } from '@core/ui/lib/toast';
import { useForm } from 'react-hook-form';
import {
  AddAdditionalGoodIdentificatorForm,
  AddAdditionalGoodIdentificatorFormOnSubmit,
  AddAdditionalGoodIdentificatorFormType,
} from './AddAdditionalGoodIdentifierForm';
import {
  addAdditionalGoodIdentificatorSchema,
  AddAdditionalGoodIdentificatorSchemaInput,
} from '@core/validation/erp/good/additional-identificator/add.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@core/ui/components/ui/dialog';
import SpinnerIcon from '@core/ui/components/ui/spinner-icon';
import { PiPlus } from 'react-icons/pi';
import { Button } from '@core/ui/components/ui/button';

export function AddAdditionalGoodIdentificatorDialog(props: {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}) {
  const { t } = useTranslation();
  const { mutate, isPending } =
    trpc.good.additionalIdentificator.add.useMutation({
      onSuccess({ message }) {
        toast.success(message);
        trpcQueryUtils.good.additionalIdentificator.findManyInfinite.invalidate();
        props.setIsOpened(false);
      },
      onError({ message }) {
        toast.error(message);
      },
    });

  const form = useForm<AddAdditionalGoodIdentificatorSchemaInput>({
    resolver: zodResolver(addAdditionalGoodIdentificatorSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: AddAdditionalGoodIdentificatorSchemaInput) {
    mutate(values);
  }

  return (
    <Dialog open={props.isOpened} onOpenChange={props.setIsOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('content:erp.good.additional-identificator.add.title')}
          </DialogTitle>
          <DialogDescription>
            {t('content:erp.good.additional-identificator.add.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[70dvh] p-4">
          <AddAdditionalGoodIdentificatorForm
            form={form as AddAdditionalGoodIdentificatorFormType}
            onSubmit={onSubmit as AddAdditionalGoodIdentificatorFormOnSubmit}
          />
        </div>
        <DialogFooter>
          <Button
            className="w-full flex items-center gap-2"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isPending ? <SpinnerIcon /> : <PiPlus className="h-4 w-4" />}
            {t(`content:erp.good.additional-identificator.add.title`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
