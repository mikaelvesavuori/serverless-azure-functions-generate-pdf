import { rgb } from 'pdf-lib';

export const template = {
  pageSize: 'A4',
  pageOrientation: 'portrait',
  fontSizes: {
    heading: 36,
    leading: 28,
    subheading: 24,
    caption: 18,
    paragraph: 16,
    subtext: 12
  },
  colors: {
    black: rgb(0.05, 0.05, 0.05),
    blue: rgb(0, 0.53, 0.71)
  }
};
