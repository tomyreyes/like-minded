import React, { Component } from 'react'
import './App.css'
import { MapContainer, Login, Nav } from './Components'
import { geolocated } from 'react-geolocated'
import { Route, Switch } from 'react-router-dom'
import { auth, gmail } from './client';
import { Redirect } from 'react-router'
import firebase from 'firebase'
import axios from 'axios'




class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      loggedIn: false,
      loggedOut: false
    }
  }
  
  googleLogin = () =>{
    const result = auth().signInWithPopup(gmail)
    .then((result)=>{
      this.setState({user: result.user, loggedIn: true, loggedOut: false})
      axios.post('http://localhost:8080/adduser', {
        email: firebase.auth().currentUser.email,
        displayName: firebase.auth().currentUser.displayName
      })
    }).catch(error => {
      console.log(error)
    })
  }

  logout=()=> {
    auth().signOut()
    .then(()=>{
    this.setState({ user: null, loggedOut: true, loggedIn: false });
      })
  }
  render() {
    const { loggedIn } = this.state
    const { loggedOut } = this.state
    const { user } = this.state
    const { from } = "/"
    const { coords } = this.props
    const { reverse } = "/map"

    const styles = {
      brand: {
        position: "absolute",
        height: "50px",
        width: "100%",
        zIndex: 1,
        textAlign: "center",
        color: "white",
        paddingTop: "14px"
      }
    }
    
    return (
      <div>
        <div style={styles.brand}><h1>Like-Minded</h1></div>
       <Nav user = { user } logout = { this.logout }/>
        
        <Switch>
          <Route exact path="/" render={(routeProps) => {
            return <Login user = { user } loggedIn = { loggedIn } 
            login = { this.login } logout = { this.logout } googleLogin = { this.googleLogin }/>
          }} />
          <Route path="/map" render={(routeProps) => {
            return <MapContainer coords = { coords } handleInput = { this.handleInput } />
          }} />
        </Switch>
          {(loggedIn && coords !=="") && (
            <Redirect to={from || "/map"} />
          )}
          {loggedOut && (
            <Redirect to={reverse || "/"}/>
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
    userDecisionTimeout: 10000,
    geolocationProvider: navigator.geolocation
}
)(App);
