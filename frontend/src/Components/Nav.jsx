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

        const styles = {
            seg: {
                margin: '0'
            }, 
            brand: {
                flex: 1,
                textAlign: 'center'

            },
            logout:{
                position: 'absolute',
                right: 0,
                flex: 1,
                zIndex: 1000000

            }
        }

        return (
            <Segment inverted style={styles.seg}>
                <Menu inverted pointing secondary>
                    <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
                    <Menu.Menu position="right" style={styles.logout}>
                     {user ? <Menu.Item name={user.displayName}/>: <Menu.Item/> }
                        {user ? <Menu.Item onClick={() => { this.props.logout() }}><Button color='violet'>Logout</Button> </Menu.Item> : <Menu.Item />}
                    </Menu.Menu>
                </Menu>
            </Segment>
        )
    }
}

export default Nav