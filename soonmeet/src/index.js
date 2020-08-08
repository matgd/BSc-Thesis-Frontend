import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import DateFnsUtils from '@date-io/date-fns';

import App from './components/App';
import reducers from './reducers';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import gbLocale from 'date-fns/locale/en-GB';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);

ReactDOM.render(
  <MuiPickersUtilsProvider utils={DateFnsUtils}
    locale={gbLocale}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiPickersUtilsProvider>,
  document.querySelector('#root')
);
