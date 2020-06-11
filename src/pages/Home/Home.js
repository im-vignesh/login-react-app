import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import { updateObject } from '../../shared/utility';

import { Redirect } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';

import styles from './Home.module.css';


class Home extends Component {
    state = {
        "fetched": false,
        "updated": false,
        "password": "",
        "phone_number": ""
    }
    componentDidMount() {
        const signed_in_via = localStorage.getItem("signed_in_via")
        if (!this.state.fetched) {
            console.log("executed only once")
            switch (signed_in_via) {
                case "github":
                    this.props.onFetchGithubDetails();
                    updateObject(this.state, { "fetched": true })
                    break;
                case 'linkedin':
                    this.props.onFetchLinkedInDetails();
                    updateObject(this.state, { "fetched": true })
                    break;
                default:
                    break;
            }
        }
        if (signed_in_via !== "basicauth" && !this.state.updated) {
            this.props.onUpdateUserDetails();
            return updateObject(this.state, { "updated": true })
        }
    }
    inputChangeHandler = (event) => {
        this.setState(updateObject(this.state, { [event.target.id]: event.target.value }));
    }
    onSetPasswordHandler = (event) => {
        event.preventDefault();
        this.props.onSetPassword(this.props.email, this.state.password);
        this.setState(updateObject(this.state, { "password": "" }));
    }
    onSetPhoneNumberHandler = (event) => {
        event.preventDefault();
        console.log("YOu clicke me fukcj")
        this.props.onSetPhoneNumber(this.props.id, this.state.phone_number);
        this.setState(updateObject(this.state, { "phone_number": "" }));
    }
    render() {
        let authRedirect = null;
        let changePassword = null;
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <p className={styles.Error}>{this.props.error}</p>
            );
        }
        if (!this.props.isAuthenticated) {
            console.log("let Me Reidrect you to home")
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }
        let body = null;
        if (this.props.loading) {
            console.log(this.props.loading_message);
            body = <div className={styles.Home}><p className={styles.LoadingMsg}>{this.props.loading_message}</p></div>
        } else {
            if (this.props.setPassword) {
                changePassword = (
                    <div>
                        <br /><br />
                        <Row>
                            <Col><label className={styles.ChangePasswordLabel}>Change Password</label></Col>
                            <Col><input className={styles.PasswordHolder} id="password" type="password" placeholder="Enter new password" onChange={this.inputChangeHandler} /></Col>
                            <Col><Button className={styles.ChangePasswordButton} onClick={e => this.onSetPasswordHandler(e)}>Change Password</Button></Col>
                        </Row>
                    </div>
                )
            }
            body = (
                <div className={styles.Home}>
                    <p className={styles.WelcomeMsg}>Hello {this.props.userName}</p> &nbsp;&nbsp;
                    <a href="/logout">Logout</a>
                    <br /><br />
                    <Row>
                        <Col><label className={styles.ChangePasswordLabel}>Change Phone No.</label></Col>
                        <Col><input className={styles.PhoneNumberHolder} id="phone_number" type="number" placeholder="Enter new Phone No." onChange={this.inputChangeHandler} /></Col>
                        <Col><Button className={styles.ChangePasswordButton} onClick={e => this.onSetPhoneNumberHandler(e)}>Change Phone No.</Button></Col>
                    </Row>
                    {changePassword}
                    {errorMessage}
                </div>
            )
        }
        return (
            <Fragment>
                {authRedirect}
                {body}
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        authRedirectPath: state.auth.authRedirectPath,
        id: state.user.id !== null ? state.user.id : state.auth.id,
        userName: state.user.username !== null ? state.user.username : state.auth.username,
        email: state.user.email !== null ? state.user.email : state.auth.email,
        setPassword: state.user.setPassword !== null ? state.user.setPassword : state.auth.setPassword,
        isAuthenticated: state.auth.token !== null,
        loading: state.user.loading,
        loading_message: state.user.loading_message,
        error: state.user.error,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // onTwitterLogin: () => dispatch(actions.authViaTwitter()),
        onFetchGithubDetails: () => dispatch(actions.fetchGithubDetails()),
        onFetchLinkedInDetails: () => dispatch(actions.fetchLinkedInDetails()),
        onUpdateUserDetails: () => dispatch(actions.UpdateUserInfo()),
        onSetPassword: (email, password) => dispatch(actions.setPassword(email, password)),
        onSetPhoneNumber: (id, phone_number) => dispatch(actions.setMobileNumber(id,phone_number))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
