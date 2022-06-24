import { Provider } from 'react-redux';
import configureStore from './config/configureStore';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import ScrollToTop from './utils/ScrollToTop';
import Routes from './Routes';
import './assets/base.scss';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/">
        <CssBaseline />
        <ScrollToTop>
          <Routes />
        </ScrollToTop>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
