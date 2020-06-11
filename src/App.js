import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Login from './pages/Login/Login';
import Logout from './pages/Login/Logout/Logout';
import Home from './pages/Home/Home';
import AllUsers from './pages/User/AllUser';
import UserInfo from './pages/User/UserInfo';

import * as actions from './store/actions/index';

class App extends Component {

  componentDidMount () {
    this.props.onTryAutoSignup();
  }

  render() {
    console.log("Is Authenticated:"+ this.props.isAuthenticated)
    let routes = (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout}/>
        <Route path="/user/all" component={AllUsers}/>
          <Route path="/user"  exact component={UserInfo}/>
          <Route path="/home" component={Home}/>
        <Redirect to="/login"/>
      </Switch>
    );
    return (
      <div>
        {routes}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch( actions.authCheckState() )
  };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );