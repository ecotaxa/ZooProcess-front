import React from 'react';
// Import the raw SVG so we can inject it into the DOM once
// Vite supports ?raw to import file contents as string
// @ts-ignore
import sprite from './zooprocess_icons.svg?raw';

/**
 * Injects the ZooProcess SVG sprite into the DOM once.
 * We keep it in the document so <use href="#id"> works reliably across refreshes.
 */
export function ZooprocessSprite() {
  return (
    <div
      // Hide the sprite without using display:none to keep referenced nodes resolvable
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden
      // Inject whole <svg> content
      dangerouslySetInnerHTML={{ __html: sprite }}
    />
  );
}

export default ZooprocessSprite;
