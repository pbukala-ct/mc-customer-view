import Spacings from '@commercetools-uikit/spacings';
import { CheckActiveIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import { FormattedDate } from 'react-intl';
import { FC } from 'react';

export type DetailsItemProps = {
  date: number;
  headline: string;
  body: string;
};
const OrderDetailsItem: FC<DetailsItemProps> = ({ date, headline, body }) => {
  return (
    <Spacings.Inline alignItems={'center'}>
      <CheckActiveIcon color={'primary'} />

      <Spacings.Stack scale={'xs'}>
        <Text.Caption>
          <FormattedDate value={date} />
        </Text.Caption>
        <Spacings.Inline>
          <Text.Headline as={'h3'}>{headline}:</Text.Headline>
          <Text.Body>{body}</Text.Body>
        </Spacings.Inline>
      </Spacings.Stack>
    </Spacings.Inline>
  );
};

export default OrderDetailsItem;
