import React, { useEffect, useRef, useState } from 'react';
import type { IconSvgProps } from '../../types';

// We keep the SVG sprite in the same document (injected once in Providers)
// and reference its internal groups by id using <use href="#id">.

// The original sprite canvas size (see the SVG file metadata)
const SPRITE_VIEWBOX = '0 0 120.26458 20.132282';

export const ZPIconIds = {
  // Outlined variants (preferred)
  list: 'g7',
  pages: 'g8',
  instrument: 'g9',
  process: 'g10',
  wave: 'g11',
  upload: 'g12',
  link: 'g13',
  // Originals (fill/no stroke) — included for completeness
  listFill: 'g1',
  pagesFill: 'g2',
  instrumentFill: 'g3',
  processFill: 'g4',
  waveFill: 'g5',
  uploadFill: 'g6',
  altSketch: 'g14',
} as const;

export type ZPIconName = (typeof ZPIconIds)[keyof typeof ZPIconIds] | keyof typeof ZPIconIds;

export type ZooprocessIconProps = IconSvgProps & {
  /**
   * Icon id or key. You can pass either a known key from ZPIconIds (e.g. "upload")
   * or a raw id that exists in the zooprocess_icons.svg file (e.g. "g12").
   */
  name: ZPIconName;
  /** Optional human-friendly accessible label. If omitted, the icon is aria-hidden. */
  label?: string;
  /** Optional viewBox override. If not provided, we auto-measure the content's bbox. */
  viewBox?: string;
};

/**
 * Renders one of the custom ZooProcess SVG icons using an in-document sprite.
 *
 * This component auto-calculates the correct viewBox by measuring the rendered
 * geometry of the referenced <use> element (via getBBox). This makes groups placed
 * anywhere in the source sprite render at the requested size without manual tuning.
 */
export function ZooprocessIcon({
  name,
  size = 24,
  className,
  label,
  viewBox,
  ...rest
}: ZooprocessIconProps) {
  // Allow passing a key like "upload" or a raw id like "g12".
  const id = (
    name in ZPIconIds ? (ZPIconIds as any)[name as keyof typeof ZPIconIds] : name
  ) as string;
  const href = `#${id}`;

  const ariaProps = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };

  const useRefEl = useRef<SVGUseElement | null>(null);
  const [autoViewBox, setAutoViewBox] = useState<string | null>(null);

  // Measure the geometry of the <use> content once it is in the DOM
  useEffect(() => {
    if (viewBox) {
      setAutoViewBox(null);
      return;
    }
    const u = useRefEl.current;
    if (!u || typeof (u as any).getBBox !== 'function') return;
    try {
      const bb = (u as any).getBBox();
      if (bb && bb.width && bb.height) {
        setAutoViewBox(`${bb.x} ${bb.y} ${bb.width} ${bb.height}`);
      } else {
        setAutoViewBox(SPRITE_VIEWBOX);
      }
    } catch {
      // getBBox may throw if not yet rendered; fallback to sprite viewBox
      setAutoViewBox(SPRITE_VIEWBOX);
    }
  }, [name, viewBox]);

  const finalViewBox = viewBox ?? autoViewBox ?? SPRITE_VIEWBOX;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={finalViewBox}
      width={size}
      height={size}
      className={className}
      focusable="false"
      {...ariaProps}
      {...rest}
    >
      {/* eslint-disable-next-line react/no-unknown-property */}
      <use href={href} ref={useRefEl as any} />
    </svg>
  );
}

export default ZooprocessIcon;
