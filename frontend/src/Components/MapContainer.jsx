import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Button, Form, Input, Modal} from 'semantic-ui-react'
import TimePicker from 'react-time-picker'
import axios from 'axios'
import firebase from 'firebase'

class MapContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            userCoords: {lat: 49.2193, lng: -122.5984},
            user: this.props.user,
            userInput: '',
            title: '',
            location: '',
            details:'',
            time: new Date(),
            duration: '',
            markerCoordinates: ''
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8080/getcoordinates')
            .then((res) => {
                this.setState({ markerCoordinates: res.data })
            })
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
        return nextState.userCoords !== this.state.userCoords || nextProps.user !== null || nextState.coords !== this.state.coords
    }





    titleInput = (e) =>{
        this.setState({title: e.target.value})
    }
    locationInput = (e) =>{
        this.setState({location: e.target.value})
    }
    detailsInput = (e) =>{
        this.setState({description: e.target.value})
    }
    onChange = time => this.setState({ time }) 

    durationInput = (e) =>{
        this.setState({duration: e.target.value})
    }

    create = () =>{
        let currentEmail = firebase.auth().currentUser.email
        axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.userCoords.lat},${this.state.userCoords.lng}&radius=50000&keyword=${this.state.location}&key=AIzaSyDK5cgjI7DpnkOJrbLuXUcx6FA2KPl72Jw`)
        .then((res) => {
            
            let coords = res.data.results[0].geometry.location
            this.setState(
                { title: this.state.title, 
                  time: this.state.time,
                  duration: this.state.duration, 
                  details: this.state.details,
                  location: coords,
                  markerCoordinates: this.state.markerCoordinates.concat(coords)
                   }
                )
            axios.post('http://localhost:8080/addexperience',{

                title: this.state.title,
                time: this.state.time,
                duration: this.state.duration,
                details: this.state.details,
                location: this.state.location,
                email: currentEmail
            })
        })

    }

    render() {
    let Markers 
      if (this.state.markerCoordinates !== '') {
        Markers = this.state.markerCoordinates.map((coord, i)=>{
            return (<Marker key={i} position={coord}/>)
        }) 
    }       
    const styles= {
        modal: {
            marginTop: '100px'
         },
        clock: {
            zIndex: 2
        }  
    }
        const { userCoords } = this.state
        
        return ( 
            <div>
                <Input placeholder='Enter Location' onChange={this.handleInput}></Input>
                

                <Modal style = {styles.modal} trigger={<Button>Create</Button>}>
                    <Modal.Header >Create an Experience</Modal.Header>
                    <Modal.Content>
                        <div>
                            <Form>
                            <Form.Input label='Title:' value={this.state.title} onChange={this.titleInput} />
                            <Modal style = {styles.modal} trigger={<Button>Set Time</Button>}>
                                <TimePicker
                                    onChange={this.onChange}
                                    value={this.state.time}/>
                           </Modal>
                            <Form.Input label='Duration' value={this.state.duration} type="number" onChange={this.durationInput} />
                            <Form.Input label='Location' value={this.state.location} onChange={this.locationInput} />
                            <Form.TextArea label='Description' value={this.state.description} onChange={this.detailsInput} />
                            <Button primary onClick={this.create}>Create</Button>
                            </Form>
                            
                            </div>


                    </Modal.Content>
                </Modal>
                {!(this.state.markerCoordinates === '') ? <div>
                    <Map
                        google={this.props.google}
                        center={{
                            lat: userCoords.lat,
                            lng: userCoords.lng
                        }}
                        zoom={14}>
                        { Markers }

                    </Map>
                </div>
                    : <div>
                        <Map
                            google={this.props.google}
                            center={{
                                lat: userCoords.lat,
                                lng: userCoords.lng
                            }}
                            zoom={14}>

                        </Map>
                    </div> }
                </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDaGmvK3oulGREetWMIgTpz0RO9U6Ctg_U'
})(MapContainer)

