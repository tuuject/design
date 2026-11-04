# Slider

A single-thumb range control: a pill track with a sky fill and a round thumb.

**When to use:** a number picked from a range where the effect is immediate (volume, compression quality, opacity). For a few named choices use RadioGroup; for an exact number use Input.

**The consumer supplies:** `value`/`onValueChange` (or `defaultValue`), `min`/`max`/`step`, and optionally `label`, `showValue`, `formatValue`, `disabled`. `onValueCommitted` fires once a drag or key sequence ends, for work too heavy to run per pixel. Inside a Field it picks up the label, help, error and disabled state; without a label, give it an `aria-label`.

**Styling:**
- Track: 6px tall with `radius-full` corners and a `surface-muted` fill; the filled part is `control-checked`.
- Thumb: a 20px `surface` circle with a 2px `control-checked` edge and no shadow. The thumb is the control's height, so the 6px track sits centered in it.
- Head row: `label` (14px bold) on the left, the value in `small` `text-muted` with `tabular-nums` on the right. `showValue` adds the value; `formatValue` writes it ("80%") and is also the screen-reader text.
- Drag: the fill and thumb follow the pointer with no easing, so neither lags behind; colors still change over 150ms.
- Disabled: 50% opacity and a `not-allowed` cursor.
- Focus: the 2px `focus-ring` outline is drawn on the thumb, while the real focus target is the visually hidden range input inside it.
- Invalid (inside a Field with an error): the thumb edge turns `error-control`.

**Accessibility:** Base UI renders a visually hidden `<input type="range">` in the thumb, so arrow keys, Page Up/Down, Home/End and typing work. The label is wired to that input, and `formatValue` feeds `aria-valuetext`.
