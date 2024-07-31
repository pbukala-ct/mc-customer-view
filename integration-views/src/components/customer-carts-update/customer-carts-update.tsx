import { FC } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  ConfirmationDialog,
  useModalState,
} from '@commercetools-frontend/application-components';
import { useIntl } from 'react-intl';
import messages from './messages';
import { TCart } from '../../types/generated/ctp';
import { useCartDeleter, useCartUpdater } from '../../hooks/use-carts-hook';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import {
  TApiErrorNotificationOptions,
  useShowApiErrorNotification,
  useShowNotification,
} from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import { transformErrors } from '../../helpers';

type Props = {
  action: 'delete' | 'freeze' | 'unfreeze';
  onCancel: () => void;
  onClose: () => void;
  items: Array<TCart>;
};

export const CustomerCartsUpdate: FC<Props> = ({
  action,
  onCancel,
  items,
  onClose,
}) => {
  const intl = useIntl();
  const { isModalOpen, closeModal } = useModalState(true);
  const showNotification = useShowNotification();
  const showApiErrorNotification = useShowApiErrorNotification();
  const { execute } = useCartUpdater();
  const { execute: deleteCart } = useCartDeleter();
  const { dataLocale } = useCustomViewContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  console.log(action);

  const handleConfirm = async () => {
    try {
      if (action === 'freeze') {
        for (const cart of items) {
          await execute({
            updateActions: [{ freezeCart: { dummy: '' } }],
            version: cart.version,
            id: cart.id,
            locale: dataLocale,
          });
        }
      } else if (action == 'unfreeze') {
        for (const cart of items) {
          await execute({
            updateActions: [{ unfreezeCart: { dummy: '' } }],
            version: cart.version,
            id: cart.id,
            locale: dataLocale,
          });
        }
      } else if (action == 'delete') {
        for (const cart of items) {
          await deleteCart({ version: cart.version, id: cart.id });
        }
      }
      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.updateSuccess),
      });
    } catch (graphQLErrors) {
      const transformedErrors = transformErrors(graphQLErrors);
      if (transformedErrors.unmappedErrors.length > 0) {
        showApiErrorNotification({
          errors:
            transformedErrors.unmappedErrors as TApiErrorNotificationOptions['errors'],
        });
      }
    }

    onClose();
  };

  const handleCancel = () => {
    onCancel();
    closeModal();
  };

  let messageTitle;
  let disableConfirmation = false;
  if (action === 'delete') {
    messageTitle = messages.titleDelete;
  } else if (action === 'freeze') {
    messageTitle = messages.titleFreeze;
  } else if (action === 'unfreeze') {
    messageTitle = messages.titleUnfreeze;
  } else {
    messageTitle = messages.titleNotrecognized;
  }
  return (
    <ConfirmationDialog
      title="Confirm Cart Update"
      isOpen={isModalOpen}
      onClose={closeModal}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      isPrimaryButtonDisabled={disableConfirmation}
    >
      <Spacings.Stack scale="m">
        <Text.Body>{intl.formatMessage(messageTitle)}</Text.Body>
      </Spacings.Stack>
    </ConfirmationDialog>
  );
};

export default CustomerCartsUpdate;
