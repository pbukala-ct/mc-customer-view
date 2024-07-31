import { FC } from 'react';
import { BinFilledIcon } from '@commercetools-uikit/icons';
import IconButton from '@commercetools-uikit/icon-button';
import { TIconButtonProps } from '@commercetools-uikit/icon-button/dist/declarations/src/icon-button';

type Props = {
  handleRemoveLineItem: () => Promise<void>;
  isDisabled?: boolean;
  size?: TIconButtonProps['size'];
};

export const CartItemTableDelete: FC<Props> = ({
  handleRemoveLineItem,
  isDisabled,
  size,
}) => {
  return (
    <IconButton
      icon={<BinFilledIcon />}
      label={'Delete'}
      onClick={handleRemoveLineItem}
      size={size}
      isDisabled={isDisabled}
    />
  );
};

export default CartItemTableDelete;
