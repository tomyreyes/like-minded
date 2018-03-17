import React, { Component } from 'react'
import { Button, Container, Icon } from 'semantic-ui-react'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            loggedIn: this.props.loggedIn,
            user: this.props.user
        }
    }
render(){
    


    return(
        <Container textAlign="center">
            <h1>Login</h1>
            <div><Button primary onClick={()=>{ this.props.login() }}>
                Login with <Icon name="facebook f" size="large" />
      </Button></div>
            <div><Button onClick={()=>{ this.props.googleLogin() }}>Login with <Icon color="red" name="google plus" size="large"/></Button></div>
        </Container>
    )
}
}

export default Login