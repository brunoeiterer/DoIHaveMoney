import { CSSVariablesResolver } from '@mantine/core';

export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-color-body': 'var(--background)',
    '--mantine-color-text': 'var(--foreground)',
  },
  light: {
    '--mantine-color-anchor': 'var(--primary)',
  },
  dark: {
    '--mantine-color-anchor': 'var(--primary)',
  },
});