import React, { Component } from 'react'
import './App.css'
import { MapContainer, Login } from './Components'
import { geolocated } from 'react-geolocated'
import { Route } from 'react-router-dom'
import { provider, auth } from './client';



class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      fireRedirect: false
    }
  }
  async login() {
    const result = await auth().signInWithPopup(provider)
    this.setState({ user: result.user, fireRedirect: true });
  }

  async logout() {
    await auth().signOut()
    this.setState({ user: null });
  }

  render() {
    const { fireRedirect } = this.state
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
          
        </header>
        <Route exact path='/' render={(routeProps) => {
          return <Login user = { this.state.user } fireRedirect = { this.state.fireRedirect } login = { this.login } logout = { this.logout }/>
        }} />
        <Route path='/map' render={(routeProps) => {
          return <MapContainer coords = {this.props.coords} user = {this.state.user}/>
        }} />
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
