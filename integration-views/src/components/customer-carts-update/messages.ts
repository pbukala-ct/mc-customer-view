import { defineMessages } from 'react-intl';

export default defineMessages({
  titleDelete: {
    id: 'deleteAsset.title',
    defaultMessage: 'You are about to delete a cart, please confirm',
  },
  titleFreeze: {
    id: 'freezeAsset.title',
    defaultMessage: 'You are about to freeze a cart, please confirm',
  },
  titleUnfreeze: {
    id: 'unfreezeAsset.title',
    defaultMessage: 'You are about to unfreeze a cart, please confirm',
  },
  titleNotrecognized: {
    id: 'notrecognizedAsset.title',
    defaultMessage: 'Not recognized action',
  },
  titleNoFreezePossible: {
    id: 'nofreezepossible.title',
    defaultMessage:
      'Freezing cart not possible - cart must be in an Active state!',
  },
  titleNoUnfreezePossible: {
    id: 'nounfreezepossible.title',
    defaultMessage: 'Only cart in Frozen state can be unfrozen!',
  },
  updateSuccess: {
    id: 'EditType.form.message.update.success',
    defaultMessage: 'Your Cart(s) have been updated.',
  },
});
