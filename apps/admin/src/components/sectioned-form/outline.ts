// The form's outline: which sections and fields are on the page, which section is current (scrollspy), and how
// to bring one of them into view. A plain store for useSyncExternalStore; elements arrive through ref callbacks,
// so there are no effects. Values never pass through here: they stay in react-hook-form.

export interface SectionEntry {
  id: string;
  title: string;
}

export interface FieldEntry {
  /** The react-hook-form path. */
  name: string;
  label: string;
  sectionId: string;
  /** False once the field has unmounted (a conditional field that is hidden now). Its value may still be dirty. */
  mounted: boolean;
}

export interface OutlineStructure {
  /** In document order. */
  sections: SectionEntry[];
  /** Grouped by section in document order; within a section, mounted fields in document order, then hidden ones. */
  fields: FieldEntry[];
}

/** How long a field stays highlighted after the change summary or a validation error jumps to it. */
const FLASH_MS = 1600;
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

const byDocumentOrder = (a: Node, b: Node) =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

export class FormOutline {
  private sections = new Map<string, { title: string; el: HTMLElement }>();
  // Kept after a field unmounts: a hidden field can still hold an unsaved value, and the summary needs its label.
  private fields = new Map<string, { label: string; sectionId: string; el: HTMLElement | null }>();
  private listeners = new Set<() => void>();
  private structure: OutlineStructure | null = null;
  private activeId: string | null = null;

  private root: HTMLElement | null = null;
  private observer: IntersectionObserver | null = null;
  private offset: number | null = null;
  private visible = new Set<Element>();
  private start: HTMLElement | null = null;
  private end: HTMLElement | null = null;
  /** A section the user just jumped to; it stays current until they scroll on their own. */
  private locked: string | null = null;
  /** Our own smooth scroll is running, so its scroll events don't release the lock. */
  private programmatic = false;
  private flashTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getStructure = (): OutlineStructure => {
    this.structure ??= this.buildStructure();
    return this.structure;
  };

  getActiveId = () => this.activeId;

  /** Ref callback body for a section; returns the cleanup. */
  registerSection(id: string, title: string, el: HTMLElement) {
    this.sections.set(id, { title, el });
    this.observer?.observe(el);
    this.changed();
    return () => {
      if (this.sections.get(id)?.el === el) {
        this.sections.delete(id);
      }
      this.observer?.unobserve(el);
      this.visible.delete(el);
      this.changed();
    };
  }

  /** Ref callback body for a field's wrapper; returns the cleanup. */
  registerField(name: string, label: string, sectionId: string, el: HTMLElement) {
    this.fields.set(name, { label, sectionId, el });
    this.changed();
    return () => {
      const field = this.fields.get(name);
      if (field?.el === el) {
        this.fields.set(name, { ...field, el: null });
        this.changed();
      }
    };
  }

  /** Ref callback body for the markers before the first and after the last section. */
  registerEdge(edge: 'start' | 'end', el: HTMLElement) {
    this[edge] = el;
    this.observer?.observe(el);
    return () => {
      this.observer?.unobserve(el);
      this.visible.delete(el);
      if (this[edge] === el) {
        this[edge] = null;
      }
    };
  }

  /** Ref callback body for the layout root: starts the scrollspy, and stops it on unmount. */
  attach(root: HTMLElement) {
    this.root = root;
    // The sticky offset differs between the one- and two-column layouts; re-read it when the layout resizes.
    const resize = new ResizeObserver(() => this.observe());
    resize.observe(root);
    this.observe();
    const options = { capture: true, passive: true };
    window.addEventListener('scroll', this.onScroll, options);
    window.addEventListener('scrollend', this.onScrollEnd, options);
    window.addEventListener('wheel', this.onUserScroll, options);
    window.addEventListener('touchstart', this.onUserScroll, options);
    window.addEventListener('keydown', this.onKeyDown, options);
    return () => {
      resize.disconnect();
      this.observer?.disconnect();
      this.observer = null;
      this.offset = null;
      this.visible.clear();
      window.removeEventListener('scroll', this.onScroll, options);
      window.removeEventListener('scrollend', this.onScrollEnd, options);
      window.removeEventListener('wheel', this.onUserScroll, options);
      window.removeEventListener('touchstart', this.onUserScroll, options);
      window.removeEventListener('keydown', this.onKeyDown, options);
      for (const [el, timer] of this.flashTimers) {
        clearTimeout(timer);
        delete el.dataset.flash;
      }
      this.flashTimers.clear();
      this.root = null;
    };
  }

  /** Scrolls a section's top under the sticky header and makes it current. */
  goToSection(id: string, { focus = false } = {}) {
    const section = this.sections.get(id);
    if (!section) {
      return;
    }
    this.lock(id);
    section.el.scrollIntoView({ block: 'start', behavior: scrollBehavior() });
    if (focus) {
      // Keyboard users continue with Tab from the section, not from the navigation.
      this.headingOf(id)?.focus({ preventScroll: true });
    }
  }

  /**
   * Scrolls a field to the middle of the screen and highlights it. A hidden field can't be shown: its section is
   * brought up instead. Returns the element focus should move to (without scrolling again), or null.
   */
  revealField(name: string): HTMLElement | null {
    const field = this.fields.get(name);
    if (!field) {
      return null;
    }
    if (!field.el) {
      this.goToSection(field.sectionId);
      return this.headingOf(field.sectionId);
    }
    this.lock(field.sectionId);
    field.el.scrollIntoView({ block: 'center', behavior: scrollBehavior() });
    this.flash(field.el);
    return field.el;
  }

  /**
   * revealField, then focus. On touch the wrapper takes focus rather than the control, so a text field doesn't pop
   * the on-screen keyboard and resize the viewport mid-scroll.
   */
  goToField(name: string, { touch = false } = {}) {
    const target = this.revealField(name);
    if (!target) {
      return;
    }
    const control = touch ? null : firstTabbable(target);
    (control ?? target).focus({ preventScroll: true });
  }

  private headingOf(sectionId: string) {
    return this.sections.get(sectionId)?.el.querySelector<HTMLElement>('[data-section-heading]') ?? null;
  }

  private flash(el: HTMLElement) {
    clearTimeout(this.flashTimers.get(el));
    el.dataset.flash = '';
    this.flashTimers.set(
      el,
      setTimeout(() => {
        delete el.dataset.flash;
        this.flashTimers.delete(el);
      }, FLASH_MS),
    );
  }

  private changed() {
    this.structure = null;
    this.updateActive();
    this.emit();
  }

  private emit() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private buildStructure(): OutlineStructure {
    const sections = [...this.sections]
      .sort(([, a], [, b]) => byDocumentOrder(a.el, b.el))
      .map(([id, { title }]) => ({ id, title }));
    const order = new Map(sections.map((s, i) => [s.id, i]));
    const rank = (sectionId: string) => order.get(sectionId) ?? sections.length;
    const fields = [...this.fields]
      .sort(
        ([, a], [, b]) =>
          rank(a.sectionId) - rank(b.sectionId) ||
          (a.el && b.el ? byDocumentOrder(a.el, b.el) : Number(!a.el) - Number(!b.el)),
      )
      .map(([name, f]) => ({ name, label: f.label, sectionId: f.sectionId, mounted: f.el !== null }));
    return { sections, fields };
  }

  // Scrollspy. The observer's root is the viewport minus the sticky header (the offset is the sections'
  // scroll-margin-top, so the CSS stays the single source). The current section is the first one that still
  // reaches below that line. A short last section can never reach it, so once the end of the form is on screen
  // (and its start has scrolled away) the last section is current.
  private observe() {
    const first = this.sections.values().next().value?.el;
    const offset = first ? Math.round(Number.parseFloat(getComputedStyle(first).scrollMarginTop)) || 0 : 0;
    if (this.observer && offset === this.offset) {
      return;
    }
    this.observer?.disconnect();
    this.visible.clear();
    this.offset = offset;
    this.observer = new IntersectionObserver(this.onIntersect, { rootMargin: `-${offset}px 0px 0px 0px` });
    for (const { el } of this.sections.values()) {
      this.observer.observe(el);
    }
    for (const el of [this.start, this.end]) {
      if (el) {
        this.observer.observe(el);
      }
    }
  }

  private onIntersect = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.visible.add(entry.target);
      } else {
        this.visible.delete(entry.target);
      }
    }
    this.updateActive();
  };

  private updateActive() {
    const next = this.locked ?? this.spy();
    if (next !== this.activeId) {
      this.activeId = next;
      this.emit();
    }
  }

  private spy() {
    const { sections } = this.getStructure();
    if (sections.length === 0) {
      return null;
    }
    const atEnd = this.end && this.start && this.visible.has(this.end) && !this.visible.has(this.start);
    if (atEnd) {
      return sections[sections.length - 1].id;
    }
    const firstVisible = sections.find((s) => {
      const el = this.sections.get(s.id)?.el;
      return el && this.visible.has(el);
    });
    if (firstVisible) {
      return firstVisible.id;
    }
    // Nothing below the line (the form is scrolled out of view): keep what was current.
    return sections.some((s) => s.id === this.activeId) ? this.activeId : sections[0].id;
  }

  private lock(id: string) {
    this.locked = id;
    this.programmatic = true;
    this.updateActive();
  }

  // Only scrolling of something that contains the form counts: not a textarea, not a popup's list.
  private scrollsForm(target: EventTarget | null) {
    return target === document || (target instanceof Element && this.root !== null && target.contains(this.root));
  }

  private onScroll = (event: Event) => {
    if (this.locked && !this.programmatic && this.scrollsForm(event.target)) {
      this.locked = null;
      this.updateActive();
    }
  };

  private onScrollEnd = (event: Event) => {
    if (this.scrollsForm(event.target)) {
      this.programmatic = false;
    }
  };

  // Wheel, touch and scroll keys mean the scroll that follows is the user's, even mid-way through ours.
  private onUserScroll = () => {
    this.programmatic = false;
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (SCROLL_KEYS.has(event.key)) {
      this.programmatic = false;
    }
  };
}

/** The control to focus inside a field: the first one reachable with Tab (a radio group's checked radio). */
export function firstTabbable(container: HTMLElement) {
  const candidates = container.querySelectorAll<HTMLElement>('input, select, textarea, button, [tabindex]');
  return (
    [...candidates].find(
      (el) => el.tabIndex >= 0 && !(el as HTMLInputElement).disabled && el.getClientRects().length > 0,
    ) ?? null
  );
}

/** A click that came from a tap (not a mouse or a key): a jump then focuses the field's wrapper (see goToField). */
export const isTouch = (event: { nativeEvent: Event }) => (event.nativeEvent as PointerEvent).pointerType === 'touch';
