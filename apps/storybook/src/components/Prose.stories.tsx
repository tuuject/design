import { Prose } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';

// A local image so the shots don't depend on the network.
const figureSrc = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#fcd34d"/></linearGradient></defs><rect width="1200" height="600" fill="url(#g)"/></svg>',
)}`;

const article = (
  <>
    <h1>Markdown 样式演示</h1>
    <p className="lead">
      Prose 给一整块渲染好的富文本套上 Koi
      的长文排版：标题、段落、列表、引用、代码和表格，都按同一个基准字号成比例缩放。
    </p>
    <p>
      应用里的 UI 文字以 14px 为基准，而文章和文档用 16px 阅读。Markdown 渲染出来的是一串没有 class 的 HTML，
      所以样式挂在外层容器上，按元素名选中里面的内容。比如这里有<strong>加粗文字</strong>、<em>斜体文字</em>，还有一个
      <a href="#prose">指向别处的链接</a>，和 <code>inline code</code>。
    </p>
    <blockquote>
      <p>排版要是不认真，内容再好也像一堆杂物。先把它做好，它就不会差。</p>
    </blockquote>
    <h2>列表与层级</h2>
    <p>无序列表的条目之间留得很紧：</p>
    <ul>
      <li>第一项，短一点。</li>
      <li>第二项，也保持简短。</li>
      <li>
        第三项带一层嵌套：
        <ul>
          <li>嵌套的列表留一点上下间距。</li>
          <li>再深就不太好读了。</li>
        </ul>
      </li>
    </ul>
    <ol>
      <li>有序列表的序号用次要文字色。</li>
      <li>序号和正文之间有一点内边距。</li>
      <li>
        按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制，组合键写成{' '}
        <kbd>
          <kbd>Ctrl</kbd>+<kbd>V</kbd>
        </kbd>
        。
      </li>
    </ol>
    <h3>代码块</h3>
    <p>代码块在两种主题下都是深色底。语法高亮由应用自己接（Shiki、Prism），它们会带上自己的背景。</p>
    <pre>
      <code>{`export default defineConfig({
  presets: ['@pandacss/preset-base', koiPreset],
  theme: { extend: { recipes, slotRecipes } },
});`}</code>
    </pre>
    <h3>图片</h3>
    <figure>
      <img src={figureSrc} alt="" />
      <figcaption>图注用小一号的次要文字，紧贴在图片下面。</figcaption>
    </figure>
    <h2>表格</h2>
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>浅色</th>
          <th>深色</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>prose-text</code>
          </td>
          <td>secondary-700</td>
          <td>secondary-300</td>
        </tr>
        <tr>
          <td>
            <code>link</code>
          </td>
          <td>accent-700</td>
          <td>accent-400</td>
        </tr>
        <tr>
          <td>
            <code>code-block-bg</code>
          </td>
          <td>secondary-800</td>
          <td>secondary-800</td>
        </tr>
      </tbody>
    </table>
    <h2>定义列表</h2>
    <dl>
      <dt>为什么用 em？</dt>
      <dd>同一份样式放在 14px 或 16px 的容器里，标题、间距、代码都跟着等比缩放。</dd>
      <dt>能嵌 Koi 组件吗？</dt>
      <dd>
        能。把组件包在 <code>koi-not-prose</code> 里，Prose 就不会碰它。
      </dd>
    </dl>
    <hr />
    <p>以上就是全部元素。</p>
  </>
);

const headings = (
  <>
    <h1>一级标题 Heading 1</h1>
    <h2>二级标题 Heading 2</h2>
    <h3>三级标题 Heading 3</h3>
    <h4>四级标题 Heading 4</h4>
    <h5>五级标题 Heading 5</h5>
    <h6>六级标题 Heading 6</h6>
    <p>标题字号都是 em：放进 14px 的 Prose 里，一级标题是 31.5px；放进 16px 的，是 36px。</p>
  </>
);

const meta = {
  title: 'Components/Prose',
  component: Prose,
  // A reading column; Prose itself has no max width.
  args: { children: article, className: css({ maxWidth: '[720px]' }) },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
    children: { control: false },
    className: { control: false },
  },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A whole article at the default `md` (16px) size. */
export const Playground: Story = {};

/** h1 to h6. Their sizes are em of the Prose base, so they follow `size`. */
export const Headings: Story = { args: { children: headings } };

/** The same content at `sm` (14px) and `md` (16px): every size and gap inside scales with the base. */
export const Sizes: Story = {
  render: () => (
    <div className={css({ display: 'grid', gridTemplateColumns: '[1fr 1fr]', gap: '8', alignItems: 'start' })}>
      <Prose size="sm">{headings}</Prose>
      <Prose size="md">{headings}</Prose>
    </div>
  ),
};

/** Smaller type for rich text among UI text: a comment, a description, a reply in a dense panel. */
export const Small: Story = { args: { size: 'sm' } };
