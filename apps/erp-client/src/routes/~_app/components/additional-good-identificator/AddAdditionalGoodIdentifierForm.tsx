import { Form, FormControl, FormField, FormItem, FormLabel } from '@core/ui/components/ui/form';
import { Input } from '@core/ui/components/ui/input';
import { AddAdditionalGoodIdentificatorSchemaInput } from '@core/validation/erp/good/additional-identificator/add.schema';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type AddAdditionalGoodIdentificatorFormType = UseFormReturn<
  AddAdditionalGoodIdentificatorSchemaInput,
  unknown,
  undefined
>;
export type AddAdditionalGoodIdentificatorFormOnSubmit = (
  value: AddAdditionalGoodIdentificatorSchemaInput,
) => void;

export function AddAdditionalGoodIdentificatorForm(props: {
  form: AddAdditionalGoodIdentificatorFormType;
  onSubmit: AddAdditionalGoodIdentificatorFormOnSubmit;
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
                {t(
                  'content:erp.good.additional-identificator.add.form_fields.name.label',
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'content:erp.good.additional-identificator.add.form_fields.name.placeholder',
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
