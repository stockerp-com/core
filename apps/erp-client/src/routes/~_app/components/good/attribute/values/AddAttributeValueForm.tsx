import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@core/ui/components/ui/form';
import { Input } from '@core/ui/components/ui/input';
import { AddAttributeValueInput } from '@core/validation/erp/good/attribute/value/add.schema';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type AddAttributeValueForm = UseFormReturn<
  AddAttributeValueInput,
  unknown,
  undefined
>;
export type AddAttributeValueFormOnSubmit = (
  values: AddAttributeValueInput,
) => void;

export function AddAttributeValueForm(props: {
  form: AddAttributeValueForm;
  onSubmit: AddAttributeValueFormOnSubmit;
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
          name="localizations.0.data"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t(
                  'content:erp.good.attribute.value.add.form_fields.data.label',
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'content:erp.good.attribute.value.add.form_fields.data.placeholder',
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
