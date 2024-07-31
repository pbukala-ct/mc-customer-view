import type { ReactNode } from 'react';
import Order from './components/order';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import Customer from './components/customer';

type ApplicationRoutesProps = {
  children?: ReactNode;
};

export type ComponentProps = { id: string };

type MappingProps = {
  [key: string]: React.LazyExoticComponent<React.FC<ComponentProps>>;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const { hostUrl } = useCustomViewContext((context) => ({
    hostUrl: context.hostUrl,
  }));

  const mapping: MappingProps = {
    orders: Order,
    customers: Customer,
  };

  if (hostUrl) {
    const splittedUrl = hostUrl.split('/');
    const key = Object.keys(mapping).filter(
      (key) => splittedUrl.indexOf(key) >= 0
    );
    if (key.length >= 1) {
      let index = key[0];
      const id = splittedUrl[splittedUrl.indexOf(index) + 1];
      const Component = mapping[index];
      return <Component id={id} />;
    }
  }

  return <></>;
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
