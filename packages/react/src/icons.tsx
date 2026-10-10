import * as React from 'react';

// Koi icons: 24px grid, 2.25px stroke, round caps and joins, drawn in currentColor.
// Port the rest of the set from reference/legacy-web/components/bundle.js (Icons).
type IconProps = { size?: number } & React.SVGProps<SVGSVGElement>;

function Svg({ size = 16, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const CloseIcon = (p: IconProps) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>;
export const CheckIcon = (p: IconProps) => <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>;
export const ExternalIcon = (p: IconProps) => <Svg {...p}><path d="M14 5h5v5" /><path d="M19 5l-8 8" /><path d="M18 14v4a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1h4" /></Svg>;
export const InfoIcon = (p: IconProps) => <Svg {...p}><circle cx={12} cy={12} r={9} /><path d="M12 11v5" /><path d="M12 7.5h.01" /></Svg>;
export const WarningIcon = (p: IconProps) => <Svg {...p}><path d="M10.3 4.3L2.8 17.5A2 2 0 004.5 20.5h15a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z" /><path d="M12 9.5v4" /><path d="M12 17h.01" /></Svg>;
export const SuccessIcon = (p: IconProps) => <Svg {...p}><circle cx={12} cy={12} r={9} /><path d="M8 12.5l2.5 2.5L16 9.5" /></Svg>;
export const ErrorIcon = (p: IconProps) => <Svg {...p}><circle cx={12} cy={12} r={9} /><path d="M15 9l-6 6" /><path d="M9 9l6 6" /></Svg>;
export const SearchIcon = (p: IconProps) => <Svg {...p}><circle cx={11} cy={11} r={6.5} /><path d="M20 20l-4.4-4.4" /></Svg>;
export const ChevronDownIcon = (p: IconProps) => <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>;
export const ChevronLeftIcon = (p: IconProps) => <Svg {...p}><path d="M15 6l-6 6 6 6" /></Svg>;
export const ChevronRightIcon = (p: IconProps) => <Svg {...p}><path d="M9 6l6 6-6 6" /></Svg>;
