import { Button } from '@koi/react/button';
import { Dialog } from '@koi/react/dialog';
import { ErrorIcon, SuccessIcon } from '@koi/react/icons';
import { css, cx } from '@koi/react/styled-system/css';
import { sizes } from '@koi/tokens/dimensions';
import { useState } from 'react';
import { ChangeSummary } from './ChangeSummary';
import type { FieldMark } from './changes';
import { STICKY_Z_INDEX } from './context';
import { type FormOutline, isTouch, type SectionEntry } from './outline';

interface FormActionBarProps {
  outline: FormOutline;
  sections: SectionEntry[];
  dirty: FieldMark[];
  invalid: FieldMark[];
  submitting: boolean;
  /** The last save went through and nothing has changed since. */
  saved: boolean;
  /** Why the last save failed; the edits are still in the form. */
  submitError: string | undefined;
  disabled: boolean;
  submitLabel: string;
  /** Null hides 「放弃更改」. */
  onDiscard: (() => void) | null;
}

const statusLine = css({ display: 'flex', alignItems: 'center', gap: '2', paddingInline: '4', textStyle: 'body' });

/**
 * The bar at the bottom of a SectionedForm: what's unsaved, what needs fixing, how the last save went, and the
 * buttons. Sticky, not fixed: it floats over the sections while they scroll, and at the end of the form it settles
 * into its own space below the last one, so nothing stays hidden under it.
 */
export function FormActionBar({
  outline,
  sections,
  dirty,
  invalid,
  submitting,
  saved,
  submitError,
  disabled,
  submitLabel,
  onDiscard,
}: FormActionBarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Frozen when the dialog opens: the count drops to 0 on discard while the dialog is still fading out.
  const [discardCount, setDiscardCount] = useState(0);
  const invalidNames = new Set(invalid.map((m) => m.name));

  return (
    <div
      className={css({
        position: 'sticky',
        bottom: 'calc(token(spacing.4) + env(safe-area-inset-bottom, 0px))',
        zIndex: STICKY_Z_INDEX,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '2',
        marginBlockStart: '6',
        // 16px around md buttons (radius 8) under a 24px corner: concentric.
        padding: '4',
        borderRadius: 'panel',
        // Floating chrome, like a Toast: no border, the shadow lifts it.
        bg: 'surface-glass-tint',
        backdropFilter: 'blur(var(--blurs-float))',
        boxShadow: 'float',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '2',
          flex: '1 1 auto',
          minWidth: '0',
        })}
      >
        {dirty.length > 0 ? (
          <ChangeSummary outline={outline} sections={sections} dirty={dirty} invalidNames={invalidNames} />
        ) : saved ? null : (
          // Inset like the ghost button's label that replaces it, so the text doesn't jump.
          <span className={css({ paddingInline: '4', textStyle: 'body', color: 'text-muted' })}>没有未保存的更改</span>
        )}
        {invalid.length > 0 ? (
          <Button
            variant="ghost"
            color="error"
            iconStart={<ErrorIcon />}
            onClick={(event) => outline.goToField(invalid[0].name, { touch: isTouch(event) })}
          >
            {invalid.length} 项需修正
          </Button>
        ) : null}
        {/* Always mounted, so screen readers announce the outcome when it appears. */}
        <span role="status" className={css({ minWidth: '0' })}>
          {submitError ? (
            <span className={cx(statusLine, css({ color: 'error-fg' }))}>
              <ErrorIcon size={sizes['icon-sm']} className={css({ flex: 'none' })} />
              保存失败：{submitError}，修改已保留
            </span>
          ) : saved ? (
            <span className={cx(statusLine, css({ color: 'text-muted' }))}>
              <SuccessIcon size={sizes['icon-sm']} className={css({ flex: 'none', color: 'text-brand' })} />
              所有更改已保存
            </span>
          ) : null}
        </span>
      </div>
      <div className={css({ display: 'flex', gap: '2', marginInlineStart: 'auto' })}>
        {onDiscard && dirty.length > 0 ? (
          <Button
            variant="ghost"
            color="secondary"
            disabled={submitting || disabled}
            onClick={() => {
              setDiscardCount(dirty.length);
              setConfirmOpen(true);
            }}
          >
            放弃更改
          </Button>
        ) : null}
        <Button type="submit" loading={submitting} disabled={dirty.length === 0 || disabled}>
          {submitLabel}
        </Button>
      </div>
      <Dialog
        role="alertdialog"
        hideClose
        size="sm"
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="放弃未保存的更改？"
        description={`${discardCount} 项更改会恢复成上次保存的内容，此操作不可撤销。`}
        footer={
          <>
            <Button variant="ghost" color="secondary" onClick={() => setConfirmOpen(false)}>
              取消
            </Button>
            <Button
              color="error"
              onClick={() => {
                onDiscard?.();
                setConfirmOpen(false);
              }}
            >
              放弃更改
            </Button>
          </>
        }
      />
    </div>
  );
}
