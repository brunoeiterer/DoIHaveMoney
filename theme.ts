import { Anchor, createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'indigo',
  primaryShade: 6,
  defaultRadius: 'md',
  components: {
    Link: {
      styles: { '&:hover': {textDecoration: 'none !important'} },
    },
  },
});