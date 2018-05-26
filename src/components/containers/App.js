import React, { Component } from 'react';
import Header from './Header';
import 'assets/css/App.css';

import {Router, Switch, Route, Redirect} from 'react-router';
import AdminPage from './AdminPage';
import LoginView from './LoginView';
import ServiceForm from 'components/containers/ServiceForm/ServiceForm';
import ServiceEditForm from 'components/containers/ServiceForm/ServiceEditForm';
import DetailView from './DetailView';
import { IAuthService, mapAndConnect, ErrorService } from 'services';
import Snackbar from 'material-ui/Snackbar';

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: null
    }
    this.doRedirect = false;
  }

  componentDidMount(){
    let authSub = this.props.auth.onUserChange().subscribe(user => {
      this.setState({
        redirect: user ? "/services" : "/login",
        user: user
      });
      this.doRedirect = true;
    })
    this.props.error.getErrorEvents("FATAL").subscribe( (errorEvent) => {
      this.props.auth.logout();
      this.setState({
        showErrorSnack: true,
        lastError: errorEvent.description
      });
    })
  }

  componentWillUnmount(){
    this.authSub.unsubscribe();
  }

  hideError(){
    this.setState({
      showErrorSnack: false
    });
  }

  render() {

    let redirect = this.doRedirect ? <Redirect to={this.state.redirect} /> : null;
    this.doRedirect = false;
    return (
      <div>
      <Switch>
        <Route path="/login" exact={true} render={(props) => {
          return (
            <LoginView {...props} />
          );
        }}/>
        <Route path='/' component={(props) => {
          return (
            <div>
              <Route path='/' exact render={() => <Redirect from="/" to="/login" />} />
              <Route path='/' render={(props) => <Header user={this.state.user} {...props} />} />
              <Switch>
                <Route path='/services' exact={true} render={(props) => <AdminPage user={this.state.user} {...props} />}/>
                <Route path= '/services/new' exact={true} render={(props) => <ServiceForm {...props} />}/>
                <Route path= '/services/edit/:id' exact={true} render={(props) => <ServiceEditForm {...props} />}/>
                <Route path= '/services/:id' exact={true} render={(props) => <DetailView user={this.state.user} {...props} />}/>
              </Switch>
            </div>
          );
        }}/>
      </Switch>
      {redirect}

        <Snackbar
          open={this.state.showErrorSnack}
          message={this.state.lastError}
          autoHideDuration={4000}
          onRequestClose={() => this.hideError()}
        />

      </div>

    )
  }
}


export default mapAndConnect(App, {
  auth: IAuthService,
  error: ErrorService
})
