import type { ApolloError } from '@apollo/client';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import type { TQuery, TQuery_CustomerArgs } from '../../types/generated/ctp';
import FetchCustomerQuery from './fetch-customer.ctp.graphql';

type TUseCustomerFetcher = (variables: TQuery_CustomerArgs) => {
  customer?: TQuery['customer'];
  error?: ApolloError;
  loading: boolean;
};

export const useCustomerFetcher: TUseCustomerFetcher = (variables) => {
  const { data, error, loading } = useMcQuery<TQuery, TQuery_CustomerArgs>(
    FetchCustomerQuery,
    {
      variables: variables,
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    }
  );

  return {
    customer: data?.customer,
    error,
    loading,
  };
};
