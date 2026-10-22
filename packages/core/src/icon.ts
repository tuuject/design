/**
 * An icon in Iconify's data format (`IconifyIcon`): the markup inside the <svg> and its viewBox. Any Iconify
 * set fits (`@iconify-icons/<set>/<name>`), so sets can be mixed, and a hand-drawn SVG is written the same way.
 * Koi's own icons come from Font Awesome Free Solid (`@iconify-icons/fa7-solid`).
 */
export interface IconData {
  /** Everything inside the <svg>, drawn in currentColor. */
  body: string;
  /** viewBox width. Default 16, as in Iconify. */
  width?: number;
  /** viewBox height. Default 16, as in Iconify. */
  height?: number;
  /** viewBox x origin. Default 0. */
  left?: number;
  /** viewBox y origin. Default 0. */
  top?: number;
}

export interface IconOwnProps {
  icon: IconData;
  /** px. The box is square and the drawing is centered in it. Default `icon` (16). */
  size?: number;
}
