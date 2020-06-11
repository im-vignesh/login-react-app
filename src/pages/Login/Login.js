import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Form, FormGroup, Input, Button, InputGroup, InputGroupText, InputGroupAddon } from 'reactstrap';

import { Redirect } from 'react-router-dom';
import { updateObject } from '../../shared/utility';
import * as actions from '../../store/actions/index';
import styles from './Login.module.css';
import queryString from 'query-string';

import {
  faUserCircle,
  faKey
} from '@fortawesome/free-solid-svg-icons';

import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  componentDidMount() {
    const values = queryString.parse(this.props.location.search)
    switch (values.medium) {
      case "github":
        this.props.onGithubLogin(values.code)
        break;
      case "linkedin":
        this.props.onLinkedInLogin(values.code)
        break;
      default:
        break;
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onAuth(this.state.username,this.state.password);
  }

  inputChangedHandler = event => {
    this.setState(updateObject( this.state, {[event.target.id]: event.target.value}));
  }

  onClickTwitter = event => {
    event.preventDefault();
    this.props.onTwitterLogin();
  }

  handlePopUp(event, url) {
    event.preventDefault();
    window.open(url, 'popup', 'width=600,height=600,toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no');
    return false;
  }

  render() {
    let errorMessage = null;
    if ( this.props.error ) {
      errorMessage = (
          <p className={styles.Error}>{this.props.error}</p>
      );
  }

    let authRedirect = null;
    if ( this.props.isAuthenticated ) {
        authRedirect = <Redirect to={this.props.authRedirectPath} />
    }

    let body = null;
    if (this.props.loading) {
      body = "Authenticating.....";
    } else {
      body = (
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row>
            <Col md={{ size: 5 }}>
              <Card body className={styles.Auth} outline color="primary">
                <br />
                <FormGroup row>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><FontAwesomeIcon icon={faUserCircle} /></InputGroupText>
                    </InputGroupAddon>
                    <Input id="username" type="text" placeholder="User Name" onChange={this.inputChangedHandler} />
                  </InputGroup>
                </FormGroup>
                <FormGroup row>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><FontAwesomeIcon icon={faKey} /></InputGroupText>
                    </InputGroupAddon>
                    <Input id="password" type="password" placeholder="Password" onChange={this.inputChangedHandler} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <span>SignIn Via: </span>
                  <a
                    href="https://github.com/login/oauth/authorize?scope=user:email&client_id=b8abeaff4fc40acf7bec"
                    target="popup"
                    onClick={(e) => { this.handlePopUp(e, "https://github.com/login/oauth/authorize?scope=user:email&client_id=b8abeaff4fc40acf7bec") }}><FontAwesomeIcon icon={faGithub} /> Github</a> &nbsp;
                  <a
                    href="https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86l6pvr93njbqg&redirect_uri=https://login-app-react-web.herokuapp.com/login?medium=linkedin&state=d33781d77472211740e75992a4b449f9369dd806&scope=r_liteprofile%20r_emailaddress"
                    target="popup"
                    onClick={(e) => { this.handlePopUp(e, "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86l6pvr93njbqg&redirect_uri=https%3A%2F%2Flogin-app-react-web.herokuapp.com%2Flogin%3Fmedium%3Dlinkedin&state=d33781d77472211740e75992a4b449f9369dd806&scope=r_liteprofile%20r_emailaddress") }}><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</a> &nbsp;
              </FormGroup>
                {errorMessage}
                <center><Button color="primary" disabled={this.props.isLoading} type="submit">Sign In</Button></center>
              </Card>
            </Col>
          </Row>
        </Form>
      )
    }
    return (
      <Fragment>
        {authRedirect}
        {body}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    authRedirectPath: state.auth.authRedirectPath,
    isAuthenticated: state.auth.token !== null,
    loading: state.auth.loading,
    error: state.auth.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTwitterLogin: () => dispatch(actions.authViaTwitter()),
    onGithubLogin: (code) => dispatch(actions.authViaGithub(code)),
    onLinkedInLogin: (code) => dispatch(actions.authViaLinkedIn(code)),
    onAuth: (username, password) => dispatch(actions.auth(username, password))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
