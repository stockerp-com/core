import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@core/ui/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { AddStockpointForm } from './AddStockpointForm';
import { Button } from '@core/ui/components/ui/button';
import { trpc, trpcQueryUtils } from '../../../../router';
import { toast } from '@core/ui/lib/toast';
import { useForm } from 'react-hook-form';
import {
  AddStockpointInput,
  addStockpointSchema,
} from '@core/validation/erp/stockpoint/add.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import SpinnerIcon from '@core/ui/components/ui/spinner-icon';
import { PiPlus } from 'react-icons/pi';

export function AddStockpointDialog(props: {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}) {
  const { t } = useTranslation();
  const { mutate, isPending } = trpc.stockpoint.add.useMutation({
    onSuccess({ message }) {
      toast.success(message);
      trpcQueryUtils.stockpoint.findManyInfinite.invalidate();
      props.setIsOpened(false);
    },
    onError({ message }) {
      toast.error(message);
    },
  });

  const form = useForm<AddStockpointInput>({
    resolver: zodResolver(addStockpointSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
    },
  });

  function onSubmit(values: AddStockpointInput) {
    mutate(values);
  }

  return (
    <Dialog open={props.isOpened} onOpenChange={props.setIsOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(`content:erp.stockpoint.add.title`)}</DialogTitle>
          <DialogDescription>
            {t(`content:erp.stockpoint.add.subtitle`)}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[70dvh] p-4">
          <AddStockpointForm
            form={form}
            isPending={isPending}
            onSubmit={onSubmit}
          />
        </div>
        <DialogFooter>
          <Button
            className="w-full flex items-center gap-2"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isPending ? <SpinnerIcon /> : <PiPlus className="h-4 w-4" />}
            {t(`content:erp.stockpoint.add.title`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
