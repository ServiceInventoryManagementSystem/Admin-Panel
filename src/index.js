import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import App from 'components/containers/App';
import { ServiceProvider, ConfigServiceProvider } from 'services';
import { AuthServiceProvider, ServiceManager, HttpServiceInterface,HttpServiceProvider, ManagedServiceServiceProvider, ErrorService } from 'services';
import { THEME } from 'common/constants';
const serviceManager = new ServiceManager();

serviceManager.registerService(ErrorService);
serviceManager.registerService(ConfigServiceProvider, null, localStorage);
serviceManager.registerService(HttpServiceProvider);
serviceManager.registerService(AuthServiceProvider);
serviceManager.registerService(ManagedServiceServiceProvider);

let history;
if(process.env.ELECTRON){
  // required when not running a server for routes to work properly
  history = createHashHistory();
}else{
  history = createBrowserHistory();
}



ReactDOM.render(
  <ServiceProvider serviceManager={serviceManager}>
    <MuiThemeProvider  muiTheme={THEME}>
      <Router history = {history}>
        <App/>
      </Router>
    </MuiThemeProvider>
  </ServiceProvider>,
  document.getElementById('root')
);