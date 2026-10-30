import { SelectItem, SelectPanel } from '@koi/react/select-panel';
import { css } from '@koi/react/styled-system/css';
import { useSyncExternalStore } from 'react';
import { focusRing, TOPBAR_HEIGHT } from '../app-shell/shared';
import { STICKY_Z_INDEX, WIDE_TOP } from './context';
import { ChangedDot, InvalidMark } from './markers';
import type { FormOutline, SectionEntry } from './outline';

interface SectionNavProps {
  outline: FormOutline;
  sections: SectionEntry[];
  dirtySections: ReadonlySet<string | null>;
  invalidSections: ReadonlySet<string | null>;
}

function Marks({ id, dirtySections, invalidSections }: Omit<SectionNavProps, 'outline' | 'sections'> & { id: string }) {
  return (
    <>
      {invalidSections.has(id) ? <InvalidMark label="，有需要修正的内容" /> : null}
      {dirtySections.has(id) ? <ChangedDot label="，有未保存的更改" /> : null}
    </>
  );
}

/** Wide layout: the sticky list of sections beside the form. */
export function SectionNav({ outline, sections, ...marks }: SectionNavProps) {
  const active = useSyncExternalStore(outline.subscribe, outline.getActiveId);

  return (
    <nav
      aria-label="表单分区"
      className={css({
        display: 'none',
        '@container (min-width: 720px)': {
          display: 'block',
          position: 'sticky',
          top: WIDE_TOP,
          alignSelf: 'start',
          // Long section lists scroll on their own rather than run under the bottom of the screen.
          maxHeight: `calc(100dvh - ${WIDE_TOP} - 24px)`,
          overflowY: 'auto',
        },
      })}
    >
      <ul className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}>
        {sections.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              aria-current={section.id === active ? 'location' : undefined}
              className={css({
                // The template's sidebar items (NavMenu's vertical rules), plus room for the marks on the right.
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                width: '100%',
                minHeight: 'control-md',
                paddingInline: '3',
                borderRadius: 'xl',
                color: 'nav-item-text',
                textStyle: 'body',
                textAlign: 'left',
                cursor: 'pointer',
                transitionProperty: 'background-color, color',
                transitionDuration: 'fast',
                _hover: { bg: 'nav-item-hover' },
                _focusVisible: focusRing,
                '&[aria-current=location]': { bg: 'nav-item-active', color: 'text', fontWeight: 'bold' },
              })}
              onClick={() => outline.goToSection(section.id, { focus: true })}
            >
              <span className={css({ flex: '1', minWidth: '0' })}>{section.title}</span>
              <Marks id={section.id} {...marks} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Stacked layout: a sticky dropdown above the form that names the current section and jumps to any other. */
export function SectionMenu({ outline, sections, ...marks }: SectionNavProps) {
  const active = useSyncExternalStore(outline.subscribe, outline.getActiveId);
  const items = sections.map((s) => ({ value: s.id, label: s.title }));

  return (
    <div
      className={css({
        position: 'sticky',
        top: TOPBAR_HEIGHT,
        zIndex: STICKY_Z_INDEX,
        paddingBlock: '2',
        // Sections scroll under it.
        bg: 'page-bg',
        '@container (min-width: 720px)': { display: 'none' },
      })}
    >
      <SelectPanel
        aria-label="跳转到分区"
        items={items}
        value={active}
        onChange={(id) => {
          if (id) {
            outline.goToSection(id);
          }
        }}
        renderValue={(item) => (
          <span className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
            {item.label}
            <Marks id={item.value} {...marks} />
          </span>
        )}
      >
        {(entries) =>
          entries.map((item) => (
            <SelectItem key={item.value} value={item.value} label={item.label}>
              <span className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
                {item.label}
                <Marks id={item.value} {...marks} />
              </span>
            </SelectItem>
          ))
        }
      </SelectPanel>
    </div>
  );
}
