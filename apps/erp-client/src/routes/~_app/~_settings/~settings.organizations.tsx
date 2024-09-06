import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { trpc, trpcQueryUtils } from '../../../router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@core/ui/components/ui/table';
import { Button } from '@core/ui/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@core/ui/components/ui/tooltip';
import { PiBuildingOffice, PiPencil, PiTrash } from 'react-icons/pi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@core/ui/components/ui/dialog';
import { useForm } from 'react-hook-form';
import {
  EditOrganizationInput,
  editOrganizationSchema,
} from '@core/validation/erp/organization/edit.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@core/ui/components/ui/form';
import { Skeleton } from '@core/ui/components/ui/skeleton';
import { Input } from '@core/ui/components/ui/input';
import { Textarea } from '@core/ui/components/ui/textarea';
import { useEffect, useState } from 'react';
import SpinnerIcon from '@core/ui/components/ui/spinner-icon';
import { toast } from '@core/ui/lib/toast';

export const Route = createFileRoute('/_app/_settings/settings/organizations')({
  component: Component,
  loader: async ({ context: { trpcQueryUtils } }) => {
    await trpcQueryUtils.organization.findMany.ensureData({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return;
  },
});

function Component() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col max-h-full overflow-auto gap-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1>{t('content:erp.settings.organizations.title')}</h1>
          <p className="muted">
            {t('content:erp.settings.organizations.subtitle')}
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="w-full lg:w-fit" asChild>
              <Link to="/new-org" className="flex items-center gap-2">
                <PiBuildingOffice className="h-4 w-4" />
                {t('content:erp.organization.add.title')}
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('content:erp.organization.add.subtitle')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <OrganizationsTable />
    </div>
  );
}

function OrganizationsTable() {
  const { t } = useTranslation();
  const { data } = trpc.organization.findMany.useQuery({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <Table className="bg-card overflow-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">
            {t('content:erp.organization.find_many.columns.id')}
          </TableHead>
          <TableHead className="w-48">
            {t('content:erp.organization.find_many.columns.name')}
          </TableHead>
          <TableHead>
            {t('content:erp.organization.find_many.columns.description')}
          </TableHead>
          <TableHead className="text-right">
            {t('content:erp.organization.find_many.columns.staff._count')}
          </TableHead>
          <TableHead className="text-right">
            {t('common:actions.actions')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-auto max-h-full">
        {data?.items?.length ? (
          data?.items?.map(({ id, name, description, _count: { staff } }) => (
            <TableRow key={id}>
              <TableCell className="font-medium">{id}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="max-w-40 lg:max-w-96 xl:w-fit line-clamp-1 cursor-help">
                      {description}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="text-right">{staff}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <EditOrganization id={id} />
                  <DeleteOrganization id={id} />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6}>
              <div className="flex w-full h-24 items-center justify-center text-muted-foreground">
                <p>{t('content:erp.organization.find_many.empty')}</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function EditOrganization(props: { id: number }) {
  const [isOpened, setIsOpened] = useState(false);
  const { t } = useTranslation();
  const { mutate, isPending } = trpc.organization.edit.useMutation({
    onSuccess({ message }) {
      setIsOpened(false);
      trpcQueryUtils.organization.findMany.invalidate();
      trpcQueryUtils.organization.findOne.invalidate({ id: props.id });
      trpcQueryUtils.organization.findManyInfinite.invalidate();
      toast.success(message);
    },
    onError({ message }) {
      toast.error(message);
    },
  });
  const { data, isLoading } = trpc.organization.findOne.useQuery({
    id: props.id,
  });

  const form = useForm<EditOrganizationInput>({
    resolver: zodResolver(editOrganizationSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    disabled: isPending,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        id: props.id,
        name: data.organization?.name,
        description: data.organization?.description ?? '',
      });
    }
  }, [data, form, props.id]);

  function onSubmit(values: EditOrganizationInput) {
    mutate(values);
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <PiPencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('content:erp.organization.edit.title')}</DialogTitle>
          <DialogDescription>
            {t('content:erp.organization.edit.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t('content:erp.organization.edit.form_fields.name.label')}
                  </FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-10" />
                    ) : (
                      <Input
                        placeholder={t(
                          'content:erp.organization.edit.form_fields.name.placeholder',
                        )}
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage t={t} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t(
                      'content:erp.organization.edit.form_fields.description.label',
                    )}
                  </FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-10" />
                    ) : (
                      <Textarea
                        placeholder={t(
                          'content:erp.organization.edit.form_fields.description.placeholder',
                        )}
                        className="resize-none"
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage t={t} />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => setIsOpened(false)}
          >
            {t('common:actions.cancel')}
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <SpinnerIcon /> : <PiPencil className="h-4 w-4" />}
            {t('common:actions.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteOrganization(props: { id: number }) {
  const [isOpened, setIsOpened] = useState(false);
  const { t } = useTranslation();
  const { mutateAsync, isPending } = trpc.organization.delete.useMutation({
    onMutate() {
      setIsOpened(false);
      trpcQueryUtils.organization.findMany.cancel();
      trpcQueryUtils.organization.findOne.cancel({ id: props.id });
      trpcQueryUtils.organization.findManyInfinite.cancel();

      const previousOrganizations =
        trpcQueryUtils.organization.findMany.getData();
      trpcQueryUtils.organization.findMany.setData(
        {
          orderBy: {
            createdAt: 'desc',
          },
        },
        {
          ...previousOrganizations,
          items: previousOrganizations?.items?.filter(
            (item) => item.id !== props.id,
          ),
        },
      );

      return { previousOrganizations };
    },
    onSuccess() {
      trpcQueryUtils.organization.findMany.invalidate();
      trpcQueryUtils.organization.findOne.invalidate({ id: props.id });
      trpcQueryUtils.organization.findManyInfinite.invalidate();
    },
    onError(error, _deletedOrganization, context) {
      console.error(error);
      void trpcQueryUtils.organization.findMany.setData(
        {
          orderBy: {
            createdAt: 'desc',
          },
        },
        context?.previousOrganizations,
      );
    },
  });

  function onDelete() {
    toast.promise(mutateAsync({ id: props.id }), {
      loading: t('content:erp.organization.delete.deleting'),
      success: ({ message }) => message,
      error: ({ message }) => message,
    });
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <PiTrash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('content:erp.organization.delete.title')}
          </DialogTitle>
          <DialogDescription>
            {t('content:erp.organization.delete.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => setIsOpened(false)}
          >
            {t('common:actions.cancel')}
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={onDelete}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? <SpinnerIcon /> : <PiTrash className="h-4 w-4" />}
            {t('common:actions.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
