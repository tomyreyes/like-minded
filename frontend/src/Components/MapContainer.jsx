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
            display: false,
            placeName: '',
            max: '',
            currentUser:''
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
        if(this.props.coords !== nextProps.coords){
            let newCoords = {
                lat: nextProps.coords.latitude,
                lng: nextProps.coords.longitude
            }
            this.setState({userCoords: newCoords, currentUser: firebase.auth().currentUser.displayName})
        } else {
            this.setState({userCoords: {lat: 49.2193, lng: -122.5984}})
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return nextState.userCoords !== this.state.userCoords || nextProps.user !== null || nextState.markerCoordinates!== this.state.markerCoordinates
    }
    componentDidUpdate(previousProps, previousState){
        if (previousState.userCoords !== this.state.userCoords){
            this.setState({userCoords: this.state.userCoords})
        }
        if (previousState.location !== this.state.location) {
            this.setState({experiences: this.state.experiences})
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
    maxInput = (e) =>{
        this.setState({max: e.target.value})
    }
    create = () =>{
        let currentEmail = firebase.auth().currentUser.email
        let currentUser = firebase.auth().currentUser.displayName
        this.setState({placeName: this.state.location, currentUser: currentUser})
        axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.userCoords.lat},${this.state.userCoords.lng}&radius=50000&keyword=${this.state.location}&key=AIzaSyDK5cgjI7DpnkOJrbLuXUcx6FA2KPl72Jw`)
        .then((res) => {
            let coords = res.data.results[0].geometry.location
            this.setState(
                { title: this.state.title, 
                  time: this.state.time,
                  duration: this.state.duration, 
                  details: this.state.details,
                  placeName: this.state.placeName,
                  location: coords,
                  markerCoordinates: this.state.markerCoordinates.concat(coords),
                  participants: this.state.currentUser
                   },()=>{
                       console.log(this.state.participants)
                       let newExpObj = {
                           title: this.state.title,
                           time: JSON.stringify(this.state.time),
                           duration: this.state.duration,
                           details: this.state.details,
                           location: JSON.stringify(this.state.location),
                           placeName: this.state.placeName,
                           max: this.state.max,
                           participants: this.state.currentUser
                       }
                       this.setState({experiences: this.state.experiences.concat(newExpObj)})
                   }
                )
            axios.post('http://localhost:8080/addexperience',{

                title: this.state.title,
                time: this.state.time,
                duration: this.state.duration,
                details: this.state.details,
                location: this.state.location,
                email: currentEmail,
                max: this.state.max, 
                placeName: this.state.placeName,
                participants: this.state.currentUser
            })
        })

    }

    // Experience Modal
    showExperience = (exp) => {
        let filter = this.state.experiences.filter((experience)=> (experience.location === JSON.stringify(exp.position)) ? experience: '')
        this.setState({experience: filter, display: true})
    }

    close = () =>{
        this.setState({display:false})
    }

    join = () => {
        axios.get('http://localhost:8080/getexperiences')
            .then((res)=>{
                this.setState({experiences: res.data})
            }), ()=>{
                let filter = this.state.experiences.filter((experience)=> (experience))
            }
            
        // this.setState(
        //     {
        //         participants:
        //         // participants: this.state.experiences[0].participants.concat('hi')
        //     }
        // )
    }



    render() { 
        console.log(this.state.participants)   
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
                            <Form.Input label='Max participants' value={this.state.max} onChange={this.maxInput} />
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
                        <div style={styles.closeButton}>
                        <Button  onClick={this.close}>Close</Button> 
                        </div>
                    <Modal.Header style={styles.header}>{this.state.experience[0].title}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Header>Time</Header>
                            <p>{this.state.experience[0].time}</p>    
                            <Header>Details</Header>
                            <p>{this.state.experience[0].details}</p>
                            <Header>Max Participants</Header>
                            <p>{this.state.experience[0].max}</p>
                            <Header>People Attending</Header>
                            <p>{this.state.experience[0].participants}</p>
                        </Modal.Description>
                    </Modal.Content>
                    <Button onClick={this.join}>Join</Button>
                </Modal>
                 : ''}
                </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyA9pQUy3AG6PM-Gi-Jyz9MUiFgFl-UQ3SA'
})(MapContainer)

