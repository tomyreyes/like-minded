import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
class MapContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            userCoords: {lat: 49.2193, lng: -122.5984},
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
    
    render() {  
        const { user } = this.props
        const { userCoords } = this.state
        console.log(user)

    
        return ( 
            <div>
                <p>{user ? `Hi, ${user.displayName}!` : 'Hi!'}</p>
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

