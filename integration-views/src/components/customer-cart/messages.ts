import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'cart.title',
    defaultMessage: 'Cart details',
  },
  previous: {
    id: 'cart.back',
    defaultMessage: 'Back',
  },
  lineItems: {
    id: 'cart.lineItems',
    defaultMessage: 'Items in the cart',
  },
  deleteSuccess: {
    id: 'EditExtensions.form.message.update.success',
    defaultMessage: 'Your Cart has been deleted.',
  },
  cartUpdated: {
    id: 'Orders.Create.Step.LineItems.cartUpdated',
    description:
      'Label for the confirmation message when line item added to the cart',
    defaultMessage: 'The cart has been successfully updated',
  },
});
