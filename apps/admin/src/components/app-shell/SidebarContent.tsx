import { NavMenu } from '@tuuject/koi-react/nav-menu';
import { useNavMenu } from './use-nav-menu';

interface SidebarContentProps {
  pathname: string;
  /** Collapsed rail (md and up): icons only, each parent opening its pages beside the rail. */
  rail?: boolean;
  onNavigate?: () => void;
}

/**
 * The brand and the navigation, shared by the desktop sidebar and the mobile drawer so the two can't drift. NavMenu
 * owns the padding, the scroll area and the brand block; the container only supplies the width.
 */
export function SidebarContent({ pathname, rail = false, onNavigate }: SidebarContentProps) {
  const { sections, onSelect } = useNavMenu(onNavigate);

  return (
    <NavMenu
      orientation="vertical"
      brand={{ logo: 'K', title: 'Koi Admin', subtitle: 'Koi 组件库演示' }}
      sections={sections}
      value={pathname}
      collapsed={rail}
      onSelect={onSelect}
    />
  );
}
