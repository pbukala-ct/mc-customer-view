import { css } from '@emotion/react';
import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import ChartLegend from './chart-legend';
import ChartTooltip from './chart-tooltip';
import Spacings from '@commercetools-uikit/spacings';

export type Data = {
  name: string;
  frequency: number;
  primaryColor: string;
  secondaryColor: string;
};

// Offset by 1 so that border outlines don't clip
const defaultMargin = { top: 1, right: 1, bottom: 1, left: 1 };

type DonutChartProps = {
  /**
   * Width of the donut chart.
   */
  width: number;
  /**
   * Array of data objects for the chart.
   */
  data: Array<Data>;
  /**
   * Margins around the chart.
   */
  margin?: typeof defaultMargin;
  /**
   * A function to format the tooltip label.
   * @param frequency - The frequency value from the chart's data, which needs formatting.
   * @returns {string} The formatted label as a string.
   */
  formatTooltipLabel: (frequency: number) => string;
};

const DonutChart = ({
  width,
  data,
  margin = defaultMargin,
  formatTooltipLabel,
}: DonutChartProps) => {
  // Calculate the height of the chart as half the width (half donut chart)
  const height = width / 2;

  // Calculate the inner width of the chart area, accounting for margins
  const innerWidth = width - margin.left - margin.right;

  // Calculate the inner height of the chart area, also accounting for margins
  const innerHeight = height - margin.top - margin.bottom;

  // Determine the radius of the donut chart, which is the minimum of innerWidth and innerHeight
  const radius = Math.min(innerWidth, innerHeight);

  // Set the center Y-coordinate of the donut chart
  const centerY = innerHeight;

  // Calculate the center X-coordinate of the donut chart
  const centerX = innerWidth / 2;

  // Calculate the top position of the chart group, including the top margin
  const top = centerY + margin.top;

  // Calculate the left position of the chart group, including the left margin
  const left = centerX + margin.left;

  // Define the starting angle of the donut chart as -90 degrees
  const startAngle = -Math.PI / 2;

  // Define the ending angle of the donut chart as 90 degrees
  const endAngle = Math.PI / 2;

  // Set the inner radius of the donut chart to be half of the calculated radius
  const innerRadius = radius / 2;

  return (
    <ChartTooltip formatTooltipLabel={formatTooltipLabel}>
      {(showTooltip, hideTooltip, tooltipData) => (
        <Spacings.Stack scale="m">
          <Spacings.Inline justifyContent="center">
            <svg width={width} height={height} role="img">
              <Group top={top} left={left}>
                <Pie
                  data={data}
                  pieValue={(d) => d.frequency}
                  pieSortValues={null}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  innerRadius={innerRadius}
                  outerRadius={radius}
                  cornerRadius={4}
                  padAngle={0.005}
                >
                  {(pie) => {
                    return pie.arcs.map((arc, index) => {
                      const { name, primaryColor, secondaryColor } = arc.data;
                      const arcPath = pie.path(arc);

                      return (
                        <g key={`arc-${name}-${index}`}>
                          <path
                            data-testid="donut-arc"
                            d={arcPath ?? undefined}
                            fill={primaryColor}
                            css={
                              tooltipData?.name === name &&
                              css`
                                stroke: ${secondaryColor};
                                stroke-width: 1px;
                                cursor: pointer;
                              `
                            }
                            onMouseLeave={hideTooltip}
                            onMouseMove={(event) => {
                              const eventSvgCoords = localPoint(event);

                              showTooltip({
                                tooltipData: arc.data,
                                tooltipTop: eventSvgCoords?.y,
                                tooltipLeft: eventSvgCoords?.x,
                              });
                            }}
                          />
                        </g>
                      );
                    });
                  }}
                </Pie>
              </Group>
            </svg>
          </Spacings.Inline>
          <ChartLegend data={data} />
        </Spacings.Stack>
      )}
    </ChartTooltip>
  );
};

export default DonutChart;
