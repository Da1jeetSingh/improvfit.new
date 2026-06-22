import { cn } from "@/lib/utils";

export type ChartPoint = {
  label: string;
  value: number;
};

export type ChartLineSeries = {
  id: string;
  data: ChartPoint[];
  color?: string;
  fill?: string;
  fillOpacity?: number;
  dashed?: boolean;
  showDots?: boolean;
  showFill?: boolean;
  strokeWidth?: number;
};

type ChartLineProps = {
  data?: ChartPoint[];
  series?: ChartLineSeries[];
  className?: string;
  "aria-label"?: string;
};

const CHART_WIDTH = 360;
const CHART_HEIGHT = 196;
const PADDING = { top: 18, right: 16, bottom: 34, left: 36 };

function resolveSeries(
  data: ChartPoint[] | undefined,
  series: ChartLineSeries[] | undefined,
): ChartLineSeries[] {
  if (series?.length) {
    return series;
  }

  return [
    {
      id: "primary",
      data: data ?? [],
      color: "var(--green-deep)",
      fill: "var(--green-tint)",
      fillOpacity: 0.45,
    },
  ];
}

function buildSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;

    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

function getNiceMax(value: number) {
  if (value <= 0) {
    return 4;
  }

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;

  if (normalized <= 1) {
    return magnitude;
  }

  if (normalized <= 2) {
    return 2 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

function getYTicks(max: number) {
  const step = max / 3;
  return [0, step, step * 2, max];
}

export function ChartLine({
  data,
  series,
  className,
  "aria-label": ariaLabel,
}: ChartLineProps) {
  const resolvedSeries = resolveSeries(data, series);
  const allValues = resolvedSeries.flatMap((entry) =>
    entry.data.map((point) => point.value),
  );
  const pointCount = Math.max(
    ...resolvedSeries.map((entry) => entry.data.length),
    1,
  );
  const max = getNiceMax(Math.max(...allValues, 0));
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const stepX = pointCount > 1 ? plotWidth / (pointCount - 1) : 0;
  const baselineY = PADDING.top + plotHeight;
  const yTicks = getYTicks(max);

  const renderedSeries = resolvedSeries.map((entry, seriesIndex) => {
    const points = entry.data.map((point, index) => ({
      x: PADDING.left + stepX * index,
      y: PADDING.top + plotHeight - (point.value / max) * plotHeight,
    }));

    const showFill = entry.showFill ?? seriesIndex === 0;
    const showDots = entry.showDots ?? seriesIndex === 0;

    return {
      ...entry,
      points,
      linePath: buildSmoothPath(points),
      showFill,
      showDots,
      strokeWidth: entry.strokeWidth ?? (seriesIndex === 0 ? 2.5 : 2),
    };
  });

  const axisLabels = resolvedSeries[0]?.data ?? [];

  return (
    <figure className={cn("w-full", className)} aria-label={ariaLabel}>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="h-48 w-full"
        role="img"
        aria-hidden={Boolean(ariaLabel)}
      >
        {yTicks.map((tick) => {
          const y = PADDING.top + plotHeight - (tick / max) * plotHeight;

          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={CHART_WIDTH - PADDING.right}
                y2={y}
                stroke="var(--border-subtle)"
                strokeWidth="1"
              />
              <text
                x={PADDING.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted text-[10px] font-medium"
              >
                {Number.isInteger(tick) ? tick : Math.round(tick)}
              </text>
            </g>
          );
        })}

        {renderedSeries.map((entry) =>
          entry.linePath ? (
            <g key={entry.id}>
              {entry.showFill ? (
                <path
                  d={`${entry.linePath} L ${entry.points.at(-1)?.x ?? PADDING.left} ${baselineY} L ${entry.points[0]?.x ?? PADDING.left} ${baselineY} Z`}
                  fill={entry.fill ?? "var(--green-tint)"}
                  opacity={entry.fillOpacity ?? 0.45}
                />
              ) : null}
              <path
                d={entry.linePath}
                fill="none"
                stroke={entry.color ?? "var(--green-deep)"}
                strokeWidth={entry.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={entry.dashed ? "6 4" : undefined}
              />
              {entry.showDots
                ? entry.points.map((point, index) => (
                    <circle
                      key={`${entry.id}-${entry.data[index]?.label ?? index}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="var(--surface-raised)"
                      stroke={entry.color ?? "var(--green-deep)"}
                      strokeWidth="2"
                    />
                  ))
                : null}
            </g>
          ) : null,
        )}

        {axisLabels.map((point, index) => (
          <text
            key={point.label}
            x={PADDING.left + stepX * index}
            y={CHART_HEIGHT - 10}
            textAnchor="middle"
            className="fill-muted text-[10px] font-semibold uppercase tracking-[0.08em]"
          >
            {point.label}
          </text>
        ))}
      </svg>
    </figure>
  );
}
