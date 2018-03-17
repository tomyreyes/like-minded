import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Button, Form, Input, Modal} from 'semantic-ui-react'
import TimePicker from 'react-time-picker'


class MapContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            userCoords: {lat: 49.2193, lng: -122.5984},
            user: this.props.user,
            userInput: '',
            title: '',
            location: '',
            description:'',
            time: new Date(),
            duration: ''
            
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


    
    
    titleInput = (e) =>{
        this.setState({title: e.target.value})
    }
    locationInput = (e) =>{
        this.setState({location: e.target.value})
    }
    descriptionInput = (e) =>{
        this.setState({description: e.target.value})
        console.log(e.target.value)
    }
    onChange = time => this.setState({ time }) 

    durationInput = (e) =>{
        this.setState({duration: e.target.value})
    }

    create = () =>{
        
    }


    render() {

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
                    <Modal.Header textAlign="center">Create an Experience</Modal.Header>
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
                            <Form.TextArea label='Description' value={this.state.description} onChange={this.descriptionInput} />
                            <Button primary onClick={this.create}>Create</Button>
                            </Form>
                            
                            </div>


                    </Modal.Content>
                </Modal>



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

