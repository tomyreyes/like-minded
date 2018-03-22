import React, { Component } from 'react'
import { Button, Card, Container, Icon, Image } from 'semantic-ui-react'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            loggedIn: this.props.loggedIn,
            user: this.props.user
        }
    }
render(){
    const styles = {
        paddingLeft: '10px',
        color: 'white'
    }
    return(
        <Card fluid>
        <Container textAlign="center">

            <Image src="logo.png"/>
            <h1>Enjoys experiences with others.</h1>
            {/* <div><Button primary onClick={()=>{ this.props.login() }}>
                Login with <Icon name="facebook f" size="large" />
      </Button></div> */}
            <div><Button color="red" onClick={()=>{ this.props.googleLogin() }}>Login with<Icon style={styles}name="google plus" size="big"/></Button></div>
        </Container>
        </Card>
    )
}
}

export default Login