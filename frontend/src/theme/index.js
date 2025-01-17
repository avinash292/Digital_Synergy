import { createTheme, responsiveFontSizes } from '@material-ui/core';

import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const theme = responsiveFontSizes(
  createTheme({
    palette,
    layout: {
      contentWidth: 1140,
    },
    /* typography: {
      fontFamily: 'Lato',
    }, */
    typography,
    zIndex: {
      appBar: 1200,
      drawer: 1100,
    },
    overrides: {
      ...overrides,
      MuiButton: {
        containedSecondary: {
          color: 'white',
        },
      },
    },
  }),
);

export default theme;
