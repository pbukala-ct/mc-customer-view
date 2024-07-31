import {
  TCart,
  TCartUpdateAction,
  TCustomLineItem,
  TLineItem,
} from '../../types/generated/ctp';
import { FC, useState } from 'react';
import DataTable, { TColumn } from '@commercetools-uikit/data-table';
import DataTableManager, {
  UPDATE_ACTIONS,
} from '@commercetools-uikit/data-table-manager';
import createSelectedColumnsDefinition from './column-definitions';
import { CartItemTableProductCell } from './cart-item-table-product-cell/cart-item-table-product-cell';
import { Link } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { FormattedMessage, useIntl } from 'react-intl';
import { formatMoney, isCustomLineItem, transformErrors } from '../../helpers';
import { SHIPPING_MODES } from '../addresses-panel/addresses-panel';
import {
  determineIfTaxIncludedInPrice,
  determinteIfTaxRateSameInMultiMode,
  getGrossPriceWithoutShipping,
  getGrossPriceWithoutShippingMulti,
} from '../cart-summary-pricing-breakdown/order-prices';
import messages from './messages';
import CartItemTableInventoryCell from './cart-item-table-inventory-cell';
import {
  getSymbolFromCurrency,
  useCurrencies,
} from '@commercetools-frontend/l10n';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import CartItemTableUnitNetPriceCell from './cart-item-table-unit-net-price-cell';
import CartItemTableUnitGrossPriceCell from './cart-item-table-unit-gross-price-cell';
import CartItemTableUnitPriceCell from './cart-item-table-unit-price-cell';
import CartItemTableTaxRateCell from './cart-item-table-tax-rate-cell';
import CartItemTableSubtotalPriceCell from './cart-item-table-subtotal-price-cell';
import CartItemTableTotalPriceCell from './cart-item-table-total-price-cell';
import QuantitySelector from '../quantity-selector';
import {
  useShowApiErrorNotification,
  useShowNotification,
} from '@commercetools-frontend/actions-global';
import { useCartUpdater } from '../../hooks/use-carts-hook';
import { DOMAINS } from '@commercetools-frontend/constants';
import Constraints from '@commercetools-uikit/constraints';
import { ProductSearchInput } from '../variant-search';
import { ProductValue } from '../variant-search/product-search-input';
import CartItemTableDelete from './cart-item-table-delete/cart-item-table-delete';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { PERMISSIONS } from '../../constants';

type Props = { cart: TCart };

const CartDetailsItems: FC<Props> = ({ cart }) => {
  const showNotification = useShowNotification();
  const showApiErrorNotification = useShowApiErrorNotification();
  const intl = useIntl();
  const cartUpdater = useCartUpdater();
  const [isCondensed, setIsCondensed] = useState<boolean>(true);
  const [isWrappingText, setIsWrappingText] = useState<boolean>(false);

  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });

  const handleChangeQuantity = async ({
    quantity,
    id,
    isCustomLineItem,
  }: {
    quantity: number;
    id: string;
    isCustomLineItem: boolean;
  }) => {
    const action: TCartUpdateAction = isCustomLineItem
      ? {
          changeCustomLineItemQuantity: {
            customLineItemId: id,
            quantity,
          },
        }
      : { changeLineItemQuantity: { lineItemId: id, quantity } };
    await cartUpdater.execute({
      updateActions: [action],
      id: cart.id,
      version: cart.version,
      locale: dataLocale,
    });
    showNotification({
      kind: 'success',
      domain: DOMAINS.SIDE,
      text: intl.formatMessage(messages.cartUpdated),
    });
  };

  const handleRemoveLineItem = async (
    id: string,
    isCustomLineItem: boolean
  ) => {
    const action: TCartUpdateAction = isCustomLineItem
      ? { removeCustomLineItem: { customLineItemId: id } }
      : { removeLineItem: { lineItemId: id } };
    await cartUpdater.execute({
      updateActions: [action],
      id: cart.id,
      version: cart.version,
      locale: dataLocale,
    });
    showNotification({
      kind: 'success',
      domain: DOMAINS.SIDE,
      text: intl.formatMessage(messages.cartUpdated),
    });
  };

  const { data } = useCurrencies(dataLocale);

  const currencySymbol = getSymbolFromCurrency(
    cart.totalPrice.currencyCode,
    data
  );

  const columnsDefinition = createSelectedColumnsDefinition(
    intl,
    currencySymbol,
    {
      isTaxIncludedInPrice: determineIfTaxIncludedInPrice(cart),
      inventoryMode: cart.inventoryMode,
      isTaxRateSameInMultiMode: determinteIfTaxRateSameInMultiMode(cart),
    }
  );
  const [tableData, setTableData] = useState({
    columns: [...columnsDefinition],
    visibleColumns: columnsDefinition,
    visibleColumnKeys: columnsDefinition.map((column) => column.key),
  });

  const getUrlToLineItemDetails = (lineItem: TLineItem | TCustomLineItem) => {
    if ('money' in lineItem) {
      return cart.id + '/customlineitem/' + lineItem.id;
    } else {
      return cart.id + '/lineitem/' + lineItem.id;
    }
  };

  const itemRenderer = (
    lineItem: TLineItem | TCustomLineItem,
    column: TColumn<TLineItem | TCustomLineItem>
  ) => {
    switch (column.key) {
      case 'name': {
        const to = getUrlToLineItemDetails(lineItem);
        return (
          <Link to={to}>
            <CartItemTableProductCell lineItem={lineItem} />
          </Link>
        );
      }
      case 'inventory': {
        return (
          <CartItemTableInventoryCell
            lineItem={lineItem}
            inventoryMode={cart.inventoryMode}
            storeId={cart.store?.id}
          />
        );
      }
      case 'actions':
        return (
          <CartItemTableDelete
            handleRemoveLineItem={async () =>
              await handleRemoveLineItem(
                lineItem.id,
                isCustomLineItem(lineItem)
              )
            }
            isDisabled={!canManage}
            size={'medium'}
          />
        );
      case 'price':
        // unit price, only visible when tax is NOT included in price
        return <CartItemTableUnitPriceCell lineItem={lineItem} />;
      case 'grossPrice':
        // original unit price, only visible when tax is included in price
        return <CartItemTableUnitGrossPriceCell lineItem={lineItem} />;
      case 'netPrice':
        // unit price, only visible when tax is included in price
        return <CartItemTableUnitNetPriceCell lineItem={lineItem} />;
      case 'quantity':
        return (
          <QuantitySelector
            onChange={(quantity) =>
              handleChangeQuantity({
                quantity: quantity,
                id: lineItem.id,
                isCustomLineItem: isCustomLineItem(lineItem),
              })
            }
            quantity={lineItem.quantity}
          />
        );
      case 'taxRate':
        return (
          <CartItemTableTaxRateCell
            currencySymbol={currencySymbol}
            lineItem={lineItem}
            shipping={cart.shipping}
          />
        );
      case 'subtotalPrice':
        return (
          <CartItemTableSubtotalPriceCell
            directDiscounts={cart.directDiscounts}
            lineItem={lineItem}
          />
        );
      case 'totalPrice':
        return (
          <CartItemTableTotalPriceCell
            directDiscounts={cart.directDiscounts}
            lineItem={lineItem}
          />
        );
      default:
        return (
          lineItem[column.key as keyof (TLineItem | TCustomLineItem)] || ''
        );
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

  const handleAddVariantToCart = async (variant: ProductValue) => {
    await cartUpdater
      .execute({
        updateActions: [{ addLineItem: { sku: variant.sku, quantity: 1 } }],
        id: cart.id,
        version: cart.version,
        locale: dataLocale,
      })
      .then((result) => {
        if (!result) {
          return;
        }
        showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.addVariantSuccess, {
            sku: variant.sku,
          }),
        });
      })
      .catch((e) => {
        const transformedErrors = transformErrors(e);
        if (transformedErrors.unmappedErrors.length > 0) {
          showApiErrorNotification({
            errors: transformedErrors.unmappedErrors,
          });
        }
      });
  };

  return (
    <>
      <Spacings.Stack scale="l">
        <Constraints.Horizontal max={11}>
          <Spacings.Stack scale="m">
            <Text.Subheadline as="h5" intlMessage={messages.addSubTitle} />
          </Spacings.Stack>
        </Constraints.Horizontal>

        <Constraints.Horizontal max={13}>
          <ProductSearchInput
            name={'variantSearch'}
            onChange={async (event) => {
              const product = event.target.value as ProductValue;
              await handleAddVariantToCart(product);
            }}
          />
        </Constraints.Horizontal>
      </Spacings.Stack>
      {(cart.lineItems.length >= 1 || cart.customLineItems.length >= 1) && (
        <DataTableManager
          columns={tableData.visibleColumns}
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
            rows={cart.lineItems}
            itemRenderer={itemRenderer}
            footer={
              <Spacings.Stack
                alignItems="flexEnd"
                data-testid="order-totals-last-row"
              >
                <Text.Body isBold>
                  <Spacings.Inline>
                    <span>
                      <FormattedMessage {...messages.totalLabel} />
                    </span>
                    <span>
                      {formatMoney(
                        cart.shippingMode === SHIPPING_MODES.MULTIPLE
                          ? getGrossPriceWithoutShippingMulti(cart)
                          : getGrossPriceWithoutShipping(cart),
                        intl
                      )}
                    </span>
                  </Spacings.Inline>
                </Text.Body>
              </Spacings.Stack>
            }
          />
        </DataTableManager>
      )}
    </>
  );
};

export default CartDetailsItems;
