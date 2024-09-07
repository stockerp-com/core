import { useTranslation } from 'react-i18next';
import { trpc } from '../../../../../../router';
import { useState } from 'react';
import { getGenericLocale } from '../../../../../../utils/locales';
import { AddAttributeValueDialog } from './AddAttributeValueDialog';
import { Combobox } from '@core/ui/components/ui/combobox';

export function AttributeValueCombobox(props: {
  value: number | null;
  setValue: (value: number | null) => void;
  attributeId: number;
}) {
  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState('');
  const { data, isError, isLoading, isFetchingNextPage, hasNextPage } =
    trpc.good.attribute.value.findManyInfinite.useInfiniteQuery(
      {
        locale: getGenericLocale(i18n.language),
        search,
        attributeId: props.attributeId,
        orderBy: {
          id: 'asc',
        },
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      },
    );

  const {
    data: attributeValueData,
    isLoading: isAttributeValueLoading,
    isError: isAttributeValueError,
  } = trpc.good.attribute.value.findOne.useQuery(
    {
      id: props.value!,
      locale: getGenericLocale(i18n.language),
    },
    {
      enabled: props.value !== null,
    },
  );

  const [isAddDialogOpened, setIsAddDialogOpened] = useState(false);

  return (
    <>
      <AddAttributeValueDialog
        isOpened={isAddDialogOpened}
        setIsOpened={setIsAddDialogOpened}
        attributeId={props.attributeId}
      />
      <Combobox
        placeholder={t(
          'content:erp.good.attribute.value.select.placeholder.single',
        )}
        isDataLoading={isLoading}
        onSearch={(search) => setSearch(search)}
        data={data?.pages.flatMap(
          (page) =>
            page.items?.map((item) => ({
              label: item.localizations[0].data,
              value: item.id.toString(),
            })) ?? [],
        )}
        value={props.value?.toString() ?? ''}
        onChange={(value) => props.setValue(Number(value))}
        label={attributeValueData?.attributeValue.localizations[0].data}
        isLabelLoading={isAttributeValueLoading}
        labelErrorMessage={
          isAttributeValueError
            ? t('content:erp.good.attribute.value.find_one.failed')
            : undefined
        }
        addButtonOnClick={() => setIsAddDialogOpened(true)}
        addButtonText={t('content:erp.good.attribute.value.add.title')}
        dataErrorMessage={t(
          'content:erp.good.attribute.value.find_many.failed',
        )}
        emptyPlaceholder={t(
          'content:erp.good.attribute.value.find_many.not_found',
        )}
        searchPlaceholder={t(
          'content:erp.good.attribute.value.find_many.placeholder',
        )}
      />
    </>
  );
}
