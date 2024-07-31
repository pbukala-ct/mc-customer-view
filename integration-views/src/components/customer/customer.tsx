import { FC } from 'react';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import Text from '@commercetools-uikit/text';
import {
  TabHeader,
  TabularMainPage,
} from '@commercetools-frontend/application-components';
import Spacings from '@commercetools-uikit/spacings';
import {
  PlusBoldIcon,
  ExportIcon,
  SpeechBubbleIcon,
} from '@commercetools-uikit/icons';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { ComponentProps } from '../../routes';
import { useCustomerFetcher } from '../../hooks/use-customer-connector/use-customers-connector';
import { Route, Switch, useRouteMatch } from 'react-router';
import CustomerDashboard from '../customer-dashboard/customer-dashboard';
import CustomerCarts from '../customer-carts/customer-carts';
import CustomerShoppingLists from '../customer-shopping-lists/customer-shopping-lists';

const Customer: FC<ComponentProps> = ({ id }) => {
  const match = useRouteMatch();
  const { customer, error, loading } = useCustomerFetcher({
    id: id,
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  if (!loading && !customer) {
    return (
      <ContentNotification type="info">
        <Text.Body>No Results</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <TabularMainPage
      customTitleRow={
        <Spacings.Inline justifyContent="space-between">
          <Text.Headline as="h2">Customer View</Text.Headline>
          <Spacings.Inline justifyContent="space-between">
            <PrimaryButton iconLeft={<PlusBoldIcon />} label={'Open in CRM'} />
            <SecondaryButton
              iconLeft={<SpeechBubbleIcon />}
              label={'Log Complaint'}
            />
            <SecondaryButton
              iconLeft={<ExportIcon />}
              label={'Export as XLS'}
            />
          </Spacings.Inline>
        </Spacings.Inline>
      }
      tabControls={
        <>
          <TabHeader
            to={`${match.url}`}
            label="Customer Dashboard"
            exactPathMatch={true}
          />
          <TabHeader to={`${match.url}/carts`} label="Carts" />
          <TabHeader to={`${match.url}/shopping-lists`} label="Shopping List" />
        </>
      }
    >
      <Switch>
        <Route path={`${match.path}`} exact={true}>
          <CustomerDashboard />
        </Route>
        <Route path={`${match.path}/carts`}>
          <CustomerCarts id={id} />
        </Route>
        <Route path={`${match.path}/shopping-lists`}>
          <CustomerShoppingLists id={id} />
        </Route>
      </Switch>
    </TabularMainPage>
  );
};

export default Customer;
