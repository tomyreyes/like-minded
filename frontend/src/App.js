import React, { Component } from 'react'
import './App.css'
import { MapContainer, Login } from './Components'
import { geolocated } from 'react-geolocated'
import { Route } from 'react-router-dom'
import { provider, auth } from './client';
import { Redirect } from 'react-router'



class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      fireRedirect: false
    }
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }
  async login() {
    const result = await auth().signInWithPopup(provider)
    this.setState({ user: result.user, fireRedirect: true });
  }
  
  async logout() {
    await auth().signOut()
    this.setState({ user: null });
  }
  
  // async componentWillMount() {
  //   const user = await auth().onAuthStateChanged();
  //   if (user) this.setState({ user })
  // }

  render() {
    const { fireRedirect } = this.state
    const { user } = this.state
    const { from } = '/'
    const { coords } = this.props
    console.log(user)
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
          
        </header>
        <Route exact path='/' render={(routeProps) => {
          return <Login user = { user } fireRedirect = { fireRedirect } 
          login = { this.login } logout = { this.logout }/>
        }} />
        <Route path='/map' render={(routeProps) => {
          return <MapContainer coords = { coords } user = { user }/>
        }} />
        {fireRedirect && (
          <Redirect to={from || '/map'} />
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
