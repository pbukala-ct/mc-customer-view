import { FC, useState } from 'react';
import DataTable, { TColumn } from '@commercetools-uikit/data-table';
import {
  TDataTableSortingState,
  useRowSelection,
} from '@commercetools-uikit/hooks';
import { TCart } from '../../types/generated/ctp';
import { TTone } from '@commercetools-uikit/stamp/dist/declarations/src/stamp';
import Stamp from '@commercetools-uikit/stamp';
import { formatAddress, formatMoney } from '../../helpers';
import DataTableManager, {
  UPDATE_ACTIONS,
} from '@commercetools-uikit/data-table-manager';
import {
  createHiddenColumnDefinitions,
  createVisibleColumnDefinitions,
} from '../customer-carts/column-definitions';
import { useIntl } from 'react-intl';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import { Pagination } from '@commercetools-uikit/pagination';
import { TPaginationState } from '@commercetools-uikit/hooks/dist/declarations/src/use-pagination-state/use-pagination-state';
import Spacings from '@commercetools-uikit/spacings';
import SelectField from '@commercetools-uikit/select-field';
import CustomerCartsUpdate from '../customer-carts-update/customer-carts-update';

type Props = {
  items: Array<TCart>;
  tableSorting: TDataTableSortingState;
  onRowClick?: (row: TCart, rowIndex: number, columnKey: string) => void;
  paginationState?: TPaginationState;
  totalItems?: number;
  onChange?: () => Promise<void>;
};

const KEY_NAME = 'checkbox';

export const CustomerCartsTable: FC<Props> = ({
  items,
  tableSorting,
  onRowClick,
  paginationState,
  totalItems = -1,
  onChange,
}) => {
  const intl = useIntl();
  const {
    rows: rowsWithSelection,
    toggleRow,
    selectAllRows,
    deselectAllRows,
    getIsRowSelected,
    getNumberOfSelectedRows,
  } = useRowSelection(KEY_NAME, items);

  const countSelectedRows = getNumberOfSelectedRows();
  const isSelectColumnHeaderIndeterminate =
    countSelectedRows > 0 && countSelectedRows < rowsWithSelection.length;
  const handleSelectColumnHeaderChange =
    countSelectedRows === 0 ? selectAllRows : deselectAllRows;

  const [tableData, setTableData] = useState({
    columns: [
      ...createVisibleColumnDefinitions(),
      ...createHiddenColumnDefinitions(intl.formatMessage),
    ],
    visibleColumns: createVisibleColumnDefinitions(),
    visibleColumnKeys: createVisibleColumnDefinitions().map(
      (column) => column.key
    ),
  });

  const [isCondensed, setIsCondensed] = useState<boolean>(true);
  const [isWrappingText, setIsWrappingText] = useState<boolean>(false);
  const [isUpdateCartOpen, setIsUpdateCartOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    'delete' | 'freeze' | 'unfreeze'
  >();

  const itemRenderer = (item: TCart, column: TColumn<TCart>) => {
    switch (column.key) {
      case 'createdAt':
        return intl.formatDate(item.createdAt);
      case 'lastModifiedAt':
        return intl.formatDate(item.lastModifiedAt);
      case 'cartState': {
        let tone: TTone = 'primary';
        switch (item.cartState) {
          case 'Active':
            tone = 'primary';
            break;
          case 'Merged':
            tone = 'secondary';
            break;
          case 'Ordered':
            tone = 'information';
            break;
          case 'Frozen':
            tone = 'warning';
            break;
        }
        return <Stamp tone={tone} label={item.cartState} isCondensed={true} />;
      }
      case 'count':
        return item.lineItems?.reduce((a, c) => a + c.quantity, 0);
      case 'totalPrice':
        return formatMoney(item.totalPrice, intl);
      case 'shippingAddress':
        return formatAddress(item.shippingAddress);
      case 'billingAddress':
        return formatAddress(item.billingAddress);
      default:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (item as any)[column.key] || '';
    }
  };

  const columnManager = {
    disableColumnManager: false,
    hideableColumns: tableData.columns,
    visibleColumnKeys: tableData.visibleColumnKeys,
  };
  const onSettingChange = (action: string, nextValue: boolean | string[]) => {
    const {
      COLUMNS_UPDATE,
      IS_TABLE_CONDENSED_UPDATE,
      IS_TABLE_WRAPPING_TEXT_UPDATE,
    } = UPDATE_ACTIONS;

    switch (action) {
      case IS_TABLE_CONDENSED_UPDATE: {
        setIsCondensed(nextValue as boolean);
        break;
      }
      case IS_TABLE_WRAPPING_TEXT_UPDATE: {
        setIsWrappingText(nextValue as boolean);
        break;
      }
      case COLUMNS_UPDATE: {
        if (Array.isArray(nextValue)) {
          Array.isArray(nextValue) &&
            setTableData({
              ...tableData,
              visibleColumns: tableData.columns.filter((column) =>
                nextValue.includes(column.key)
              ),
              visibleColumnKeys: nextValue,
            });
        }
        break;
      }
    }
  };

  const columnsWithSelect: Array<TColumn> = [
    {
      key: KEY_NAME,
      label: (
        <CheckboxInput
          isIndeterminate={isSelectColumnHeaderIndeterminate}
          isChecked={countSelectedRows !== 0}
          onChange={handleSelectColumnHeaderChange}
        />
      ),
      shouldIgnoreRowClick: true,
      align: 'center',
      renderItem: (row) => (
        <CheckboxInput
          isChecked={getIsRowSelected(row.id)}
          onChange={() => toggleRow(row.id)}
        />
      ),
      disableResizing: true,
    },
    ...tableData.visibleColumns,
  ];
  return (
    <Spacings.Stack scale="m">
      <SelectField
        name={'actions'}
        title={''}
        horizontalConstraint={5}
        placeholder={'Actions'}
        options={[
          { value: 'delete', label: 'Delete' },
          { value: 'freeze', label: 'Freeze Cart' },
          { value: 'unfreeze', label: 'Unfreeze Cart' },
        ]}
        onChange={(event) => {
          setSelectedAction(
            event.target.value as 'delete' | 'freeze' | 'unfreeze'
          );
          setIsUpdateCartOpen(true);
        }}
        isDisabled={getNumberOfSelectedRows() === 0}
        value={selectedAction}
      />
      <DataTableManager
        columns={columnsWithSelect}
        columnManager={columnManager}
        onSettingsChange={onSettingChange}
        displaySettings={{
          isWrappingText,
          isCondensed,
          disableDisplaySettings: false,
        }}
      >
        <DataTable
          isCondensed
          columns={tableData.visibleColumns}
          rows={items}
          itemRenderer={itemRenderer}
          sortedBy={tableSorting.value.key}
          sortDirection={tableSorting.value.order}
          onSortChange={tableSorting.onChange}
          onRowClick={onRowClick}
        />
      </DataTableManager>
      {paginationState && (
        <Pagination
          page={paginationState.page.value}
          onPageChange={paginationState.page.onChange}
          perPage={paginationState.perPage.value}
          onPerPageChange={paginationState.perPage.onChange}
          totalItems={totalItems}
        />
      )}
      {isUpdateCartOpen && selectedAction && (
        <CustomerCartsUpdate
          onClose={() => {
            setIsUpdateCartOpen(false);
            onChange && onChange();
          }}
          onCancel={() => {
            setIsUpdateCartOpen(false);
            onChange && onChange();
          }}
          items={rowsWithSelection.filter((item) => item[KEY_NAME])}
          action={selectedAction}
        />
      )}
    </Spacings.Stack>
  );
};

export default CustomerCartsTable;
