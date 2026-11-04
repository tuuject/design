import { Button } from '@tuuject/koi-react/button';
import { ChevronUpIcon } from '@tuuject/koi-react/icons';
import { Menu } from '@tuuject/koi-react/menu';
import { css } from '@tuuject/koi-react/styled-system/css';
import { sizes } from '@tuuject/koi-tokens/dimensions';
import { useRef } from 'react';
import type { FieldMark } from './changes';
import { ChangedDot, InvalidMark } from './markers';
import { type FormOutline, isTouch, type SectionEntry } from './outline';

interface ChangeSummaryProps {
  outline: FormOutline;
  sections: SectionEntry[];
  dirty: FieldMark[];
  invalidNames: ReadonlySet<string>;
}

/**
 * The action bar's "N 项未保存的更改" button and the list it opens: every changed field by section, each one a
 * jump to that exact field. Koi's Menu gives arrow keys, type-to-find and Esc; the panel is the same one the user
 * menu and the nav flyouts use. Labels only: a changed value, a password say, is never shown.
 */
export function ChangeSummary({ outline, sections, dirty, invalidNames }: ChangeSummaryProps) {
  // The field picked from the list, focused once the menu has closed (see finalFocus). Whether it was tapped is
  // read off the click itself: Base UI's close type doesn't report touch for an item press.
  const target = useRef<{ el: HTMLElement; touch: boolean } | null>(null);
  const groups = [
    ...sections.map((section) => ({
      key: section.id,
      title: section.title,
      items: dirty.filter((d) => d.sectionId === section.id),
    })),
    { key: '', title: '其他', items: dirty.filter((d) => d.sectionId === null) },
  ].filter((g) => g.items.length > 0);

  return (
    <Menu
      // Not modal: a modal menu locks page scrolling, and picking an entry starts a scroll while the menu fades out.
      modal={false}
      placement="top-start"
      // Narrower than a menu's default on a phone, where 320px plus the trigger's inset would overflow.
      className={css({ width: '320px', maxWidth: 'calc(100vw - 32px)' })}
      finalFocus={() => {
        const picked = target.current;
        target.current = null;
        if (!picked) {
          return true;
        }
        if (picked.touch) {
          // The wrapper, not the input: no on-screen keyboard popping up mid-scroll.
          picked.el.focus({ preventScroll: true });
          return false;
        }
        // Base UI focuses the first tabbable control inside, without scrolling.
        return picked.el;
      }}
      trigger={
        <Button
          variant="ghost"
          color="secondary"
          iconStart={<ChangedDot />}
          iconEnd={<ChevronUpIcon size={sizes['icon-sm']} />}
        >
          <span className={css({ display: 'none', '@container (min-width: 720px)': { display: 'inline' } })}>
            {dirty.length} 项未保存的更改
          </span>
          <span className={css({ '@container (min-width: 720px)': { display: 'none' } })}>{dirty.length} 项更改</span>
        </Button>
      }
      header={<span className={css({ fontWeight: 'bold' })}>未保存的更改（{dirty.length}）</span>}
      items={groups.map((group) => ({
        label: group.title,
        items: group.items.map((mark) => ({
          value: mark.name,
          label: mark.label,
          endContent: (
            <>
              {invalidNames.has(mark.name) ? (
                <span className={css({ display: 'flex', alignItems: 'center', gap: '1', color: 'error-text' })}>
                  <InvalidMark />
                  需修正
                </span>
              ) : null}
              {mark.mounted ? null : <span>已隐藏</span>}
              <span className={css({ display: 'flex', alignItems: 'center', gap: '1' })}>
                <ChangedDot />
                已修改
              </span>
            </>
          ),
        })),
      }))}
      onSelect={(value, _item, details) => {
        const el = outline.revealField(value);
        // The menu's change details carry the DOM event; isTouch reads a React one.
        target.current = el ? { el, touch: isTouch({ nativeEvent: details.event }) } : null;
      }}
    />
  );
}
