import { ApolloError, isApolloError, ServerError } from '@apollo/client';
import {
  TAddress,
  TBaseMoney,
  TCustomLineItem,
  THighPrecisionMoney,
  TLineItem,
} from './types/generated/ctp';
import { IntlShape } from 'react-intl';
import omitEmpty from 'omit-empty-es';

export const getErrorMessage = (error: ApolloError) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

const isServerError = (
  error: ApolloError['networkError']
): error is ServerError => {
  return Boolean((error as ServerError)?.result);
};

export const extractErrorFromGraphQlResponse = (graphQlResponse: unknown) => {
  if (graphQlResponse instanceof Error && isApolloError(graphQlResponse)) {
    if (
      isServerError(graphQlResponse.networkError) &&
      typeof graphQlResponse.networkError?.result !== 'string' &&
      graphQlResponse.networkError?.result?.errors.length > 0
    ) {
      return graphQlResponse?.networkError?.result.errors;
    }

    if (graphQlResponse.graphQLErrors?.length > 0) {
      return graphQlResponse.graphQLErrors;
    }
  }

  return graphQlResponse;
};

export function getFractionedAmount(moneyValue: TBaseMoney) {
  const { fractionDigits = 2 } = moneyValue;

  // the amount should be available on preciseAmount for highPrecision
  const amount =
    moneyValue.type === 'highPrecision'
      ? (moneyValue as THighPrecisionMoney).preciseAmount
      : moneyValue.centAmount;

  return amount / 10 ** fractionDigits;
}

export function formatMoney(
  moneyValue: TBaseMoney | undefined | null,
  intl: IntlShape,
  options?: Record<string, unknown>
) {
  if (!moneyValue || !moneyValue.currencyCode) {
    return '';
  }
  return intl.formatNumber(getFractionedAmount(moneyValue), {
    style: 'currency',
    currency: moneyValue.currencyCode,
    minimumFractionDigits: moneyValue.fractionDigits,
    ...options,
  });
}

const joinMe = (input: Array<string | undefined | null>, separator = ' ') => {
  return input.filter((item) => item).join(separator);
};

export const formatAddress = (address?: TAddress | null) => {
  if (!address) {
    return '';
  }
  const name = joinMe([address.firstName, address.lastName]);
  const addressAsString = joinMe([address.streetName, address.streetNumber]);
  return joinMe(
    [name, addressAsString, address.postalCode, address.city, address.country],
    ', '
  );
};

export const transformErrors = (apiErrors: Array<any> | any) => {
  const formErrors: Array<any> = [];
  const unmappedErrors: Array<any> = [];

  if (!Array.isArray(apiErrors))
    return {
      formErrors,
      unmappedErrors: [apiErrors],
    };

  apiErrors.forEach((graphQLError) => {
    if (
      (graphQLError?.extensions?.code ?? graphQLError?.code) ===
      'DiscountCodeNonApplicable'
    ) {
    }
    return unmappedErrors.push(graphQLError);
  });

  return {
    formErrors: omitEmpty(formErrors),
    unmappedErrors,
  };
};

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export function convertRatioToPercentage(ratio: number) {
  return parseFloat((ratio * 100).toFixed(2));
}

export function formatPercentage(percentage: number) {
  return `${percentage}%`;
}

export const isCustomLineItem = (
  object: TCustomLineItem | TLineItem
): object is TCustomLineItem => {
  return 'money' in object;
};

export const isLineItem = (
  object: TCustomLineItem | TLineItem
): object is TLineItem => {
  return 'price' in object;
};
