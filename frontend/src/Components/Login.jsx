import React, { Component } from 'react'
import { Button, Container, Icon, Image } from 'semantic-ui-react'

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
        icon :{
        paddingLeft: '10px',
        color: 'white'
        }, 
        container : {
            textAlign: 'center',
            paddingTop: '80px'
        },
        logo : {
            paddingLeft: '70px'
        }
    }
    return(
        
        <Container style={styles.container}>
            <Image style={styles.logo} src="logo.png"/>
            <h1>Enjoys experiences with others.</h1>
            <div><Button color="red" onClick={()=>{ this.props.googleLogin() }}>Login with<Icon style={styles.icon}name="google plus" size="big"/></Button></div>
        </Container>
    )
}
}

export default Login