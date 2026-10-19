import { Avatar, type AvatarShape, type AvatarSize } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { label, row, stack } from '../layout';

const sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl'];
const shapes: AvatarShape[] = ['circle', 'square'];

// Stand-in pictures as inline SVG data URIs, so stories never touch the network. Illustrations, not UI, hence the
// literal colors.
const svg = (body: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body}</svg>`)}`;
const portrait = svg(
  '<rect width="64" height="64" fill="#bae6fd"/>' +
    '<circle cx="32" cy="27" r="12" fill="#fcd9b6"/>' +
    '<path d="M19 26c0-9 6-14 13-14s13 5 13 14c-3-5-8-7-13-7s-10 2-13 7z" fill="#3f3a52"/>' +
    '<path d="M10 64c2-13 11-20 22-20s20 7 22 20z" fill="#0284c7"/>',
);
const site = svg(
  '<rect width="64" height="64" fill="#fef3c7"/>' +
    '<path d="M14 34c6-10 18-14 30-8l8-7v26l-8-7c-12 6-24 2-30-4z" fill="#f59e0b"/>' +
    '<circle cx="22" cy="31" r="2" fill="#1f2937"/>',
);
// Not an image at all: Chromium fails to decode it without fetching anything or logging an error.
const broken = 'data:image/png;base64,AAAA';

/**
 * Loads every picture before the story renders, so Base UI finds it already decoded and shows it on the first frame:
 * screenshots never catch the initials of an image that's still loading. Real pages don't need this.
 */
const preload = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'tcdw', src: portrait, size: 'md', shape: 'circle' },
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    shape: { control: 'inline-radio', options: shapes },
  },
  loaders: [
    async () => {
      await Promise.all([portrait, site, broken].map(preload));
      return {};
    },
  ],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** sm 28 / md 36 / lg 44 match the control heights, so an avatar lines up with buttons of the same size; xl is 64. */
export const Sizes: Story = {
  render: () => (
    <div className={stack}>
      {shapes.map((shape) => (
        <div key={shape} className={row}>
          <span className={label}>{shape}</span>
          {sizes.map((size) => (
            <Avatar key={size} size={size} shape={shape} name="tcdw" src={portrait} />
          ))}
          {sizes.map((size) => (
            <Avatar key={size} size={size} shape={shape} name="Ada Lovelace" />
          ))}
        </div>
      ))}
    </div>
  ),
};

/**
 * Without a picture, or when it fails to load, the initials show: the first character of a Chinese name, otherwise
 * the first letters of the first and last words. No name gives "?" (and the accessible name "头像").
 */
export const Fallback: Story = {
  render: () => (
    <div className={stack}>
      <div className={row}>
        <span className={label}>initials</span>
        <Avatar name="咕咕鸟" />
        <Avatar name="Ada Lovelace" />
        <Avatar name="tcdw" />
        <Avatar name="grace brewster hopper" />
        <Avatar />
      </div>
      <div className={row}>
        <span className={label}>broken src</span>
        <Avatar name="咕咕鸟" src={broken} />
        <Avatar name="Ada Lovelace" src={broken} />
        <Avatar name="Ada Lovelace" src={broken} size="xl" shape="square" />
      </div>
    </div>
  ),
};

const comment = css({ display: 'flex', alignItems: 'center', gap: '3' });
const byline = css({ display: 'flex', flexDirection: 'column', gap: '0.5' });
const author = css({ textStyle: 'label', color: 'text' });
const date = css({ textStyle: 'small', color: 'text-muted' });
const friends = css({ display: 'flex', gap: '6', flexWrap: 'wrap' });
const friend = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2',
  textStyle: 'small',
  color: 'text-muted',
});

/** The blog's uses: a comment byline, the nav avatar (lg) and friend links (xl, square). */
export const InContext: Story = {
  name: 'In context',
  render: () => (
    <div className={stack}>
      <div className={comment}>
        <Avatar name="tcdw" src={portrait} />
        <div className={byline}>
          <span className={author}>tcdw</span>
          <span className={date}>2026 年 10 月 7 日</span>
        </div>
      </div>
      <div className={comment}>
        <Avatar name="咕咕鸟" size="lg" />
        <span className={author}>咕咕鸟</span>
      </div>
      <div className={friends}>
        <span className={friend}>
          <Avatar name="锦鲤日报" src={site} size="xl" shape="square" />
          锦鲤日报
        </span>
        <span className={friend}>
          <Avatar name="Ada Lovelace" size="xl" shape="square" />
          Ada Lovelace
        </span>
        <span className={friend}>
          <Avatar name="咕咕鸟" src={broken} size="xl" shape="square" />
          咕咕鸟
        </span>
      </div>
    </div>
  ),
};
