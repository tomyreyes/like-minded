import React, { Component } from 'react'
import { Redirect } from 'react-router'
import firebase from 'firebase'
import { provider, auth } from '../client';


class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            loggedIn: this.props.loggedIn
            ,
            user: this.props.user
        }
    }
render(){
    
    const { user } = this.state
    const { loggedIn } = this.state

    return(
        <div>
            <h1>Login</h1>
            <button onClick={()=>{this.props.login()}}>
                Login with Facebook
      </button>
            <button onClick={()=>{this.props.logout()}}>
                Logout
      </button>
           
        </div>
    )
}
}

export default Login