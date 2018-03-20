import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Button, Form, Header, Input, Modal} from 'semantic-ui-react'
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
            markerCoordinates: '',
            coords: this.props.coords,
            experiences: '', 
            experience: '',
            display: false
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8080/getcoordinates')
            .then((res) => {
                this.setState({ markerCoordinates: res.data })
            })
        axios.get('http://localhost:8080/getexperiences')
            .then((res)=>{
                this.setState({experiences: res.data})
            })
    }
   
    componentWillReceiveProps(nextProps) {
        console.log(nextProps) 
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
        console.log(nextState.markerCoordinates)
        return nextState.userCoords !== this.state.userCoords || nextProps.user !== null || nextState.markerCoordinates!== this.state.markerCoordinates
    }

    componentDidUpdate(previousProps, previousState){
        if (previousState.userCoords !== this.state.userCoords){
            this.setState({userCoords: this.state.userCoords})
        }

    }




    //Code for the experience creation modal 
    titleInput = (e) =>{
        this.setState({title: e.target.value})
    }
    locationInput = (e) =>{
        this.setState({location: e.target.value})
    }
    detailsInput = (e) =>{
        this.setState({details: e.target.value})
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
                  markerCoordinates: this.state.markerCoordinates.concat(coords),
                  experiences: this.state.experiences.concat(coords)
                  
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

    // when marker is clicked 
    showExperience = (exp) => {
        let filter = this.state.experiences.filter((experience)=> (experience.location === JSON.stringify(exp.position)) ? experience: '')
        this.setState({experience: filter, display: true})
    }

    close = () =>{
        this.setState({display:false})
    }


    render() {
        
        
    let Markers = []
      if (this.state.markerCoordinates !== '') {
        Markers = this.state.markerCoordinates.map((coord, i)=>{
            return (<Marker key={i} position={coord} onClick={this.showExperience}/>)
        }) 
    }       
    const styles= {
        modal: {
            marginTop: '100px'
         },
        clock: {
            zIndex: 2
        },
        modal2: {
            marginTop:'100px',
            padding: '10px'
        },
        closeButton: {
            textAlign: 'right'
        },
        header:{
            textAlign: 'center'

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
                {!(this.state.experience === '') ? 
                <Modal style={styles.modal2} open={this.state.display} closeOnDimmerClick>
                        {/* <Modal.Actions style={styles.modalaction}> */}
                        <div style={styles.closeButton}>
                        <Button  onClick={this.close}>Close</Button> 
                        </div>
                        {/* </Modal.Actions> */}

                    <Modal.Header style={styles.header}>{this.state.experience[0].title}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Header>Time</Header>
                            <p>{this.state.experience[0].time}</p>    
                            <Header>Details</Header>
                            <p>{this.state.experience[0].details}</p>

                        </Modal.Description>
                    </Modal.Content>
                    
                </Modal>
                 : ''}
                        
               
                </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyA9pQUy3AG6PM-Gi-Jyz9MUiFgFl-UQ3SA'
})(MapContainer)

