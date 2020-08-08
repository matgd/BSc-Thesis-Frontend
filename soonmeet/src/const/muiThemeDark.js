import { createMuiTheme } from '@material-ui/core';
import { PRIMARY_COLOR } from './colors';

const darkMuiTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: PRIMARY_COLOR
    }
  },
});

export default darkMuiTheme;
