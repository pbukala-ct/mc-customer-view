import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import { CheckActiveIcon, ListIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import Stamp from '@commercetools-uikit/stamp';
import styles from './info-card.module.css';
import { FC, ReactElement } from 'react';
import { TTone } from '@commercetools-uikit/stamp/dist/declarations/src/stamp';
import FlatButton from '@commercetools-uikit/flat-button';
import DonutChart from '../donut-chart';
import { useIntl } from 'react-intl';
import { Data } from '../donut-chart/donut-chart';
import OrderDetailsItem, {
  DetailsItemProps,
} from '../order/order-details-item';

type Props = {
  title: string;
  text?: string;
  icon?: ReactElement;
  infos?: Array<{ label: string; tone: TTone; value: string }>;
  data?: Array<Data>;
  listData?: Array<DetailsItemProps>;
  ctaText?: string;
};

const InfoCard: FC<Props> = ({
  title,
  text,
  icon = <CheckActiveIcon color={'neutral60'} />,
  infos,
  data,
  listData,
  ctaText,
}) => {
  const { formatNumber } = useIntl();
  return (
    <Card theme="light" type="raised">
      <Spacings.Stack scale={'s'}>
        <Spacings.Inline
          scale={'s'}
          alignItems={'center'}
          justifyContent={'flex-start'}
        >
          {icon}
          <Text.Subheadline as={'h5'} tone={'secondary'}>
            {title}
          </Text.Subheadline>
        </Spacings.Inline>
        {text && <Text.Headline as={'h3'}>{text}</Text.Headline>}
        {infos && (
          <div className={styles.infoCardBox}>
            <Spacings.Stack scale={'s'}>
              {infos.map((value, index) => (
                <Spacings.Inline
                  scale={'s'}
                  justifyContent={'space-between'}
                  key={index}
                >
                  <Stamp
                    isCondensed={true}
                    label={value.label}
                    tone={value.tone}
                  />
                  <Text.Body>{value.value}</Text.Body>
                </Spacings.Inline>
              ))}
            </Spacings.Stack>
          </div>
        )}
        {data && (
          <DonutChart
            width={160}
            formatTooltipLabel={(label) => {
              return formatNumber(label);
            }}
            data={data}
          />
        )}
        {listData && (
          <Spacings.Stack scale={'m'}>
            {listData.map((item, index) => {
              return <OrderDetailsItem {...item} key={index} />;
            })}
          </Spacings.Stack>
        )}
        {ctaText && (
          <FlatButton
            label={ctaText}
            as={'a'}
            icon={<ListIcon />}
            tone={'primary'}
            type={'button'}
          />
        )}
      </Spacings.Stack>
    </Card>
  );
};

export default InfoCard;
