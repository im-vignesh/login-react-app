import React,{Component, Fragment} from 'react';
import login_axios from '../../login-axios';
import {Row,Col,Form,Table,Input,InputGroup,InputGroupAddon,Button} from 'reactstrap';
import styles from './AllUser.module.css';
import { updateObject } from '../../shared/utility';

class AllUsers extends Component {
    state = {
        "users" : null,
        "phone_number":null
    }

    componentDidMount(){
        if (this.state.users == null) {
            login_axios.get("/user/all").then(res =>{
                    var newState = {
                        "users":res.data
                    }
                    this.setState(newState)
                }
            ).catch(err => console.log(err));
        }
    }

    inputChangedHandler = event => {
        this.setState(updateObject( this.state, {[event.target.id]: event.target.value}));
      }

    onSearchClicked = (e) => {
        e.preventDefault();
        let url = ""
        if(this.state.phone_number === "" || this.state.phone_number == null) {
            url="/user/all"
        } else {
            url="/user/search?q="+this.state.phone_number+"&based_on=phone_no"
        }
        login_axios.get(url).then(res =>{
            var newState = {
                "users":res.data
            }
            this.setState(newState)
        }
        ).catch(err => console.log(err));
    }
    render() {
        let userTable = "No Users";
        if(this.state.users) {
            userTable = (<Table>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email ID </th>
                    <th>Phone Number</th>
                    <th>Meta</th>
                    </tr>
                </thead>
                <tbody>
            {this.state.users.map(user=>{
                const href = "/user?id="+user.id
                return (<tr key={user.id}><th scope="row"><a href={href}>{user.id}</a></th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone_number === ""? "N/A": user.phone_number}</td>
                <td>{JSON.stringify(user.metadata,null,2)}</td>
                </tr>)
            })}
                </tbody>
                </Table>)
        }
        return (
            <Fragment>
                <Row className={styles.SearchBox}>
                    <Col xs={{size:9,offset:2}} lg={{size:3,offset:5}}>
                    <Form onSubmit={this.onSearchClicked}>
                    <InputGroup>
                        <Input id="phone_number" className={styles.SearchBoxTextInput} type="number" placeholder="Enter phone number to search user" value={this.state.phone_number} onChange={this.inputChangedHandler} />
                        <InputGroupAddon addonType="append">
                            <Button type="submit" color="primary" className={styles.searchButton}>Search</Button>
                        </InputGroupAddon>
                    </InputGroup>
                    </Form>
                </Col>
                </Row>
                <br/>
                {userTable}
            </Fragment>
        )
    }
}

export default AllUsers;