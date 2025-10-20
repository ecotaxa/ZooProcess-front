const CONTOUR_COLORS = [
  // Colors chosen from the Tableau 10 categorical palette,
  // which keeps a balanced visual intensity across hues (no overly bright yellows).
  '#1f77b4', // blue
  '#ff7f0e', // orange
  '#2ca02c', // green
  '#d62728', // red
  '#9467bd', // purple
  '#8c564b', // brown
  '#e377c2', // pink
  '#7f7f7f', // gray
  '#bcbd22', // olive
  '#17becf', // cyan
];

// Flatten color palettes and define a small hex->rgb helper
const flatColors: string[] = ([] as string[]).concat(...CONTOUR_COLORS);
export const toRgb = (hex: string) => {
  let h = hex.trim();
  if (h.startsWith('#')) h = h.slice(1);
  if (h.length === 3)
    h = h
      .split('')
      .map(c => c + c)
      .join('');
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return { r, g, b };
};
export const RGB_CONTOUR_COLORS = flatColors.map(toRgb);
