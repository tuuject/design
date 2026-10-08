/* @ds-bundle: {"format":4,"namespace":"Koi","components":[{"name":"Button"},{"name":"IconButton"},{"name":"Link"},{"name":"Input"},{"name":"Textarea"},{"name":"Select"},{"name":"Checkbox"},{"name":"RadioGroup"},{"name":"Switch"},{"name":"Field"},{"name":"Alert"},{"name":"Badge"},{"name":"Tag"},{"name":"Toast"},{"name":"Progress"},{"name":"Spinner"},{"name":"Skeleton"},{"name":"Card"},{"name":"Tabs"},{"name":"Dialog"},{"name":"Tooltip"},{"name":"Avatar"},{"name":"Pagination"},{"name":"Divider"},{"name":"NavMenu"}]} */
(function () {
  "use strict";
  var React = window.React, ReactDOM = window.ReactDOM;
  var h = React.createElement, useState = React.useState, useEffect = React.useEffect,
      useRef = React.useRef, useId = React.useId, useCallback = React.useCallback,
      useContext = React.useContext, createContext = React.createContext;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(" ");
  }
  function omit(obj, keys) {
    var o = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) < 0) o[k] = obj[k];
    return o;
  }
  /* Controlled-or-uncontrolled state. */
  function useControlled(value, defaultValue) {
    var s = useState(defaultValue);
    var isControlled = value !== undefined;
    return [isControlled ? value : s[0], function (v) { if (!isControlled) s[1](v); }];
  }

  /* ---------- Icons (inline SVG, currentColor) ---------- */
  function svg(paths, size, extra) {
    return h("svg", Object.assign({ width: size || 20, height: size || 20, viewBox: "0 0 24 24", fill: "none",
      stroke: "currentColor", strokeWidth: 2.25, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true",
      focusable: "false" }, extra || {}), paths);
  }
  var Icons = {
    check: function (s) { return svg(h("path", { d: "M5 12.5l4.5 4.5L19 7.5" }), s); },
    close: function (s) { return svg([h("path", { key: 1, d: "M6 6l12 12" }), h("path", { key: 2, d: "M18 6L6 18" })], s); },
    chevronDown: function (s) { return svg(h("path", { d: "M6 9l6 6 6-6" }), s); },
    chevronLeft: function (s) { return svg(h("path", { d: "M15 6l-6 6 6 6" }), s); },
    chevronRight: function (s) { return svg(h("path", { d: "M9 6l6 6-6 6" }), s); },
    info: function (s) { return svg([h("circle", { key: 1, cx: 12, cy: 12, r: 9 }), h("path", { key: 2, d: "M12 11v5" }), h("path", { key: 3, d: "M12 7.5h.01" })], s); },
    warning: function (s) { return svg([h("path", { key: 1, d: "M10.3 4.3L2.8 17.5A2 2 0 004.5 20.5h15a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z" }), h("path", { key: 2, d: "M12 9.5v4" }), h("path", { key: 3, d: "M12 17h.01" })], s); },
    error: function (s) { return svg([h("circle", { key: 1, cx: 12, cy: 12, r: 9 }), h("path", { key: 2, d: "M15 9l-6 6" }), h("path", { key: 3, d: "M9 9l6 6" })], s); },
    success: function (s) { return svg([h("circle", { key: 1, cx: 12, cy: 12, r: 9 }), h("path", { key: 2, d: "M8 12.5l2.5 2.5L16 9.5" })], s); },
    external: function (s) { return svg([h("path", { key: 1, d: "M14 5h5v5" }), h("path", { key: 2, d: "M19 5l-8 8" }), h("path", { key: 3, d: "M18 14v4a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1h4" })], s); }
  };
  var toneIcon = { info: Icons.info, warning: Icons.warning, error: Icons.error, success: Icons.success };

  /* ---------- Spinner ---------- */
  function Spinner(props) {
    var size = props.size || "md";
    var px = { sm: 16, md: 20, lg: 32 }[size] || 20;
    return h("span", { className: cx("koi-spinner", props.className), role: "status", "aria-label": props.label || "加载中" },
      h("svg", { width: px, height: px, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
        h("circle", { cx: 12, cy: 12, r: 9, stroke: "currentColor", strokeOpacity: 0.25, strokeWidth: 3 }),
        h("path", { d: "M21 12a9 9 0 00-9-9", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round" })));
  }

  /* ---------- Skeleton ---------- */
  /* Only the fill and the shimmer. Width, height, radius and layout come from the consumer's own class or style. */
  function Skeleton(props) {
    var rest = omit(props, ["as", "className", "children"]);
    return h(props.as || "div", Object.assign({ "aria-hidden": "true" }, rest, { className: cx("koi-skeleton", props.className) }), props.children);
  }

  /* ---------- Button color × variant ---------- */
  var BTN_COLORS = ["primary", "accent", "secondary", "warning", "error"];
  var BTN_VARIANTS = ["solid", "soft", "outline", "ghost"];
  /* Earlier variant names, still accepted: primary → solid, secondary → soft, danger → solid error. */
  var BTN_LEGACY = { primary: ["primary", "solid"], secondary: ["primary", "soft"], danger: ["error", "solid"] };
  function btnLook(props, defColor, defVariant) {
    var color = props.color, variant = props.variant, legacy = BTN_LEGACY[variant];
    if (legacy) { variant = legacy[1]; if (!color) color = legacy[0]; }
    if (BTN_COLORS.indexOf(color) < 0) color = defColor;
    if (BTN_VARIANTS.indexOf(variant) < 0) variant = defVariant;
    return "koi-btn--c-" + color + " koi-btn--v-" + variant;
  }

  /* ---------- Button ---------- */
  /* Default button shape for a surface; Dialog's footer sets "rounded". An explicit `shape` prop always wins. */
  var ShapeContext = createContext(null);
  var Button = React.forwardRef(function Button(props, ref) {
    var look = btnLook(props, "primary", "solid"), size = props.size || "md", ctxShape = useContext(ShapeContext), shape = props.shape || ctxShape;
    var rest = omit(props, ["color", "variant", "size", "shape", "loading", "iconStart", "iconEnd", "fullWidth", "className", "children", "href", "disabled"]);
    var disabled = props.disabled || props.loading;
    var cls = cx("koi-btn", look, "koi-btn--" + size, shape === "rounded" && "koi-btn--rounded", props.fullWidth && "koi-btn--full", props.loading && "is-loading", props.className);
    var inner = [
      props.loading ? h(Spinner, { key: "s", size: size === "lg" ? "md" : "sm", label: "处理中" }) : props.iconStart ? h("span", { key: "a", className: "koi-btn__icon" }, props.iconStart) : null,
      h("span", { key: "l", className: "koi-btn__label" }, props.children),
      props.iconEnd ? h("span", { key: "b", className: "koi-btn__icon" }, props.iconEnd) : null
    ];
    if (props.href && !disabled) return h("a", Object.assign({ ref: ref, href: props.href, className: cls }, rest), inner);
    return h("button", Object.assign({ ref: ref, type: "button", className: cls, disabled: disabled, "aria-busy": props.loading || undefined }, rest), inner);
  });

  /* ---------- IconButton ---------- */
  var IconButton = React.forwardRef(function IconButton(props, ref) {
    var look = btnLook(props, "secondary", "ghost"), size = props.size || "md", ctxShape = useContext(ShapeContext), shape = props.shape || ctxShape;
    var rest = omit(props, ["color", "variant", "size", "shape", "label", "icon", "className", "children"]);
    return h("button", Object.assign({ ref: ref, type: "button", "aria-label": props.label, title: props.label,
      className: cx("koi-iconbtn", look, "koi-iconbtn--" + size, shape === "rounded" && "koi-btn--rounded", props.className) }, rest), props.icon || props.children);
  });

  /* ---------- Link ---------- */
  function Link(props) {
    var rest = omit(props, ["external", "className", "children"]);
    var ext = props.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return h("a", Object.assign({ className: cx("koi-link", props.className) }, ext, rest), props.children,
      props.external ? h("span", { className: "koi-link__ext" }, Icons.external(14), h("span", { className: "koi-sr" }, "（在新窗口打开）")) : null);
  }

  /* ---------- Field context ---------- */
  var FieldContext = createContext(null);
  function useField(props) {
    var f = useContext(FieldContext) || {};
    return {
      id: props.id || f.id,
      invalid: props.invalid != null ? props.invalid : f.invalid,
      describedBy: cx(props["aria-describedby"], f.describedBy) || undefined,
      required: props.required != null ? props.required : f.required
    };
  }

  /* ---------- Input ---------- */
  var Input = React.forwardRef(function Input(props, ref) {
    var f = useField(props), size = props.size || "md";
    var rest = omit(props, ["size", "invalid", "iconStart", "iconEnd", "className", "id", "aria-describedby", "required"]);
    return h("span", { className: cx("koi-input", "koi-input--" + size, f.invalid && "is-invalid", props.disabled && "is-disabled", props.className) },
      props.iconStart ? h("span", { className: "koi-input__icon" }, props.iconStart) : null,
      h("input", Object.assign({ ref: ref, id: f.id, className: "koi-input__el", "aria-invalid": f.invalid || undefined,
        "aria-describedby": f.describedBy, required: f.required }, rest)),
      props.iconEnd ? h("span", { className: "koi-input__icon" }, props.iconEnd) : null);
  });

  /* ---------- Textarea ---------- */
  var Textarea = React.forwardRef(function Textarea(props, ref) {
    var f = useField(props);
    var rest = omit(props, ["invalid", "className", "id", "aria-describedby", "required"]);
    return h("textarea", Object.assign({ ref: ref, id: f.id, rows: 4, className: cx("koi-textarea", f.invalid && "is-invalid", props.className),
      "aria-invalid": f.invalid || undefined, "aria-describedby": f.describedBy, required: f.required }, rest));
  });

  /* ---------- Select ---------- */
  var Select = React.forwardRef(function Select(props, ref) {
    var f = useField(props), size = props.size || "md";
    var rest = omit(props, ["size", "invalid", "options", "placeholder", "className", "children", "id", "aria-describedby", "required"]);
    var opts = (props.options || []).map(function (o) {
      return h("option", { key: o.value, value: o.value, disabled: o.disabled }, o.label);
    });
    if (props.placeholder) opts.unshift(h("option", { key: "__ph", value: "", disabled: true }, props.placeholder));
    if (props.placeholder && props.value === undefined && props.defaultValue === undefined) rest.defaultValue = "";
    return h("span", { className: cx("koi-select", "koi-input--" + size, f.invalid && "is-invalid", props.disabled && "is-disabled", props.className) },
      h("select", Object.assign({ ref: ref, id: f.id, className: "koi-select__el", "aria-invalid": f.invalid || undefined,
        "aria-describedby": f.describedBy, required: f.required }, rest), props.children || opts),
      h("span", { className: "koi-select__chevron" }, Icons.chevronDown(18)));
  });

  /* ---------- Checkbox ---------- */
  var Checkbox = React.forwardRef(function Checkbox(props, ref) {
    var autoId = useId(), id = props.id || autoId;
    var rest = omit(props, ["label", "description", "className", "id", "onChange", "onCheckedChange"]);
    var descId = props.description ? id + "-d" : undefined;
    return h("label", { className: cx("koi-check", props.disabled && "is-disabled", props.className), htmlFor: id },
      h("span", { className: "koi-check__box" },
        h("input", Object.assign({ ref: ref, id: id, type: "checkbox", className: "koi-check__input", "aria-describedby": descId,
          onChange: function (e) { if (props.onChange) props.onChange(e); if (props.onCheckedChange) props.onCheckedChange(e.target.checked); } }, rest)),
        h("span", { className: "koi-check__mark" }, Icons.check(14))),
      props.label != null ? h("span", { className: "koi-check__text" },
        h("span", { className: "koi-check__label" }, props.label),
        props.description ? h("span", { id: descId, className: "koi-check__desc" }, props.description) : null) : null);
  });

  /* ---------- RadioGroup ---------- */
  function RadioGroup(props) {
    var autoName = useId(), name = props.name || autoName;
    var st = useControlled(props.value, props.defaultValue);
    return h("div", { role: "radiogroup", "aria-label": props.label, className: cx("koi-radios", props.orientation === "horizontal" && "koi-radios--row", props.className) },
      (props.options || []).map(function (o) {
        var id = name + "-" + o.value, descId = o.description ? id + "-d" : undefined;
        return h("label", { key: o.value, htmlFor: id, className: cx("koi-check", "koi-radio", (o.disabled || props.disabled) && "is-disabled") },
          h("span", { className: "koi-check__box koi-radio__box" },
            h("input", { id: id, type: "radio", name: name, value: o.value, className: "koi-check__input", checked: st[0] === o.value,
              disabled: o.disabled || props.disabled, "aria-describedby": descId,
              onChange: function () { st[1](o.value); if (props.onChange) props.onChange(o.value); } }),
            h("span", { className: "koi-radio__dot" })),
          h("span", { className: "koi-check__text" },
            h("span", { className: "koi-check__label" }, o.label),
            o.description ? h("span", { id: descId, className: "koi-check__desc" }, o.description) : null));
      }));
  }

  /* ---------- Switch ---------- */
  function Switch(props) {
    var autoId = useId(), id = props.id || autoId;
    var st = useControlled(props.checked, !!props.defaultChecked);
    return h("label", { className: cx("koi-switch", props.disabled && "is-disabled", props.className), htmlFor: id },
      h("button", { id: id, type: "button", role: "switch", "aria-checked": !!st[0], disabled: props.disabled,
        className: cx("koi-switch__track", st[0] && "is-on"),
        onClick: function () { var v = !st[0]; st[1](v); if (props.onCheckedChange) props.onCheckedChange(v); } },
        h("span", { className: "koi-switch__thumb" })),
      props.label != null ? h("span", { className: "koi-check__label" }, props.label) : null);
  }

  /* ---------- Field ---------- */
  function Field(props) {
    var autoId = useId(), id = props.id || autoId;
    var helpId = props.help ? id + "-help" : null, errId = props.error ? id + "-err" : null;
    var ctx = { id: id, invalid: !!props.error, describedBy: cx(errId, helpId) || undefined, required: props.required };
    return h(FieldContext.Provider, { value: ctx },
      h("div", { className: cx("koi-field", props.className) },
        props.label != null ? h("label", { className: "koi-field__label", htmlFor: id }, props.label,
          props.required ? h("span", { className: "koi-field__req", "aria-hidden": "true" }, " *") : null,
          props.optional ? h("span", { className: "koi-field__opt" }, "（选填）") : null) : null,
        props.children,
        props.error ? h("p", { id: errId, className: "koi-field__error" }, Icons.error(16), h("span", null, props.error)) : null,
        props.help ? h("p", { id: helpId, className: "koi-field__help" }, props.help) : null));
  }

  /* ---------- Alert ---------- */
  function Alert(props) {
    var tone = props.tone || "info";
    var icon = props.icon !== undefined ? props.icon : (toneIcon[tone] || Icons.info)(20);
    return h("div", { role: tone === "error" || tone === "warning" ? "alert" : "status", className: cx("koi-alert", "koi-alert--" + tone, props.className) },
      icon ? h("span", { className: "koi-alert__icon" }, icon) : null,
      h("div", { className: "koi-alert__body" },
        props.title ? h("p", { className: "koi-alert__title" }, props.title) : null,
        props.children ? h("div", { className: "koi-alert__text" }, props.children) : null,
        props.action ? h("div", { className: "koi-alert__action" }, props.action) : null),
      props.onClose ? h("button", { type: "button", className: "koi-alert__close", "aria-label": "关闭", onClick: props.onClose }, Icons.close(16)) : null);
  }

  /* ---------- Badge ---------- */
  function Badge(props) {
    return h("span", { className: cx("koi-badge", "koi-badge--" + (props.tone || "neutral"), props.className) },
      props.dot ? h("span", { className: "koi-badge__dot", "aria-hidden": "true" }) : null, props.children);
  }

  /* ---------- Tag ---------- */
  function Tag(props) {
    return h("span", { className: cx("koi-tag", props.selected && "is-selected", props.className) },
      props.icon ? h("span", { className: "koi-tag__icon" }, props.icon) : null,
      h("span", null, props.children),
      props.onRemove ? h("button", { type: "button", className: "koi-tag__remove", onClick: props.onRemove,
        "aria-label": "移除 " + (typeof props.children === "string" ? props.children : "") }, Icons.close(14)) : null);
  }

  /* ---------- Toast ---------- */
  function Toast(props) {
    var tone = props.tone || "info";
    return h("div", { role: tone === "error" ? "alert" : "status", className: cx("koi-toast", "koi-toast--" + tone, props.className) },
      h("span", { className: "koi-toast__icon" }, (toneIcon[tone] || Icons.info)(20)),
      h("div", { className: "koi-toast__body" },
        props.title ? h("p", { className: "koi-toast__title" }, props.title) : null,
        props.description ? h("p", { className: "koi-toast__desc" }, props.description) : null),
      props.action || null,
      props.onClose ? h("button", { type: "button", className: "koi-alert__close", "aria-label": "关闭", onClick: props.onClose }, Icons.close(16)) : null);
  }
  var ToastContext = createContext(null);
  function ToastProvider(props) {
    var s = useState([]), list = s[0], setList = s[1], seq = useRef(0);
    var dismiss = useCallback(function (id) { setList(function (l) { return l.filter(function (t) { return t.id !== id; }); }); }, []);
    var toast = useCallback(function (t) {
      var id = ++seq.current;
      setList(function (l) { return l.concat([Object.assign({ id: id }, t)]).slice(-4); });
      var ms = t.duration === undefined ? 4000 : t.duration;
      if (ms) setTimeout(function () { dismiss(id); }, ms);
      return id;
    }, [dismiss]);
    return h(ToastContext.Provider, { value: { toast: toast, dismiss: dismiss } }, props.children,
      h("div", { className: cx("koi-toaster", props.position === "top" && "koi-toaster--top") },
        list.map(function (t) {
          return h(Toast, { key: t.id, tone: t.tone, title: t.title, description: t.description, action: t.action, onClose: function () { dismiss(t.id); } });
        })));
  }
  function useToast() {
    var c = useContext(ToastContext);
    if (!c) throw new Error("useToast must be used inside <ToastProvider>");
    return c;
  }

  /* ---------- Progress ---------- */
  function Progress(props) {
    var max = props.max || 100, v = props.value;
    var indeterminate = v == null;
    var pct = indeterminate ? 0 : Math.max(0, Math.min(100, (v / max) * 100));
    return h("div", { className: cx("koi-progress", "koi-progress--" + (props.size || "md"), props.className) },
      props.label ? h("div", { className: "koi-progress__head" }, h("span", null, props.label),
        !indeterminate && props.showValue ? h("span", { className: "koi-progress__value" }, Math.round(pct) + "%") : null) : null,
      h("div", { className: cx("koi-progress__track", indeterminate && "is-indeterminate"), role: "progressbar", "aria-label": props.label || "进度",
        "aria-valuemin": 0, "aria-valuemax": max, "aria-valuenow": indeterminate ? undefined : v },
        h("div", { className: "koi-progress__bar", style: indeterminate ? null : { width: pct + "%" } })));
  }

  /* ---------- Card ---------- */
  function Card(props) {
    var rest = omit(props, ["variant", "title", "description", "footer", "media", "className", "children", "padding"]);
    return h("div", Object.assign({ className: cx("koi-card", "koi-card--" + (props.variant || "outlined"), props.padding === "none" && "koi-card--flush", props.className) }, rest),
      props.media ? h("div", { className: "koi-card__media" }, props.media) : null,
      props.title || props.description ? h("div", { className: "koi-card__head" },
        props.title ? h("h3", { className: "koi-card__title" }, props.title) : null,
        props.description ? h("p", { className: "koi-card__desc" }, props.description) : null) : null,
      props.children != null ? h("div", { className: "koi-card__body" }, props.children) : null,
      props.footer ? h("div", { className: "koi-card__foot" }, props.footer) : null);
  }

  /* ---------- Tabs ---------- */
  function Tabs(props) {
    var items = props.items || [], base = useId();
    var st = useControlled(props.value, props.defaultValue !== undefined ? props.defaultValue : (items[0] && items[0].value));
    var refs = useRef({});
    function select(v) { st[1](v); if (props.onChange) props.onChange(v); }
    function onKey(e) {
      var enabled = items.filter(function (i) { return !i.disabled; });
      var idx = enabled.findIndex(function (i) { return i.value === st[0]; }), next = null;
      if (e.key === "ArrowRight") next = enabled[(idx + 1) % enabled.length];
      else if (e.key === "ArrowLeft") next = enabled[(idx - 1 + enabled.length) % enabled.length];
      else if (e.key === "Home") next = enabled[0];
      else if (e.key === "End") next = enabled[enabled.length - 1];
      if (next) { e.preventDefault(); select(next.value); var el = refs.current[next.value]; if (el) el.focus(); }
    }
    var active = items.find(function (i) { return i.value === st[0]; });
    return h("div", { className: cx("koi-tabs", props.fullWidth && "koi-tabs--full", props.className) },
      h("div", { role: "tablist", "aria-label": props.label, className: "koi-tabs__list", onKeyDown: onKey },
        items.map(function (i) {
          var sel = i.value === st[0];
          return h("button", { key: i.value, ref: function (el) { refs.current[i.value] = el; }, type: "button", role: "tab",
            id: base + "-t-" + i.value, "aria-selected": sel, "aria-controls": base + "-p-" + i.value, tabIndex: sel ? 0 : -1,
            disabled: i.disabled, className: cx("koi-tabs__tab", sel && "is-active"), onClick: function () { select(i.value); } }, i.label);
        })),
      active && active.content != null ? h("div", { role: "tabpanel", id: base + "-p-" + active.value, "aria-labelledby": base + "-t-" + active.value,
        tabIndex: 0, className: "koi-tabs__panel" }, active.content) : null);
  }

  /* ---------- Dialog ---------- */
  function Dialog(props) {
    var panel = useRef(null), titleId = useId(), descId = useId();
    var onClose = props.onClose;
    useEffect(function () {
      if (!props.open) return;
      var prev = document.activeElement;
      var el = panel.current;
      if (el) {
        var first = el.querySelector("[data-autofocus], input, select, textarea, button:not(.koi-dialog__close)");
        (first || el).focus();
      }
      function onKey(e) {
        if (e.key === "Escape" && onClose) onClose();
        if (e.key === "Tab" && el) {
          var f = el.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex='-1'])");
          if (!f.length) return;
          var a = f[0], z = f[f.length - 1];
          if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
          else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
        }
      }
      document.addEventListener("keydown", onKey);
      return function () { document.removeEventListener("keydown", onKey); if (prev && prev.focus) prev.focus(); };
    }, [props.open, onClose]);
    if (!props.open) return null;
    var node = h("div", { className: "koi-dialog", onMouseDown: function (e) { if (e.target === e.currentTarget && onClose && props.dismissible !== false) onClose(); } },
      h("div", { ref: panel, role: props.role || "dialog", "aria-modal": "true", "aria-labelledby": props.title ? titleId : undefined,
        "aria-describedby": props.description ? descId : undefined, tabIndex: -1,
        className: cx("koi-dialog__panel", "koi-dialog__panel--" + (props.size || "md"), props.className) },
        props.title ? h("h2", { id: titleId, className: "koi-dialog__title" }, props.title) : null,
        props.description ? h("p", { id: descId, className: "koi-dialog__desc" }, props.description) : null,
        props.children != null ? h("div", { className: "koi-dialog__body" }, props.children) : null,
        props.footer ? h(ShapeContext.Provider, { value: "rounded" }, h("div", { className: "koi-dialog__foot" }, props.footer)) : null,
        onClose ? h("button", { type: "button", className: "koi-dialog__close koi-iconbtn koi-btn--c-secondary koi-btn--v-ghost koi-iconbtn--sm koi-btn--rounded", "aria-label": "关闭", onClick: onClose }, Icons.close(18)) : null));
    return props.inline ? node : ReactDOM.createPortal(node, document.body);
  }

  /* ---------- Tooltip ---------- */
  function Tooltip(props) {
    var st = useState(false), id = useId();
    var open = props.open !== undefined ? props.open : st[0];
    var show = function () { st[1](true); }, hide = function () { st[1](false); };
    var child = React.Children.only(props.children);
    var trigger = React.cloneElement(child, { "aria-describedby": cx(child.props["aria-describedby"], open && id) || undefined });
    return h("span", { className: "koi-tooltip", onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide,
      onKeyDown: function (e) { if (e.key === "Escape") hide(); } },
      trigger,
      open ? h("span", { id: id, role: "tooltip", className: cx("koi-tooltip__bubble", "koi-tooltip__bubble--" + (props.side || "top")) }, props.content) : null);
  }

  /* ---------- Avatar ---------- */
  function initials(name) {
    if (!name) return "?";
    var s = String(name).trim();
    if (/[㐀-鿿]/.test(s.charAt(0))) return s.slice(0, 1);
    var p = s.split(/\s+/);
    return ((p[0] || "").charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : "")).toUpperCase();
  }
  function Avatar(props) {
    var st = useState(false), size = props.size || "md";
    var cls = cx("koi-avatar", "koi-avatar--" + size, props.shape === "square" && "koi-avatar--square", props.className);
    if (props.src && !st[0]) return h("img", { className: cls, src: props.src, alt: props.name || "", onError: function () { st[1](true); } });
    return h("span", { className: cls, role: "img", "aria-label": props.name || "头像" }, h("span", { "aria-hidden": "true" }, initials(props.name)));
  }

  /* ---------- Pagination ---------- */
  function pageList(page, count, sib) {
    var out = [], lo = Math.max(2, page - sib), hi = Math.min(count - 1, page + sib);
    out.push(1);
    if (lo > 2) out.push("…a");
    for (var i = lo; i <= hi; i++) out.push(i);
    if (hi < count - 1) out.push("…b");
    if (count > 1) out.push(count);
    return out;
  }
  function Pagination(props) {
    var count = props.pageCount || 1, page = props.page || 1, go = props.onChange || function () {};
    var simple = props.variant === "simple";
    var prev = h(Button, { variant: "soft", size: simple ? "lg" : "md", disabled: page <= 1, onClick: function () { go(page - 1); },
      iconStart: simple ? null : Icons.chevronLeft(18) }, props.prevLabel || "上一页");
    var next = h(Button, { variant: simple ? "solid" : "soft", size: simple ? "lg" : "md", disabled: page >= count, onClick: function () { go(page + 1); },
      iconEnd: simple ? null : Icons.chevronRight(18) }, props.nextLabel || "下一页");
    if (simple) prev = h(Button, { variant: "solid", size: "lg", disabled: page <= 1, onClick: function () { go(page - 1); } }, props.prevLabel || "上一页");
    return h("nav", { className: cx("koi-pagination", simple && "koi-pagination--simple", props.className), "aria-label": props.label || "分页" },
      prev,
      simple ? h("span", { className: "koi-pagination__count" }, page + " / " + count) :
        h("ol", { className: "koi-pagination__pages" }, pageList(page, count, props.siblings == null ? 1 : props.siblings).map(function (p) {
          if (typeof p === "string") return h("li", { key: p, className: "koi-pagination__gap", "aria-hidden": "true" }, "…");
          return h("li", { key: p }, h("button", { type: "button", className: cx("koi-pagination__page", p === page && "is-current"),
            "aria-current": p === page ? "page" : undefined, "aria-label": "第 " + p + " 页", onClick: function () { go(p); } }, p));
        })),
      next);
  }

  /* ---------- Divider ---------- */
  function Divider(props) {
    if (props.orientation === "vertical") return h("span", { role: "separator", "aria-orientation": "vertical", className: cx("koi-divider koi-divider--v", props.className) });
    if (props.label) return h("div", { role: "separator", className: cx("koi-divider koi-divider--label", props.className) }, h("span", null, props.label));
    return h("hr", { className: cx("koi-divider", props.className) });
  }

  /* ---------- NavMenu (vertical sidebar / horizontal bar, up to 3 levels) ---------- */
  function navPath(items, value, trail) {
    for (var i = 0; i < (items || []).length; i++) {
      var it = items[i], here = trail.concat(it.value);
      if (it.value === value) return here;
      if (it.children) { var r = navPath(it.children, value, here); if (r) return r; }
    }
    return null;
  }
  function navContent(item, extra) {
    return [
      item.icon ? h("span", { key: "i", className: "koi-nav__icon" }, item.icon) : null,
      h("span", { key: "t", className: "koi-nav__label" }, item.label),
      item.badge != null ? h("span", { key: "b", className: "koi-nav__badge" }, item.badge) : null,
      extra || null];
  }
  function navLeaf(item, attrs) {
    return item.href && !item.disabled ? h("a", Object.assign({ href: item.href }, attrs), navContent(item))
      : h("button", Object.assign({ type: "button", disabled: item.disabled }, attrs), navContent(item));
  }

  /* Horizontal flyout: one panel per open level, cascading to the side. */
  function NavFlyout(props) {
    var item = props.item, depth = props.depth;
    var sub = useState(null), openSub = sub[0], setOpenSub = sub[1];
    var fl = useState(false), flip = fl[0], setFlip = fl[1];
    var timer = useRef(null), selfRef = useRef(null);
    function show(v) {
      var el = selfRef.current;
      if (el) { var r = el.getBoundingClientRect(); setFlip(r.right + 290 > window.innerWidth); }
      setOpenSub(v);
    }
    function enter(v) { clearTimeout(timer.current); show(v); }
    function leave() { clearTimeout(timer.current); timer.current = setTimeout(function () { setOpenSub(null); }, 200); }
    useEffect(function () { return function () { clearTimeout(timer.current); }; }, []);
    return h("div", { ref: selfRef, className: "koi-nav-flyout", style: props.style, onPointerEnter: props.onPointerEnter, onPointerLeave: props.onPointerLeave,
        onKeyDown: function (e) { if (e.key === "ArrowLeft" && depth > 1 && props.onBack) { e.stopPropagation(); props.onBack(); } } },
      h("ul", { className: "koi-nav__list", "aria-label": typeof item.label === "string" ? item.label : undefined },
        item.children.map(function (child) {
          var active = child.value === props.current, inPath = props.path.indexOf(child.value) >= 0 && !active;
          var cls = cx("koi-nav__item", active && "is-active", inPath && "in-path", child.disabled && "is-disabled");
          if (child.children && child.children.length) {
            var open = openSub === child.value;
            return h("li", { key: child.value, className: "koi-nav-flyout__parent",
                onPointerEnter: function (e) { if (e.pointerType === "mouse") enter(child.value); },
                onPointerLeave: function (e) { if (e.pointerType === "mouse") leave(); } },
              h("button", { type: "button", className: cls, "aria-expanded": open, disabled: child.disabled,
                  onClick: function () { if (open && props.lastPointer.current !== "mouse") setOpenSub(null); else show(child.value); },
                  onKeyDown: function (e) {
                    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
                      e.preventDefault(); show(child.value);
                      var li = e.currentTarget.parentNode;
                      setTimeout(function () { var f = li.querySelector(".koi-nav-flyout .koi-nav__item"); if (f) f.focus(); }, 0);
                    }
                  } },
                navContent(child, h("span", { key: "c", className: "koi-nav__chevron" }, Icons.chevronRight(16)))),
              open ? h(NavFlyout, { item: child, depth: depth + 1, current: props.current, path: props.path, onPick: props.onPick,
                lastPointer: props.lastPointer, ariaCurrent: props.ariaCurrent, style: flip ? { top: -5, right: "calc(100% + 4px)" } : { top: -5, left: "calc(100% + 4px)" },
                onBack: function () { var t = document.activeElement && document.activeElement.closest(".koi-nav-flyout__parent"); setOpenSub(null); if (t) { var b = t.querySelector(".koi-nav__item"); if (b) b.focus(); } } }) : null);
          }
          return h("li", { key: child.value }, navLeaf(child, { className: cls, "aria-current": active ? props.ariaCurrent : undefined,
            onClick: function (e) { props.onPick(child, e); } }));
        })));
  }

  function NavMenu(props) {
    var orient = props.orientation === "horizontal" ? "horizontal" : "vertical";
    var sections = props.sections || (props.items ? [{ items: props.items }] : []);
    var all = [];
    sections.forEach(function (s) { all = all.concat(s.items || []); });
    var st = useControlled(props.value, props.defaultValue);
    var cur = st[0], path = navPath(all, cur, []) || [];
    var ariaCurrent = props.current || "page";
    var base = useId();

    /* vertical: which parents are expanded (the current branch opens itself) */
    var ex = useState(function () { return (props.defaultExpanded || []).concat(path.slice(0, -1)); });
    var expanded = ex[0], setExpanded = ex[1];
    useEffect(function () {
      var need = path.slice(0, -1).filter(function (v) { return expanded.indexOf(v) < 0; });
      if (need.length) setExpanded(expanded.concat(need));
    }, [cur]);
    function toggle(v) { setExpanded(expanded.indexOf(v) >= 0 ? expanded.filter(function (x) { return x !== v; }) : expanded.concat(v)); }

    /* horizontal: one open top-level flyout */
    var fo = useState(null), openTop = fo[0], setOpenTop = fo[1];
    var pos = useState(null), flyPos = pos[0], setFlyPos = pos[1];
    var triggers = useRef({}), panelRef = useRef(null), closeTimer = useRef(null), lastPointer = useRef("mouse");
    function openFly(v) {
      clearTimeout(closeTimer.current);
      var el = triggers.current[v];
      if (el) { var r = el.getBoundingClientRect(); setFlyPos({ top: r.bottom + 6, left: Math.min(r.left, window.innerWidth - 240) }); }
      setOpenTop(v);
    }
    function closeFly(focusBack) {
      clearTimeout(closeTimer.current);
      var v = openTop; setOpenTop(null);
      if (focusBack && v && triggers.current[v]) triggers.current[v].focus();
    }
    function scheduleClose() { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(function () { setOpenTop(null); }, 220); }
    useEffect(function () {
      if (!openTop) return;
      function onDown(e) {
        var t = triggers.current[openTop];
        if ((t && t.contains(e.target)) || (panelRef.current && panelRef.current.contains(e.target))) return;
        setOpenTop(null);
      }
      function onKey(e) { if (e.key === "Escape") closeFly(true); }
      function onMove() { setOpenTop(null); }
      document.addEventListener("pointerdown", onDown);
      document.addEventListener("keydown", onKey);
      window.addEventListener("resize", onMove);
      window.addEventListener("scroll", onMove, true);
      return function () {
        document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onMove); window.removeEventListener("scroll", onMove, true);
      };
    }, [openTop]);
    useEffect(function () { return function () { clearTimeout(closeTimer.current); }; }, []);

    function pick(item, e) {
      if (item.disabled) { e.preventDefault(); return; }
      st[1](item.value);
      if (props.onSelect) props.onSelect(item.value, item, e);
      setOpenTop(null);
    }

    function renderVertical(item, depth) {
      var active = item.value === cur, inPath = path.indexOf(item.value) >= 0 && !active;
      var cls = cx("koi-nav__item", depth && "koi-nav__item--d" + depth, active && "is-active", inPath && "in-path", item.disabled && "is-disabled");
      if (item.children && item.children.length && depth < 2) {
        var open = expanded.indexOf(item.value) >= 0, subId = base + "-sub-" + item.value;
        return h("li", { key: item.value },
          h("button", { type: "button", className: cls, "aria-expanded": open, "aria-controls": subId, disabled: item.disabled,
              onClick: function () { toggle(item.value); } },
            navContent(item, h("span", { key: "c", className: "koi-nav__chevron" + (open ? " is-open" : "") }, Icons.chevronDown(16)))),
          h("ul", { id: subId, className: "koi-nav__list koi-nav__sub", hidden: !open },
            item.children.map(function (c) { return renderVertical(c, depth + 1); })));
      }
      return h("li", { key: item.value }, navLeaf(item, { className: cls, "aria-current": active ? ariaCurrent : undefined,
        onClick: function (e) { pick(item, e); } }));
    }

    function renderHorizontal(item) {
      var active = item.value === cur, inPath = path.indexOf(item.value) >= 0 && !active;
      var cls = cx("koi-nav__item", (active || inPath) && "is-active", item.disabled && "is-disabled");
      if (!(item.children && item.children.length)) {
        return h("li", { key: item.value }, navLeaf(item, { className: cls, "aria-current": active ? ariaCurrent : undefined,
          onClick: function (e) { pick(item, e); } }));
      }
      var open = openTop === item.value;
      return h("li", { key: item.value,
          onPointerEnter: function (e) { if (e.pointerType === "mouse") openFly(item.value); },
          onPointerLeave: function (e) { if (e.pointerType === "mouse") scheduleClose(); } },
        h("button", { type: "button", className: cls, "aria-expanded": open, disabled: item.disabled,
            ref: function (el) { triggers.current[item.value] = el; },
            onPointerDown: function (e) { lastPointer.current = e.pointerType; },
            onClick: function () {
              if (open && lastPointer.current !== "mouse") closeFly(false); else openFly(item.value);
              lastPointer.current = "keyboard";
            },
            onKeyDown: function (e) {
              if (e.key === "ArrowDown") {
                e.preventDefault(); openFly(item.value);
                setTimeout(function () { var f = panelRef.current && panelRef.current.querySelector(".koi-nav__item"); if (f) f.focus(); }, 0);
              }
            } },
          navContent(item, h("span", { key: "c", className: "koi-nav__chevron" + (open ? " is-open" : "") }, Icons.chevronDown(16)))),
        open && flyPos ? ReactDOM.createPortal(h("div", { ref: panelRef, className: "koi-nav-portal" },
          h(NavFlyout, { item: item, depth: 1, current: cur, path: path, onPick: pick, lastPointer: lastPointer, ariaCurrent: ariaCurrent,
            style: { position: "fixed", top: flyPos.top, left: flyPos.left },
            onPointerEnter: function (e) { if (e.pointerType === "mouse") clearTimeout(closeTimer.current); },
            onPointerLeave: function (e) { if (e.pointerType === "mouse") scheduleClose(); } })), document.body) : null);
    }

    var brand = props.brand, head = null;
    if (brand) {
      var inner = [
        brand.logo ? h("span", { key: "l", className: "koi-nav__logo", "aria-hidden": "true" }, brand.logo) : null,
        h("span", { key: "t", className: "koi-nav__brandtext" },
          h("span", { className: "koi-nav__title" }, brand.title),
          brand.subtitle ? h("span", { className: "koi-nav__subtitle" }, brand.subtitle) : null)];
      head = brand.href ? h("a", { className: "koi-nav__brand", href: brand.href }, inner) : h("div", { className: "koi-nav__brand" }, inner);
    }
    var groups = [];
    sections.forEach(function (s, si) {
      var labelId = s.label ? base + "-s" + si : undefined;
      if (si > 0 && orient === "horizontal") groups.push(h("span", { key: "sep" + si, className: "koi-nav__sep", "aria-hidden": "true" }));
      groups.push(h("div", { key: "g" + si, className: "koi-nav__group" },
        s.label ? h("div", { id: labelId, className: "koi-nav__section" }, s.label) : null,
        h("ul", { className: "koi-nav__list", "aria-labelledby": labelId },
          (s.items || []).map(function (item) { return orient === "horizontal" ? renderHorizontal(item) : renderVertical(item, 0); }))));
    });
    return h("nav", { "aria-label": props.label || "主导航", className: cx("koi-nav", "koi-nav--" + orient, props.className) },
      head, h("div", { className: "koi-nav__body" }, groups),
      props.footer ? h("div", { className: "koi-nav__footer" }, props.footer) : null);
  }

  window.Koi = Object.assign(window.Koi || {}, {
    Button: Button, IconButton: IconButton, Link: Link, Input: Input, Textarea: Textarea, Select: Select,
    Checkbox: Checkbox, RadioGroup: RadioGroup, Switch: Switch, Field: Field, Alert: Alert, Badge: Badge, Tag: Tag,
    Toast: Toast, ToastProvider: ToastProvider, useToast: useToast, Progress: Progress, Spinner: Spinner, Skeleton: Skeleton, Card: Card,
    Tabs: Tabs, Dialog: Dialog, Tooltip: Tooltip, Avatar: Avatar, Pagination: Pagination, Divider: Divider, NavMenu: NavMenu, Icons: Icons
  });
})();
