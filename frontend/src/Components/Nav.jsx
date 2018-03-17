import React, { Component } from 'react'
import { Menu, Segment, Button } from 'semantic-ui-react'
import firebase from 'firebase'


class Nav extends Component {
    state = { activeItem: 'home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    componentDidMount() {
        const logged = firebase.auth().currentUser;
        this.setState({ user: logged })
        firebase.auth().onAuthStateChanged(function (user) {
            console.log(user)
            if (user) {
                console.log('a current user is signed in')

            } else console.log('no user is signed in')
        });
    }

    render() {
        const { activeItem } = this.state
        const user = firebase.auth().currentUser

        return (
            <Segment inverted>
                <Menu inverted pointing secondary>
                    <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
                    <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick} />
                    <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.handleItemClick} />
                    <Menu.Menu position='right'>
                     {user ? <Menu.Item name={user.displayName}/>: '' }
                    {user ? <Menu.Item onClick={()=> { this.props.logout() }}><Button>Logout</Button> </Menu.Item> : ''}
                    </Menu.Menu>
                </Menu>
            </Segment>
        )
    }
}

export default Nav