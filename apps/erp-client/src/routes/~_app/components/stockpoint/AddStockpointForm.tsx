import { useTranslation } from 'react-i18next';
import { AddStockpointInput } from '@core/validation/erp/stockpoint/add.schema';
import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@core/ui/components/ui/form';
import { Input } from '@core/ui/components/ui/input';
import { Textarea } from '@core/ui/components/ui/textarea';

export type AddStockpointForm = UseFormReturn<
  AddStockpointInput,
  unknown,
  undefined
>;
export type AddStockpointFormOnSubmit = (values: AddStockpointInput) => void;

export function AddStockpointForm(props: {
  form: AddStockpointForm;
  onSubmit: AddStockpointFormOnSubmit;
  isPending: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Form {...props.form}>
      <form
        onSubmit={props.form.handleSubmit(props.onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={props.form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('content:erp.stockpoint.add.form_fields.name.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'content:erp.stockpoint.add.form_fields.name.placeholder',
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('content:erp.stockpoint.add.form_fields.description.label')}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    'content:erp.stockpoint.add.form_fields.description.placeholder',
                  )}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('content:erp.stockpoint.add.form_fields.address.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'content:erp.stockpoint.add.form_fields.address.placeholder',
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('content:erp.stockpoint.add.form_fields.phone.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'content:erp.stockpoint.add.form_fields.phone.placeholder',
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('content:erp.stockpoint.add.form_fields.email.label')}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t(
                    'content:erp.stockpoint.add.form_fields.email.placeholder',
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('content:erp.stockpoint.add.form_fields.website.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'content:erp.stockpoint.add.form_fields.website.placeholder',
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('content:erp.stockpoint.add.form_fields.email.label')}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t(
                    'content:erp.stockpoint.add.form_fields.email.placeholder',
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('content:erp.stockpoint.add.form_fields.website.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'content:erp.stockpoint.add.form_fields.website.placeholder',
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
