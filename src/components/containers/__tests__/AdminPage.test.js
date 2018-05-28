import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from 'components/containers/App';
import { ServiceProvider, IAuthService, AuthServiceMock, ServiceManager, ConfigServiceProvider, HttpServiceInterface, HttpServiceProvider, ManagedServiceServiceMock, ErrorService } from 'services';
import { THEME } from 'common/constants';

import { mount, shallow } from 'enzyme';
import AdminPage from 'components/containers/AdminPage';


describe('AdminPage', () => {
  let serviceManager;
  beforeAll(() => {
    serviceManager = new ServiceManager();
    serviceManager.registerService(ErrorService);
    serviceManager.registerService(ConfigServiceProvider, null);
    serviceManager.registerService(HttpServiceProvider);
    serviceManager.registerService(AuthServiceMock);
    serviceManager.registerService(ManagedServiceServiceMock);
    
    //auth.login("none");
  });

  it('renders AdminPage with admin user and no props', () => {
    const auth = serviceManager.getService(IAuthService);
    auth.login("none");
    const wrapper = mount(
      <ServiceProvider serviceManager={serviceManager}>
        <MuiThemeProvider  muiTheme={THEME}>
          <AdminPage />
        </MuiThemeProvider>
      </ServiceProvider>,
    );
  });
});

