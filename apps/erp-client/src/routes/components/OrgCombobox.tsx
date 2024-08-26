import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@retailify/ui/components/ui/dialog';
import {
  AddInput,
  addSchema,
} from '@retailify/validation/erp/organization/add.schema';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../../utils/trpc';
import { toast } from '@retailify/ui/lib/toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@retailify/ui/components/ui/form';
import { Input } from '@retailify/ui/components/ui/input';
import { Button } from '@retailify/ui/components/ui/button';
import { Textarea } from '@retailify/ui/components/ui/textarea';
import { useState } from 'react';
import SpinnerIcon from '@retailify/ui/components/ui/spinner-icon';
import {
  PiBuildingOffice,
  PiCheck,
  PiListMagnifyingGlass,
} from 'react-icons/pi';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@retailify/ui/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@retailify/ui/components/ui/popover';

export default function OrgCombobox(props: { isCollapsed: boolean }) {
  const { t } = useTranslation();
  const [isOpened, setIsOpened] = useState(false);
  const { data } = trpc.organization.findAllInfinite.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <Popover open={isOpened} onOpenChange={setIsOpened}>
      <PopoverTrigger asChild>
        {props.isCollapsed ? (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpened}
            size="icon"
          >
            <PiBuildingOffice className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpened}
            className="w-full justify-between"
          >
            <span className="line-clamp-1">
              {t('content:organization.find_all.not_selected')}
            </span>
            <PiListMagnifyingGlass className="h-4 w-4 ml-auto" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder={t('content:organization.find_all.search.placeholder')}
          />
          <CommandList>
            <CommandEmpty>
              {t('content:organization.find_all.search.no_results')}
            </CommandEmpty>
            <CommandGroup>
              {data?.pages?.map((page) =>
                page?.items?.map((org) => (
                  <CommandItem key={org.id}>{org.name}</CommandItem>
                )),
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CreateOrgDialog(props: {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
}) {
  const { t } = useTranslation();

  const form = useForm<AddInput>({
    resolver: zodResolver(addSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { mutate, isPending } = trpc.organization.add.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  function onSubmit(data: AddInput) {
    mutate(data);
  }

  return (
    <Dialog open={props.isOpened} onOpenChange={props.setIsOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('content:organization.add.title')}</DialogTitle>
          <DialogDescription>
            {t('content:organization.add.subtitle')}
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
                    {t('content:organization.add.form_fields.name.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        'content:organization.add.form_fields.name.placeholder',
                      )}
                      {...field}
                    />
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
                      'content:organization.add.form_fields.description.label',
                    )}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'content:organization.add.form_fields.description.placeholder',
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage t={t} />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={() => props.setIsOpened(false)}>
            {t('common:actions.cancel')}
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <SpinnerIcon /> : <PiCheck className="h-4 w-4" />}
            {t('common:actions.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
