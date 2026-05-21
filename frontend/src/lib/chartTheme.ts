import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';

function cssVar(name: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value ? `hsl(${value})` : '';
}

export type ChartPalette = {
  teal: string;
  violet: string;
  sky: string;
  slate: string;
  muted: string;
  primary: string;
  secondary: string;
  axis: string;
  grid: string;
  tooltip: {
    background: string;
    border: string;
    color: string;
  };
};

export function getChartPalette(): ChartPalette {
  return {
    teal: cssVar('--chart-teal'),
    violet: cssVar('--chart-violet'),
    sky: cssVar('--chart-sky'),
    slate: cssVar('--chart-slate'),
    muted: cssVar('--chart-slate'),
    primary: cssVar('--chart-teal'),
    secondary: cssVar('--chart-violet'),
    axis: cssVar('--chart-axis'),
    grid: cssVar('--chart-grid'),
    tooltip: {
      background: cssVar('--chart-tooltip-bg'),
      border: `1px solid ${cssVar('--chart-tooltip-border')}`,
      color: cssVar('--foreground'),
    },
  };
}

export function useChartPalette(): ChartPalette {
  const { theme } = useTheme();
  return useMemo(() => getChartPalette(), [theme]);
}

export function architectureSpaceColor(
  kind: string,
  palette: ChartPalette,
): string {
  switch (kind) {
    case 'repo':
      return palette.teal;
    case 'topic':
      return palette.violet;
    case 'tech':
      return palette.sky;
    case 'anchor':
      return palette.slate;
    default:
      return palette.muted;
  }
}
