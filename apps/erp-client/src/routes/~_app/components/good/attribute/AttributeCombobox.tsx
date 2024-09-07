import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trpc } from '../../../../../router';
import { getGenericLocale } from '../../../../../utils/locales';
import { AddAttributeDialog } from './AddAttributeDialog';
import { Combobox } from '@core/ui/components/ui/combobox';

export function AttributeCombobox(props: {
  value: number | null;
  setValue: (value: number | null) => void;
}) {
  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState('');
  const { data, isError, isLoading, isFetchingNextPage, hasNextPage } =
    trpc.good.attribute.findManyInfinite.useInfiniteQuery(
      {
        locale: getGenericLocale(i18n.language),
        search,
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
    data: attributeData,
    isLoading: isAttributeLoading,
    isError: isAttributeError,
  } = trpc.good.attribute.findOne.useQuery(
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
      <AddAttributeDialog
        isOpened={isAddDialogOpened}
        setIsOpened={setIsAddDialogOpened}
      />
      <Combobox
        placeholder={t('content:erp.good.attribute.select.placeholder.single')}
        isDataLoading={isLoading}
        onSearch={(search) => setSearch(search)}
        data={data?.pages.flatMap((page) =>
          page.items?.map((item) => ({
            label: item.localizations[0].name,
            value: item.id.toString(),
          })),
        )}
        onChange={(value) => props.setValue(value ? parseInt(value) : null)}
        value={props.value?.toString() || null}
        label={attributeData?.attribute.localizations[0].name}
        isLabelLoading={isAttributeLoading}
        labelErrorMessage={
          isAttributeError ? t('res:good.attribute.find_one.failed') : undefined
        }
        addButtonOnClick={() => setIsAddDialogOpened(true)}
        addButtonText={t('content:erp.good.attribute.add.title')}
        dataErrorMessage={t('res:good.attribute.find_many.failed')}
        emptyPlaceholder={t('content:erp.good.attribute.find_many.not_found')}
        searchPlaceholder={t(
          'content:erp.good.attribute.find_many.placeholder',
        )}
      />
    </>
  );
}
