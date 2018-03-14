import React, { Component } from 'react'
import './App.css'
import { MapContainer, Login } from './Components'
import { geolocated } from 'react-geolocated'
import { Route, Switch } from 'react-router-dom'
import { provider, auth } from './client';
import { Redirect } from 'react-router'
import firebase from 'firebase'



class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      loggedIn: false,
      loggedOut: false
    }
  }
    login = () => {
      const result = auth().signInWithPopup(provider)
      .then((result) => {
          this.setState({ user: result.user, loggedIn: true });

        })
  }

  logout=()=> {
    auth().signOut()
    .then(()=>{
    this.setState({ user: null, loggedOut: true });
      })
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log(user)
      if (user) {

      } else console.log('no user is signed in')
    });
  }

  


  render() {
    const { loggedIn } = this.state
    const { loggedOut } = this.state
    const { user } = this.state
    const { from } = '/'
    const { coords } = this.props
    const { reverse } = '/map'
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
          
        </header>
        <Switch>
          <Route exact path='/' render={(routeProps) => {
            return <Login user = { user } loggedIn = { loggedIn } 
            login = { this.login } logout = { this.logout }/>
          }} />
          <Route path='/map' render={(routeProps) => {
            return <MapContainer coords = { coords } user = { user } logout = { this.logout }/>
          }} />
        </Switch>
          {loggedIn && (
            <Redirect to={from || '/map'} />
          )}
          {loggedOut && (
            <Redirect to={reverse || '/'}/>
          )}
      </div>
    );
  }
}

export default geolocated(
  {
    positionOptions: {
      enableHighAccuracy: true
    }, 
    userDecisionTimeout: 5000,
    geolocationProvider: navigator.geolocation
}
)(App);
