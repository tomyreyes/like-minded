import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import firebase from 'firebase'
class MapContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            userCoords: {lat: 49.2193, lng: -122.5984},
            user: this.props.user
        }
    }
   
    componentWillReceiveProps(nextProps) {
        if(this.props.coords !== nextProps.coords){
            let newCoords = {
                lat: nextProps.coords.latitude,
                lng: nextProps.coords.longitude
            }
            this.setState({userCoords: newCoords})
        } else {
            this.setState({userCoords: {lat: 49.2193, lng: -122.5984}})
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextState.userCoords !== this.state.userCoords || nextProps.user !== null  
    }
    componentDidMount() {
        const logged = firebase.auth().currentUser;
        this.setState({user: logged})
        firebase.auth().onAuthStateChanged(function (user) {
            console.log(user)
            if (user) {
                console.log('a current user is signed in')
                
            } else console.log('no user is signed in')
        });
    }
    
    render() {  
        const  user  = firebase.auth().currentUser
        console.log(user)
        const { userCoords } = this.state
        
        return ( 
            <div>
                <p>{user ? `Hi, ${user.displayName}!` : 'Hi!'}</p>
                {user ? <img src={user.photoURL}></img> : ''}
                <button onClick={()=>{this.props.logout()}}>logout</button>
            <div>
                <Map 
                google={this.props.google} 
                center={{
                    lat: userCoords.lat,
                    lng: userCoords.lng
                }} 
                zoom={14}/>
                
                </div>
                </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDaGmvK3oulGREetWMIgTpz0RO9U6Ctg_U'
})(MapContainer)

