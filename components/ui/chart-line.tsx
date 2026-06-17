"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

export type ChartLinePoint = {
  label: string;
  value: number;
};

type ChartLineProps = {
  data: ChartLinePoint[];
  className?: string;
  color?: string;
  unit?: string;
};

const CHART_HEIGHT = 160;
const CHART_WIDTH = 320;
const PADDING_X = 12;
const PADDING_Y = 16;

function buildPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command}${point.x},${point.y}`;
    })
    .join(" ");
}

export function ChartLine({
  data,
  className,
  color = "var(--chart-primary)",
  unit,
}: ChartLineProps) {
  const gradientId = useId().replace(/:/g, "");
  const max = Math.max(...data.map((point) => point.value), 1);
  const innerWidth = CHART_WIDTH - PADDING_X * 2;
  const innerHeight = CHART_HEIGHT - PADDING_Y * 2;
  const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;

  const coordinates = data.map((point, index) => {
    const x = PADDING_X + index * step;
    const normalized = point.value / max;
    const y = PADDING_Y + innerHeight - normalized * innerHeight;
    return { x, y, point };
  });

  const linePath = buildPath(coordinates);
  const areaPath =
    coordinates.length > 0
      ? `${linePath} L${coordinates[coordinates.length - 1]?.x ?? PADDING_X},${PADDING_Y + innerHeight} L${coordinates[0]?.x ?? PADDING_X},${PADDING_Y + innerHeight} Z`
      : "";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border-subtle bg-surface p-4",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="h-40 w-full"
        role="img"
        aria-hidden={data.length === 0}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((fraction) => {
          const y = PADDING_Y + innerHeight * (1 - fraction);
          return (
            <line
              key={fraction}
              x1={PADDING_X}
              y1={y}
              x2={CHART_WIDTH - PADDING_X}
              y2={y}
              stroke="var(--border-subtle)"
              strokeWidth="1"
            />
          );
        })}

        {areaPath ? (
          <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        ) : null}

        {linePath ? (
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}

        {coordinates.map(({ x, y, point }) => (
          <g key={point.label}>
            <circle cx={x} cy={y} r="4" fill="var(--surface-raised)" />
            <circle cx={x} cy={y} r="3" fill={color} />
          </g>
        ))}
      </svg>

      <div className="mt-3 flex justify-between gap-2">
        {data.map((point) => (
          <div key={point.label} className="min-w-0 flex-1 text-center">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-muted">
              {point.label}
            </p>
            <p className="mt-0.5 text-sm font-bold text-foreground">
              {point.value}
              {unit ? (
                <span className="text-xs font-semibold text-muted">{unit}</span>
              ) : null}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
