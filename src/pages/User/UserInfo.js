import React, {Component, Fragment} from 'react';
import login_axios from '../../login-axios';
import { Table } from 'reactstrap';


class UserInfo extends Component {
    state = {
        "user":null
    }
    componentDidMount() {
        if (this.state.user == null) {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const id= urlParams.get('id')
            login_axios.get("/user?id="+id).then(res =>{
                var newState = {
                    "user":res.data
                }
                this.setState(newState)
            }
            ).catch(err => console.log(err));
        }
    }
    render(){
        let userInfo = "no Useerrr";
        if (this.state.user) {
            userInfo = (<Table>
                <tbody>
                    <tr><th>ID</th><td>{this.state.user.id}</td></tr>
                    <tr><th>Name</th><td>{this.state.user.name}</td></tr>
                    <tr><th>Email ID</th><td>{this.state.user.email}</td></tr>
                    <tr><th>Phone Number</th><td>{this.state.user.phone_number === "" ? "N/A": this.state.user.phone_number}</td></tr>
                    <tr><th>Meta Data</th><td>{JSON.stringify(this.state.user.metadata,null,2)}</td>
                    </tr>
                </tbody>
            </Table>)
        }
        return(
            <Fragment>
                {userInfo}
            </Fragment>
        )
    }
}

export default UserInfo;