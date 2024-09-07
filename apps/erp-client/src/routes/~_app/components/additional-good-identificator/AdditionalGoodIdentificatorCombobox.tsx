import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trpc } from '../../../../router';
import { AddAdditionalGoodIdentificatorDialog } from './AddAdditionalGoodIdentificatorDialog';
import { Combobox } from '@core/ui/components/ui/combobox';

export function AdditionalGoodIdentificatorCombobox(props: {
  value?: string | null;
  setValue: (value: string | null) => void;
}) {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const { data, isError, isLoading, isFetchingNextPage, hasNextPage } =
    trpc.good.additionalIdentificator.findManyInfinite.useInfiniteQuery(
      {
        search,
        orderBy: {
          name: 'asc',
        },
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      },
    );

  const {
    data: additionalIdentificatorData,
    isLoading: isAdditionalIdentificatorLoading,
    isError: isAdditionalIdentificatorError,
  } = trpc.good.additionalIdentificator.findOne.useQuery(
    {
      name: props.value!,
    },
    {
      enabled: props.value !== null,
    },
  );

  const [isAddDialogOpened, setIsAddDialogOpened] = useState(false);

  return (
    <>
      <AddAdditionalGoodIdentificatorDialog
        isOpened={isAddDialogOpened}
        setIsOpened={setIsAddDialogOpened}
      />
      <Combobox
        placeholder={t(
          'content:erp.good.additional-identificator.select.placeholder.single',
        )}
        isDataLoading={isLoading}
        onSearch={(search) => setSearch(search)}
        data={data?.pages.flatMap((page) =>
          page.items?.map((item) => ({
            label: item.name,
            value: item.name,
          })),
        )}
        onChange={(value) => props.setValue(value || null)}
        value={props.value || null}
        label={additionalIdentificatorData?.additionalIdentificator.name}
        isLabelLoading={isAdditionalIdentificatorLoading}
        labelErrorMessage={
          isAdditionalIdentificatorError
            ? t('res:good.additional-identificator.find_one.failed')
            : undefined
        }
        addButtonOnClick={() => setIsAddDialogOpened(true)}
        addButtonText={t('content:erp.good.additional-identificator.add.title')}
        dataErrorMessage={
          isError
            ? t('res:good.additional-identificator.find_many.failed')
            : undefined
        }
        emptyPlaceholder={t(
          'res:good.additional-identificator.find_many.not_found',
        )}
        searchPlaceholder={t(
          'content:erp.good.additional-identificator.find_many.placeholder',
        )}
      />
    </>
  );
}
