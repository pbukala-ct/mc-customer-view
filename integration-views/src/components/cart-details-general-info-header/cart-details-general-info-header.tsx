import { FC } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { FormattedMessage, useIntl } from 'react-intl';
import messages from './messages';
import { TCart } from '../../types/generated/ctp';

type Props = { cart: TCart };
const CartDetailsGeneralInfoHeader: FC<Props> = ({ cart }) => {
  const intl = useIntl();

  return (
    <Spacings.Inline justifyContent={'space-between'}>
      <Text.Detail tone="secondary">
        <FormattedMessage
          {...messages.dateCreated}
          values={{
            datetime:
              intl.formatDate(cart.createdAt) +
              ' ' +
              intl.formatTime(cart.createdAt),
          }}
        />
      </Text.Detail>
      <Text.Detail tone="secondary">
        <FormattedMessage
          {...messages.dateModified}
          values={{
            datetime:
              intl.formatDate(cart.lastModifiedAt) +
              ' ' +
              intl.formatTime(cart.lastModifiedAt),
          }}
        />
      </Text.Detail>
      <FormattedMessage
        {...messages.cartState}
        values={{
          cartState: cart.cartState,
        }}
      />
    </Spacings.Inline>
  );
};

CartDetailsGeneralInfoHeader.displayName = 'OrderDetailsGeneralInfoTabHeader';

export default CartDetailsGeneralInfoHeader;
