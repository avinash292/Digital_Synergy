import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import AOS from 'aos';
import { Provider } from 'react-redux'

import './assets/scss/index.scss';
import theme from './theme';
import Routes from './Routes';
import store from './redux/store';

import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'aos/dist/aos.css';


const App = () => {
  AOS.init({
    once: true,
    delay: 50,
    duration: 500,
    easing: 'ease-in-out',
  });

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
			<Provider store={store}>
        <Paper>
          <Routes />
        </Paper>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
