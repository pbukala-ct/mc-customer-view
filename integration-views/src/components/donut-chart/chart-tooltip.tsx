import type { ReactElement } from 'react';
import { css } from '@emotion/react';
import { TooltipWithBounds, defaultStyles, useTooltip } from '@visx/tooltip';
import type { Data } from './donut-chart';
import { customProperties } from '@commercetools-uikit/design-system';
import Spacings from '@commercetools-uikit/spacings';

// Note: Without this, tooltips overlap the cursor. Adjusted as needed.
const tooltipOffset = 24;

const ChartTooltip = ({
  children,
  formatTooltipLabel,
}: {
  children: (
    showTooltip: (args: any) => void,
    hideTooltip: () => void,
    tooltipData: any
  ) => ReactElement;
  formatTooltipLabel: (frequency: number) => string;
}) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<Data>();

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      {tooltipOpen &&
        tooltipData &&
        tooltipLeft != null &&
        tooltipTop != null && (
          <TooltipWithBounds
            left={tooltipLeft + tooltipOffset}
            top={tooltipTop}
            style={{
              ...defaultStyles,
              backgroundColor: customProperties.colorAccent10,
              color: customProperties.colorNeutral98,
              borderRadius: customProperties.spacing10,
            }}
            data-testid="chart-tooltip"
          >
            <Spacings.InsetSquish scale="s">
              {formatTooltipLabel(tooltipData.frequency)}
            </Spacings.InsetSquish>
          </TooltipWithBounds>
        )}
      {children(showTooltip, hideTooltip, tooltipData)}
    </div>
  );
};

export default ChartTooltip;
