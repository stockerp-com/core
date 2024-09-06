import { useState } from 'react';
import { trpc } from '../../../../router';
import { Combobox } from '@core/ui/components/ui/combobox';
import { useTranslation } from 'react-i18next';
import { AddStockpointDialog } from './AddStockpointDialog';

export function StockpointCombobox(props: {
  value?: number | null;
  setValue: (value: number | null) => void;
}) {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const { data, isError, isLoading, isFetchingNextPage, hasNextPage } =
    trpc.stockpoint.findManyInfinite.useInfiniteQuery(
      {
        search,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      },
    );

  const {
    data: stockpointData,
    isLoading: isStockpointLoading,
    isError: isStockpointError,
  } = trpc.stockpoint.findOne.useQuery(
    { id: props.value! },
    {
      enabled: props.value !== null,
    },
  );

  const [isAddDialogOpened, setIsAddDialogOpened] = useState(false);

  return (
    <>
      <AddStockpointDialog
        isOpened={isAddDialogOpened}
        setIsOpened={setIsAddDialogOpened}
      />
      <Combobox
        placeholder={t('content:erp.stockpoint.select.placeholder.single')}
        isDataLoading={isLoading}
        onSearch={(search) => setSearch(search)}
        data={data?.pages.flatMap((page) =>
          page.items?.map((item) => ({
            label: item.name,
            value: item.id.toString(),
          })),
        )}
        onChange={(value) => props.setValue(value ? parseInt(value) : null)}
        value={props.value?.toString() || null}
        label={stockpointData?.stockpoint.name}
        isLabelLoading={isStockpointLoading}
        labelErrorMessage={
          isStockpointError ? t('res:stockpoint.find_one.failed') : undefined
        }
        dataErrorMessage={
          isError ? t('res:stockpoint.find_many.failed') : undefined
        }
        emptyPlaceholder={t('res:stockpoint.find_many.not_found')}
        searchPlaceholder={t('content:erp.stockpoint.find_many.placeholder')}
        addButtonText={t('content:erp.stockpoint.add.title')}
        addButtonOnClick={() => setIsAddDialogOpened(true)}
      />
    </>
  );
}
