export type Template = {
  pageSize: string;
  pageOrientation: string;
  fontSizes: {
    heading: number;
    leading: number;
    subheading: number;
    caption: number;
    paragraph: number;
    subtext: number;
  };
  colors: {
    black: any;
    blue: any;
  };
};
