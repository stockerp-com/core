import { UseFormReturn } from 'react-hook-form';
import { AddAttributeInput } from '@core/validation/erp/good/attribute/add.schema';
import { useTranslation } from 'react-i18next';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@core/ui/components/ui/form';
import { Input } from '@core/ui/components/ui/input';

export type AddAttributeForm = UseFormReturn<
  AddAttributeInput,
  unknown,
  undefined
>;
export type AddAttributeFormOnSubmit = (values: AddAttributeInput) => void;

export function AddAttributeForm(props: {
  form: AddAttributeForm;
  onSubmit: AddAttributeFormOnSubmit;
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
          name="localizations.0.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('content:erp.good.attribute.add.form_fields.name.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'content:erp.good.attribute.add.form_fields.name.placeholder',
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
