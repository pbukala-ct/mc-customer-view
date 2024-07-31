import { FC } from 'react';
import {
  CustomFormModalPage,
  PageContentWide,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import messages from './messages';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import {
  useCartDeleter,
  useCartFetcher,
  useCartUpdater,
} from '../../hooks/use-carts-hook';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { getErrorMessage, transformErrors } from '../../helpers';
import Spacings from '@commercetools-uikit/spacings';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import {
  useShowApiErrorNotification,
  useShowNotification,
} from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import CartDetailsGeneralInfoHeader from '../cart-details-general-info-header';
import Card from '@commercetools-uikit/card';
import CartDetailsItems from '../cart-details-items/cart-details-items';
import CartSummaryPricingBreakdown from '../cart-summary-pricing-breakdown';
import AddressesPanel from '../addresses-panel';
import CartAppliedDiscountsPanel from '../cart-applied-discounts-panel';
import { TCartUpdateAction } from '../../types/generated/ctp';

type Props = { onClose: () => Promise<void> };

export const CustomerCart: FC<Props> = ({ onClose }) => {
  const intl = useIntl();
  const { id } = useParams<{ id: string }>();
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const cartUpdater = useCartUpdater();
  const showNotification = useShowNotification();
  const showApiErrorNotification = useShowApiErrorNotification();
  const { cart, loading, error } = useCartFetcher({
    id: id,
    locale: dataLocale,
  });

  const cartDeleter = useCartDeleter();

  const handleDelete = async () => {
    if (cart) {
      await cartDeleter.execute({
        id: cart.id,
        version: cart.version,
      });
      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.deleteSuccess),
      });
      await onClose();
    }
  };

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

  if (!cart) {
    return <PageNotFound />;
  }

  const handleUpdateCart = (actions: Array<TCartUpdateAction>) => {
    return cartUpdater
      .execute({
        updateActions: actions,
        id: cart.id,
        version: cart.version,
        locale: dataLocale,
      })
      .then(
        () => {
          showNotification({
            kind: 'success',
            domain: DOMAINS.SIDE,
            text: intl.formatMessage(messages.cartUpdated),
          });
          return true;
        },
        (graphQLErrors) => {
          const transformedErrors = transformErrors(graphQLErrors);
          if (transformedErrors.unmappedErrors.length > 0) {
            showApiErrorNotification({
              errors: transformedErrors.unmappedErrors,
            });
          }
          return false;
        }
      );
  };

  const handleRemoveDiscountCode = (id: string) => {
    handleUpdateCart([
      {
        removeDiscountCode: {
          discountCode: {
            typeId: 'discount-code',
            id,
          },
        },
      },
    ]);
  };

  const handleApplyDiscountCode = (code: string) =>
    handleUpdateCart([
      {
        addDiscountCode: { code: code },
      },
    ]);
  return (
    <CustomFormModalPage
      title={intl.formatMessage(messages.title)}
      subtitle={cart.id}
      topBarPreviousPathLabel={intl.formatMessage(messages.previous)}
      isOpen={true}
      onClose={onClose}
      formControls={
        <>
          <CustomFormModalPage.FormDeleteButton
            onClick={() => handleDelete()}
          />
        </>
      }
    >
      <PageContentWide>
        <Spacings.Stack scale="xl">
          <CartDetailsGeneralInfoHeader cart={cart} />
          <Spacings.Stack scale="xl">
            <CartDetailsItems cart={cart} />
            <CartAppliedDiscountsPanel
              cart={cart}
              onApplyDiscountCode={handleApplyDiscountCode}
              onRemoveDiscountCode={handleRemoveDiscountCode}
            />
          </Spacings.Stack>
          {(cart.lineItems.length >= 1 || cart.customLineItems.length >= 1) && (
            <Card type="raised">
              <CartSummaryPricingBreakdown cart={cart} />
            </Card>
          )}
          <AddressesPanel cart={cart} />
        </Spacings.Stack>
      </PageContentWide>
    </CustomFormModalPage>
  );
};

export default CustomerCart;
