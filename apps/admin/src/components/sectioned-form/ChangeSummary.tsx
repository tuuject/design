import { Menu } from '@base-ui/react/menu';
import { Button } from '@koi/react/button';
import { ChevronUpIcon } from '@koi/react/icons';
import { css } from '@koi/react/styled-system/css';
import { components, sizes } from '@koi/tokens/dimensions';
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
 * jump to that exact field. Base UI's Menu directly, styled like the user menu (SelectPanel's panel), which gives
 * arrow keys, type-to-find and Esc. Labels only: a changed value, a password say, is never shown.
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
    // Not modal: a modal menu locks page scrolling, and picking an entry starts a scroll while the menu fades out.
    <Menu.Root modal={false}>
      <Menu.Trigger
        render={
          <Button
            variant="ghost"
            color="secondary"
            iconStart={<ChangedDot />}
            iconEnd={<ChevronUpIcon size={sizes['icon-sm']} />}
          />
        }
      >
        <span className={css({ display: 'none', '@container (min-width: 720px)': { display: 'inline' } })}>
          {dirty.length} 项未保存的更改
        </span>
        <span className={css({ '@container (min-width: 720px)': { display: 'none' } })}>{dirty.length} 项更改</span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          side="top"
          align="start"
          sideOffset={components.popup.offset}
          className={css({ zIndex: 'popup', outline: 'none' })}
        >
          <Menu.Popup
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
            className={css({
              display: 'flex',
              flexDirection: 'column',
              width: '320px',
              maxWidth: 'calc(100vw - 32px)',
              maxHeight: 'min(420px, var(--available-height))',
              bg: 'surface',
              border: '1px solid {colors.border}',
              borderRadius: 'xl',
              boxShadow: 'float',
              outline: 'none',
              transformOrigin: 'var(--transform-origin)',
              transition:
                'opacity token(durations.fast) token(easings.out), transform token(durations.check) token(easings.spring)',
              '&[data-starting-style], &[data-ending-style]': { opacity: '0', transform: 'scale(.96)' },
            })}
          >
            <div
              className={css({
                flex: 'none',
                paddingInline: '4',
                paddingBlock: '3',
                borderBottom: '1px solid {colors.divider}',
                textStyle: 'body',
                fontWeight: 'bold',
                color: 'text',
              })}
            >
              未保存的更改（{dirty.length}）
            </div>
            <div className={css({ flex: '1', minHeight: '0', overflowY: 'auto', padding: '1' })}>
              {groups.map((group) => (
                <Menu.Group key={group.key}>
                  <Menu.GroupLabel
                    className={css({
                      // SelectPanel's group labels.
                      display: 'block',
                      paddingInline: '3',
                      paddingBlockStart: '2',
                      paddingBlockEnd: '1',
                      textStyle: 'small',
                      color: 'text-muted',
                      userSelect: 'none',
                    })}
                  >
                    {group.title}
                  </Menu.GroupLabel>
                  {group.items.map((mark) => (
                    <Menu.Item
                      key={mark.name}
                      label={mark.label}
                      className={css({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2',
                        minHeight: 'control-md',
                        paddingInline: '3',
                        borderRadius: 'lg',
                        color: 'text',
                        textStyle: 'body',
                        cursor: 'pointer',
                        outline: 'none',
                        userSelect: 'none',
                        transitionProperty: 'background-color',
                        transitionDuration: 'fast',
                        '&[data-highlighted]': { bg: 'surface-muted' },
                      })}
                      onClick={(event) => {
                        const el = outline.revealField(mark.name);
                        target.current = el ? { el, touch: isTouch(event) } : null;
                      }}
                    >
                      <span className={css({ flex: '1', minWidth: '0' })}>{mark.label}</span>
                      <span
                        className={css({
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2',
                          flex: 'none',
                          color: 'text-muted',
                        })}
                      >
                        {invalidNames.has(mark.name) ? (
                          <span
                            className={css({ display: 'flex', alignItems: 'center', gap: '1', color: 'error-text' })}
                          >
                            <InvalidMark />
                            需修正
                          </span>
                        ) : null}
                        {mark.mounted ? null : <span>已隐藏</span>}
                        <ChangedDot />
                        已修改
                      </span>
                    </Menu.Item>
                  ))}
                </Menu.Group>
              ))}
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
