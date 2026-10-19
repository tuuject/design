import { components, sizes } from '@koi/tokens/dimensions';
import type { ReactNode, SVGProps } from 'react';

// Admin-specific line icons, drawn in Koi's icon style: 24px grid, `components.icon.stroke` (2.25)
// stroke, round caps and joins, currentColor. Koi's own set lives in @koi/react/icons; icons here are
// template business icons (nav destinations, shell controls), candidates for the library once specced.
type IconProps = { size?: number } & SVGProps<SVGSVGElement>;

function Svg({ size = sizes.icon, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={components.icon.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const LayoutIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="4" width="7" height="7" rx="2" />
    <rect x="13" y="4" width="7" height="7" rx="2" />
    <rect x="4" y="13" width="7" height="7" rx="2" />
    <rect x="13" y="13" width="7" height="7" rx="2" />
  </Svg>
);

export const OrdersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M6.5 3.5h11A1.5 1.5 0 0119 5v15l-3.2-2-3.3 2-3.3-2L6 20V5a1.5 1.5 0 01.5-1.5z"
      transform="translate(0 -1)"
    />
    <path d="M9 8.5h6" transform="translate(0 -1)" />
    <path d="M9 12.5h6" transform="translate(0 -1)" />
  </Svg>
);

export const SlidersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h9" />
    <circle cx="15.5" cy="7" r="2" />
    <path d="M19.5 7H20.5" />
    <path d="M4 17h2.5" />
    <circle cx="8.5" cy="17" r="2" />
    <path d="M12.5 17H20" />
  </Svg>
);

export const LogoutIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 4.5H7A1.5 1.5 0 005.5 6v12A1.5 1.5 0 007 19.5h6.5" />
    <path d="M10 12h10" />
    <path d="M16.5 8.5L20 12l-3.5 3.5" />
  </Svg>
);

export const SunIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
  </Svg>
);

export const MoonIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 13.5A8 8 0 1110.5 4 6.5 6.5 0 0020 13.5z" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const PanelLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M9.5 4.5v15" />
  </Svg>
);

export const TrashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 7h14" />
    <path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7" />
    <path d="M7 7l1 12a1.5 1.5 0 001.5 1.4h5A1.5 1.5 0 0016 19l1-12" />
    <path d="M10 11v5M14 11v5" />
  </Svg>
);

export const EyeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
    <circle cx="12" cy="12" r="2.5" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h15" />
    <path d="M13.5 6.5L19 12l-5.5 5.5" />
  </Svg>
);
