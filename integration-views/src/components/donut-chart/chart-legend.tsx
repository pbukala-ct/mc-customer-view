import { css } from '@emotion/react';
import { LegendItem, LegendLabel } from '@visx/legend';
import type { Data } from './donut-chart';
import { customProperties } from '@commercetools-uikit/design-system';
import Text from '@commercetools-uikit/text';

const legendGlyphSize = 9;

const ChartLegend = ({ data }: { data: Data[] }) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
      `}
    >
      {data.map((datum, i) => (
        <LegendItem
          key={`legend-item-${i}`}
          margin={`0 ${i === 0 ? 0 : customProperties.spacing20}`}
        >
          <svg width={legendGlyphSize} height={legendGlyphSize}>
            <circle
              fill={datum.primaryColor}
              r={legendGlyphSize / 2}
              cx={legendGlyphSize / 2}
              cy={legendGlyphSize / 2}
            />
          </svg>
          <LegendLabel
            align="left"
            margin={`0 0 0 ${customProperties.spacing20}`}
          >
            <Text.Detail tone="secondary">{datum.name}</Text.Detail>
          </LegendLabel>
        </LegendItem>
      ))}
    </div>
  );
};

export default ChartLegend;
