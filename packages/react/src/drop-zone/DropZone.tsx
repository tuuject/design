import type { DropZoneOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { dropZone } from '@tuuject/koi-react/styled-system/recipes';
import { type ComponentPropsWithRef, type DragEvent, useId, useRef, useState } from 'react';
import { UploadIcon } from '../icons.js';
import { useStrings } from '../strings.js';

export interface DropZoneProps
  extends DropZoneOwnProps,
    Omit<ComponentPropsWithRef<'div'>, keyof DropZoneOwnProps | 'children' | 'onDrop'> {
  /** Called with the dropped or picked files; the input resets so the same file can be chosen again. */
  onFiles?: (files: File[]) => void;
}

/**
 * A dashed area that opens the platform picker on click, Space or Enter, and accepts files dropped on it.
 * Validation and processing stay in the app: this only collects files.
 */
export function DropZone({
  title,
  description,
  icon,
  accept,
  multiple = true,
  disabled = false,
  onFiles,
  className,
  ...rest
}: DropZoneProps) {
  const s = dropZone();
  const t = useStrings();
  const uid = useId();
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  // dragenter / dragleave also fire when crossing child elements; count them instead of flickering.
  const dragDepth = useRef(0);

  const emit = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    const list = Array.from(files);
    onFiles?.(multiple ? list : list.slice(0, 1));
  };

  const openPicker = () => {
    if (disabled) {
      return;
    }
    inputRef.current?.click();
  };

  // Always prevent the browser's own handling (opening the dropped file), even while disabled.
  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) {
      return;
    }
    dragDepth.current += 1;
    setDragging(true);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) {
      return;
    }
    e.dataTransfer.dropEffect = 'copy';
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) {
      return;
    }
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setDragging(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (disabled) {
      return;
    }
    emit(e.dataTransfer.files);
  };

  return (
    <div className={cx(s.root, className)} {...rest}>
      {/* A button element can't hold a heading and a description, so the zone is a div with the button role. */}
      {/* biome-ignore lint/a11y/useSemanticElements: the zone holds a heading and a description, which <button> may not. */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-labelledby={title != null ? titleId : undefined}
        aria-label={title == null ? t.dropZone : undefined}
        aria-describedby={description != null ? descriptionId : undefined}
        data-dragging={dragging || undefined}
        className={s.zone}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <span className={s.icon}>{icon ?? <UploadIcon />}</span>
        <div className={s.body}>
          <p id={titleId} className={s.title}>
            {title ?? t.dropZoneTitle}
          </p>
          {description != null ? (
            <p id={descriptionId} className={s.description}>
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        hidden
        onChange={(e) => {
          emit(e.currentTarget.files);
          // Let the same file be picked again after it was removed from the app's list.
          e.currentTarget.value = '';
        }}
      />
    </div>
  );
}
