import { FC } from 'react';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { PageNotFound } from '@commercetools-frontend/application-components';
import DataTable, { TColumn } from '@commercetools-uikit/data-table';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { usePaginationState } from '@commercetools-uikit/hooks';
import { Pagination } from '@commercetools-uikit/pagination';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useShoppingListsFetcher } from '../../hooks/use-shopping-lists-hook';
import { getErrorMessage } from '../../helpers';
import { TShoppingList } from '../../types/generated/ctp';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { Switch } from 'react-router';
import CustomerShoppingList from '../customer-shopping-list/customer-shopping-list';

type Props = { id: string };

export const CustomerShoppingLists: FC<Props> = ({ id }) => {
  const { page, perPage } = usePaginationState();
  const { push } = useHistory();
  const match = useRouteMatch();

  const { shoppingLists, loading, error, refetch } = useShoppingListsFetcher({
    limit: perPage.value,
    offset: (page.value - 1) * perPage.value,
    where: `customer(id="${id}")`,
  });
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));
  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  if (loading) {
    return (
      <Spacings.Stack alignItems="center">
        <LoadingSpinner />
      </Spacings.Stack>
    );
  }
  if (!shoppingLists) {
    return <PageNotFound />;
  }
  const columns: Array<TColumn<TShoppingList>> = [
    // { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'count', label: 'Line Item count' },
    // { key: 'customer', label: 'Customer' },
  ];
  const itemRenderer = (
    item: TShoppingList,
    column: TColumn<TShoppingList>
  ) => {
    switch (column.key) {
      case 'count': {
        return item.lineItems?.reduce((a, c) => a + c.quantity, 0);
      }
      case 'customer': {
        return item.customer ? item.customer.email : '';
      }
      case 'name': {
        return formatLocalizedString(
          {
            name: transformLocalizedFieldToLocalizedString(
              item.nameAllLocales ?? []
            ),
          },
          {
            key: 'name',
            locale: dataLocale,
            fallbackOrder: projectLanguages,
            fallback: NO_VALUE_FALLBACK,
          }
        );
      }
      default:
        return item[column.key as keyof TShoppingList];
    }
  };
  return (
    <Spacings.Stack scale={'l'}>
      <DataTable
        rows={shoppingLists.results}
        columns={columns}
        itemRenderer={itemRenderer}
        onRowClick={(row) => {
          push(`${match.url}/${row.id}`);
        }}
      />
      <Pagination
        page={page.value}
        onPageChange={page.onChange}
        perPage={perPage.value}
        onPerPageChange={perPage.onChange}
        totalItems={shoppingLists.total}
      />
      <Switch>
        <SuspendedRoute path={`${match.path}/:id`}>
          <CustomerShoppingList
            onClose={() => {
              refetch();
              push(match.url);
            }}
          />
        </SuspendedRoute>
      </Switch>
    </Spacings.Stack>
  );
};

export default CustomerShoppingLists;
