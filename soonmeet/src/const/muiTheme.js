import { createMuiTheme } from '@material-ui/core';
import { PRIMARY_COLOR } from './colors';

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR
    },
    secondary: {
      main: '#FF0000'
    },
    error: {
      main: '#FF0000'
    }
  }
});

export default muiTheme;