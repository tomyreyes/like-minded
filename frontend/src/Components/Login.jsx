import React, { Component } from 'react'
import { Redirect } from 'react-router'
import firebase from 'firebase'
import { provider, auth } from '../client';


class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            fireRedirect: this.props.fireRedirect,
            user: this.props.user
        }
    }
    change = () =>{
        this.setState({fireRedirect: true})
    }
render(){
    
    const { from } = '/'
    const { user } = this.state
    const { fireRedirect } = this.state
    console.log(user)
    return(
        <div>
            <h1>Login</h1>
            <p>{user ? `Hi, ${user.displayName}!` : 'Hi!'}</p>
            <button onClick={this.props.login.bind(this)}>
                Login with Facebook
      </button>
            <button onClick={this.props.logout.bind(this)}>
                Logout
      </button>
      <button onClick={()=> this.change()}>pls</button>
            {fireRedirect && (
                <Redirect to={from || '/map'} />
            )}
        </div>
    )
}
}

export default Login