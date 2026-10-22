# Select

A native dropdown styled like Input, with a chevron.

**When to use:** picking one option from a short list (up to about 15 items) when the options don't need to be visible at once. For 2–5 options that should stay visible, use a RadioGroup. For grouped or rich options, or a search box, use SelectPanel.

**The consumer supplies:** either `options` (`{value, label, disabled?}`) or `<option>` children (`<optgroup>` too), plus `value`/`onChange` or `defaultValue`. Optionally `placeholder` (a disabled first option shown until the user picks), `size` and `invalid`.

**Styling:** identical to Input. The chevron is drawn in `text-muted`. It stays a native `<select>`, so it opens the platform picker on phones and is fully keyboard accessible.
