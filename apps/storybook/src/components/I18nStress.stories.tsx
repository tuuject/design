import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  DataTable,
  Dialog,
  Drawer,
  Empty,
  Field,
  IconButton,
  InfoIcon,
  Input,
  Menu,
  PageHeader,
  Pagination,
  Prose,
  RadioGroup,
  Select,
  StringsProvider,
  Switch,
  Tabs,
  Tag,
  Textarea,
  Toast,
  Tooltip,
} from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

// Long-text and RTL stress test (docs/spec/README.md, "Direction and text expansion"). Real German copy expands
// far past Chinese, and Arabic runs the whole page right to left; both are shown at desktop, tablet and phone
// container widths with the components whose layout is most likely to break. German also needs `lang="de"` for
// hyphenation, which is why each screen sets its own `lang` (the direction comes from the toolbar's provider).
const screen = css({ display: 'flex', flexDirection: 'column', gap: '6', maxWidth: '100%' });
const row = css({ display: 'flex', flexWrap: 'wrap', gap: '2', alignItems: 'center' });
const column = css({ display: 'flex', flexDirection: 'column', gap: '4', minWidth: '0' });
// A technical string inside RTL copy: an isolated LTR run. `isolate` alone keeps the inherited RTL base direction, so
// a path's leading `/` would land at its visual end; the run needs its own `direction` (or `<bdi dir="ltr">`).
const isolated = css({ unicodeBidi: 'isolate', direction: 'ltr', fontFamily: 'sans' });
// A key-shaped identifier (the harness redacts anything that looks like a real key); the shape is what bidi
// reordering breaks, not the value.
const API_KEY = 'token_9f4d2b7c1e84a77ad3c1';

type Lang = 'de' | 'ar';

const strings = {
  de: {
    close: 'Schließen',
    prevPage: 'Vorherige Seite',
    nextPage: 'Nächste Seite',
    pagination: 'Seitennavigation',
    page: (n: number) => `Seite ${n}`,
    breadcrumb: 'Brotkrumennavigation',
    remove: 'Entfernen',
    notifications: 'Benachrichtigungen',
    navMenu: 'Hauptnavigation',
    optional: ' (optional)',
    noMatches: 'Keine Treffer',
    search: 'Suchen',
    selectPlaceholder: 'Bitte auswählen',
    addValue: 'Wert hinzufügen',
  },
  ar: {
    close: 'إغلاق',
    prevPage: 'الصفحة السابقة',
    nextPage: 'الصفحة التالية',
    pagination: 'تصفح الصفحات',
    page: (n: number) => `صفحة ${n}`,
    breadcrumb: 'مسار التنقل',
    remove: 'إزالة',
    notifications: 'الإشعارات',
    navMenu: 'التنقل الرئيسي',
    optional: ' (اختياري)',
    noMatches: 'لا توجد نتائج',
    search: 'بحث',
    selectPlaceholder: 'يرجى الاختيار',
    addValue: 'إضافة قيمة',
  },
} as const;

const copy = {
  de: {
    title: 'Benutzeroberflächeneinstellungen für die Datenschutzgrundverordnung',
    description:
      'Verwalten Sie hier die Einstellungen für alle Benutzerkonten Ihrer Organisation. Änderungen gelten sofort für alle angemeldeten Sitzungen.',
    save: 'Einstellungen speichern',
    back: 'Zurück zur Übersicht',
    alertTitle: 'Die Datenschutzgrundverordnung wurde noch nicht bestätigt',
    alertBody:
      'Ohne Bestätigung der Datenschutzgrundverordnung können keine personenbezogenen Daten veröffentlicht werden. Die Bestätigung muss von einer berechtigten Person vorgenommen werden.',
    confirm: 'Jetzt bestätigen',
    tabs: [
      { value: 'overview', label: 'Übersicht' },
      { value: 'accounts', label: 'Benutzerkonten' },
      { value: 'privacy', label: 'Datenschutzgrundverordnung' },
      { value: 'notifications', label: 'Benachrichtigungseinstellungen' },
    ],
    fieldLabel: 'Benutzeroberflächensprache',
    fieldHelp: 'Die Sprache wird beim nächsten Anmelden übernommen.',
    errorLabel: 'E-Mail-Adresse',
    error: 'Diese E-Mail-Adresse wird bereits von einem anderen Benutzerkonto verwendet.',
    selectLabel: 'Standardrolle für neue Benutzerkonten',
    textarea:
      'Beschreiben Sie hier die Aufbewahrungsfristen für personenbezogene Daten sowie die zuständigen Ansprechpersonen.',
    checkbox: 'Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der Datenschutzgrundverordnung zu.',
    radioLabel: 'Geltungsbereich der Einstellungen',
    radios: [
      { value: 'org', label: 'Für die gesamte Organisation übernehmen' },
      { value: 'account', label: 'Nur für dieses Benutzerkonto übernehmen' },
    ],
    switch: 'Benachrichtigungen bei Änderungen der Datenschutzgrundverordnung senden',
    badge: 'Bestätigung ausstehend',
    tag: 'Datenschutzgrundverordnung',
    cardTitle: 'Zusammenfassung der Benutzeroberflächeneinstellungen',
    cardBody: 'Die Einstellungen wurden zuletzt am 14. Oktober 2026 geändert und gelten für 2.184 Benutzerkonten.',
    columns: ['Benutzerkonto', 'Datenschutzgrundverordnung', 'Zuständige Person'],
    rows: [
      ['julia.mustermann@example.com', 'Bestätigt am 2. Oktober 2026', 'Dr. Maximilian von Habichtswald'],
      ['benutzeroberflaecheneinstellungen@example.com', 'Bestätigung ausstehend', 'Katharina Schulze-Bergmann'],
    ],
    emptyTitle: 'Keine Benutzeroberflächeneinstellungen gespeichert',
    emptyBody: 'Legen Sie ein Benutzerkonto an oder importieren Sie die Einstellungen aus einer Datei.',
    emptyAction: 'Einstellungen importieren',
  },
  ar: {
    title: 'إعدادات واجهة المستخدم للائحة العامة لحماية البيانات',
    description:
      'يمكنك من هنا إدارة الإعدادات لجميع حسابات المستخدمين في مؤسستك. تُطبَّق التغييرات فورًا على كل الجلسات المسجَّلة.',
    save: 'حفظ الإعدادات',
    back: 'العودة إلى النظرة العامة',
    alertTitle: 'لم يتم تأكيد اللائحة العامة لحماية البيانات بعد',
    alertBody: 'لا يمكن نشر أي بيانات شخصية قبل تأكيد اللائحة العامة لحماية البيانات. يجب أن يقوم شخص مخوَّل بتأكيدها.',
    confirm: 'تأكيد الآن',
    tabs: [
      { value: 'overview', label: 'نظرة عامة' },
      { value: 'accounts', label: 'حسابات المستخدمين' },
      { value: 'privacy', label: 'اللائحة العامة لحماية البيانات' },
      { value: 'notifications', label: 'إعدادات الإشعارات' },
    ],
    fieldLabel: 'لغة واجهة المستخدم',
    fieldHelp: 'تُطبَّق اللغة عند تسجيل الدخول في المرة القادمة.',
    errorLabel: 'البريد الإلكتروني',
    error: 'هذا البريد الإلكتروني مستخدم بالفعل من قبل حساب مستخدم آخر.',
    selectLabel: 'الدور الافتراضي لحسابات المستخدمين الجديدة',
    textarea: 'صِف هنا مدة الاحتفاظ بالبيانات الشخصية والمسؤولين عن متابعتها.',
    checkbox: 'أوافق على معالجة بياناتي الشخصية وفقًا للائحة العامة لحماية البيانات.',
    radioLabel: 'نطاق تطبيق الإعدادات',
    radios: [
      { value: 'org', label: 'تطبيقها على المؤسسة بالكامل' },
      { value: 'account', label: 'تطبيقها على هذا الحساب فقط' },
    ],
    switch: 'إرسال إشعارات عند تغيير اللائحة العامة لحماية البيانات',
    badge: 'بانتظار التأكيد',
    tag: 'اللائحة العامة لحماية البيانات',
    cardTitle: 'ملخّص إعدادات واجهة المستخدم',
    cardBody: 'عُدِّلت الإعدادات آخر مرة في 14 أكتوبر 2026، وتنطبق على 2,184 حساب مستخدم.',
    columns: ['حساب المستخدم', 'اللائحة العامة لحماية البيانات', 'الشخص المسؤول'],
    rows: [
      ['julia.mustermann@example.com', 'مؤكَّدة في 2 أكتوبر 2026', 'د. مكسيميليان هابيشتسفالد'],
      ['benutzeroberflaecheneinstellungen@example.com', 'بانتظار التأكيد', 'كاتارينا شولتسه بيرغمان'],
    ],
    emptyTitle: 'لا توجد إعدادات واجهة مستخدم محفوظة',
    emptyBody: 'أنشئ حساب مستخدم أو استورد الإعدادات من ملف.',
    emptyAction: 'استيراد الإعدادات',
  },
} as const;

/** A page of a realistic admin screen, in one language. The viewport comes from the story's `koiViewport`. */
function Screen({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const s = strings[lang];
  const [checked, setChecked] = useState(true);
  const [tab, setTab] = useState<string>(t.tabs[0].value);
  return (
    <StringsProvider strings={s}>
      <div lang={lang} className={screen}>
        <Breadcrumb
          items={[
            { label: lang === 'de' ? 'Startseite' : 'الصفحة الرئيسية', href: '#' },
            { label: lang === 'de' ? 'Organisation' : 'المؤسسة', href: '#' },
            { label: t.title, current: true },
          ]}
        />
        <PageHeader
          title={t.title}
          description={t.description}
          actions={
            <>
              <Button variant="ghost" color="secondary">
                {t.back}
              </Button>
              <Button>{t.save}</Button>
            </>
          }
        />
        <Alert
          tone="error"
          title={t.alertTitle}
          action={
            <Button color="error" variant="soft" size="sm">
              {t.confirm}
            </Button>
          }
        >
          {t.alertBody}
        </Alert>
        <Tabs items={t.tabs.map((item) => ({ ...item }))} value={tab} onChange={setTab} label={t.title} />
        <div className={column}>
          <Field label={t.fieldLabel} help={t.fieldHelp}>
            <Select
              options={[
                {
                  value: 'standard',
                  label: lang === 'de' ? 'Deutsch (Deutschland)' : 'العربية (المملكة العربية السعودية)',
                },
                {
                  value: 'en',
                  label: lang === 'de' ? 'Englisch (Vereinigte Staaten)' : 'الإنجليزية (الولايات المتحدة)',
                },
              ]}
              defaultValue="standard"
            />
          </Field>
          <Field label={t.errorLabel} error={t.error} required>
            <Input defaultValue="benutzeroberflaecheneinstellungen@example.com" />
          </Field>
          <Field label={t.selectLabel} optional>
            <Textarea rows={2} placeholder={t.textarea} />
          </Field>
          <Checkbox label={t.checkbox} checked={checked} onCheckedChange={(next) => setChecked(next)} />
          <RadioGroup label={t.radioLabel} options={t.radios.map((option) => ({ ...option }))} defaultValue="org" />
          <Switch label={t.switch} defaultChecked />
          <div className={row}>
            <Badge tone="warning">{t.badge}</Badge>
            <Tag selected onRemove={() => {}}>
              {t.tag}
            </Tag>
            <IconButton label={t.badge} icon={<InfoIcon />} />
            <Button size="sm" variant="soft">
              {t.confirm}
            </Button>
          </div>
        </div>
        <Card title={t.cardTitle} description={t.cardBody}>
          <DataTable
            columns={t.columns.map((header, index) => ({
              key: header,
              header,
              cell: (row: readonly string[]) => row[index],
            }))}
            rows={t.rows.map((cells) => [...cells])}
            getRowKey={(cells) => cells[0]}
          />
        </Card>
        <Pagination page={2} pageCount={12} onChange={() => {}} />
        <Empty
          title={t.emptyTitle}
          description={t.emptyBody}
          action={<Button variant="outline">{t.emptyAction}</Button>}
        />
      </div>
    </StringsProvider>
  );
}

/** Real technical identifiers in Arabic copy: isolated runs, or the surrounding sentence gets reordered. */
function TechnicalContent() {
  return (
    <div lang="ar" className={screen}>
      <Prose size="sm">
        <p>
          استخدم المفتاح <code>{API_KEY}</code> عند الاتصال بالنموذج، ولا تشاركه مع أي حساب آخر.
        </p>
        <p>
          النموذج الافتراضي هو <code>openai/gpt-4.1-mini</code>، ويمكن تغييره من العنوان{' '}
          <code>https://api.example.com/v1/workspaces?limit=50</code>.
        </p>
        <pre>
          <code>{`{
  "apiKey": "${API_KEY}",
  "model": "openai/gpt-4.1-mini",
  "configPath": "/srv/app/config/benutzer.json",
  "timeoutSeconds": 30
}`}</code>
        </pre>
        <p>
          ملف الإعدادات موجود في <span className={isolated}>/srv/app/config/benutzer.json</span>، ويُقرأ مرة واحدة عند
          بدء التشغيل.
        </p>
        {/* `plaintext` on inline code: `foo/bar()` keeps its trailing parentheses on the right inside Arabic copy. */}
        <p>
          تُستدعى الدالة <code>foo/bar()</code> قبل كل طلب، وتُعيد <code>readConfig()</code> مسار الملف.
        </p>
      </Prose>
    </div>
  );
}

/** A phone-width page: an open Dialog whose footer has to wrap, and a static Toast beside it. */
function DialogPhone({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const s = strings[lang];
  return (
    <StringsProvider strings={s}>
      <div lang={lang} className={screen}>
        <Toast
          tone="error"
          title={t.alertTitle}
          description={t.alertBody}
          action={<Button size="sm">{t.confirm}</Button>}
        />
        <Dialog
          open
          onOpenChange={() => {}}
          role="alertdialog"
          title={t.alertTitle}
          description={t.description}
          footer={
            <>
              <Button variant="ghost" color="secondary">
                {t.back}
              </Button>
              <Button color="error">{t.confirm}</Button>
            </>
          }
        >
          {t.alertBody}
        </Dialog>
      </div>
    </StringsProvider>
  );
}

/** The edge-anchored panel: `side="start"`, so it opens on the inline-start edge and slides the right way in RTL. */
function DrawerStart({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const s = strings[lang];
  return (
    <StringsProvider strings={s}>
      <div lang={lang} className={screen}>
        <Drawer open onOpenChange={() => {}} side="start" title={t.title} description={t.description}>
          <div className={column}>
            <Field label={t.fieldLabel} help={t.fieldHelp}>
              <Input defaultValue={t.selectLabel} />
            </Field>
            <Field label={t.errorLabel} error={t.error}>
              <Input defaultValue="benutzeroberflaecheneinstellungen@example.com" />
            </Field>
          </div>
        </Drawer>
      </div>
    </StringsProvider>
  );
}

/** A flyout and a tooltip over Arabic copy: the panel mirrors to the inline end, the tooltip stays put. */
function Flyouts({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const s = strings[lang];
  return (
    <StringsProvider strings={s}>
      <div lang={lang} className={screen}>
        <div className={row}>
          <Menu
            defaultOpen
            trigger={<Button variant="outline">{t.tabs[2].label}</Button>}
            items={[
              { value: 'save', label: t.save },
              { value: 'confirm', label: t.confirm },
              { value: 'back', label: t.back, endContent: <Badge>{t.badge}</Badge> },
            ]}
          />
          <Tooltip content={t.alertTitle} defaultOpen>
            <Button variant="ghost" iconStart={<InfoIcon />}>
              {t.tabs[1].label}
            </Button>
          </Tooltip>
        </div>
      </div>
    </StringsProvider>
  );
}

/**
 * Long-text and RTL stress screens. German is the expansion test (compound words, 30–50% longer copy); Arabic is the
 * direction test at the same widths. Switch the 方向 toolbar to see any of them in RTL.
 */
const meta = {
  title: 'Components/I18nStress',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// A phone story is shot at a real phone viewport: fixed-position overlays live in the viewport, not in a wrapper.
// `shots.mjs` reads the viewport from a `koi-shot-<width>x<height>` tag — Storybook's indexer only accepts tag
// literals and its index carries tags, not story parameters, so these have to stay inline strings.
// `lang` reaches the document through the 语言 toolbar global, so portalled copy (a Dialog, a Drawer) hyphenates in
// the story's language too; the wrapper keeps it as well, so the story reads the same in the docs page.
const de = { lang: 'de' } as const;
const ar = { direction: 'rtl', lang: 'ar' } as const;

export const GermanDesktop: Story = {
  render: () => <Screen lang="de" />,
  globals: de,
  tags: ['koi-shot-1000x1100'],
};
export const GermanTablet: Story = {
  render: () => <Screen lang="de" />,
  globals: de,
  tags: ['koi-shot-820x1100'],
};
export const GermanPhone: Story = {
  render: () => <Screen lang="de" />,
  globals: de,
  tags: ['koi-shot-390x1500'],
};
export const ArabicDesktop: Story = {
  render: () => <Screen lang="ar" />,
  globals: ar,
  tags: ['koi-shot-1000x1100'],
};
export const ArabicTablet: Story = {
  render: () => <Screen lang="ar" />,
  globals: ar,
  tags: ['koi-shot-820x1100'],
};
export const ArabicPhone: Story = {
  render: () => <Screen lang="ar" />,
  globals: ar,
  tags: ['koi-shot-390x1500'],
};
export const GermanDialogPhone: Story = {
  render: () => <DialogPhone lang="de" />,
  tags: ['shot-viewport', 'koi-shot-390x900'],
  globals: de,
};
export const ArabicDialogPhone: Story = {
  render: () => <DialogPhone lang="ar" />,
  tags: ['shot-viewport', 'koi-shot-390x900'],
  globals: ar,
};
export const GermanDrawerStart: Story = {
  render: () => <DrawerStart lang="de" />,
  tags: ['shot-viewport', 'koi-shot-390x900'],
  globals: de,
};
export const ArabicDrawerStart: Story = {
  render: () => <DrawerStart lang="ar" />,
  tags: ['shot-viewport', 'koi-shot-390x900'],
  globals: ar,
};
export const GermanFlyouts: Story = {
  render: () => <Flyouts lang="de" />,
  tags: ['shot-viewport', 'koi-shot-390x900'],
  globals: de,
};
export const ArabicFlyouts: Story = {
  render: () => <Flyouts lang="ar" />,
  tags: ['shot-viewport', 'koi-shot-390x900'],
  globals: ar,
};
export const ArabicTechnicalContent: Story = {
  render: () => <TechnicalContent />,
  globals: ar,
  tags: ['koi-shot-640x800'],
};
