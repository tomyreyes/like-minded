import React, { Component } from 'react'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import { Button, Dimmer, Form, Header, Input, Loader, Modal, Segment } from 'semantic-ui-react'
import axios from 'axios'
import firebase from 'firebase'
import Search from './Search'
import CreateExperience from './CreateExperience'

const googleAPI = 'AIzaSyDK5cgjI7DpnkOJrbLuXUcx6FA2KPl72Jw'
class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userCoords: { lat: 49.2193, lng: -122.5984 },
      user: this.props.user,
      userInput: '',
      title: '',
      location: '',
      details: '',
      time: new Date(),
      duration: '',
      markerCoordinates: '',
      coords: this.props.coords,
      experiences: '',
      experience: '',
      display: false,
      placeName: '',
      max: '',
      currentUser: '',
      isJoined: false,
      isDisabled: false,
      search: '',
      loader: true
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8080/getcoordinates').then(res => {
      this.setState({ markerCoordinates: res.data })
    })
    axios.get('http://localhost:8080/getexperiences').then(res => {
      this.setState({ experiences: res.data })
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.coords !== null) {
      let newCoords = {
        lat: nextProps.coords.latitude,
        lng: nextProps.coords.longitude
      }
      this.setState({
        userCoords: newCoords,
        loader: false
      })
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.userCoords !== this.state.userCoords ||
      nextProps.user !== null ||
      nextState.markerCoordinates !== this.state.markerCoordinates
    )
  }
  componentDidUpdate(previousProps, previousState) {
    if (previousState.userCoords !== this.state.userCoords) {
      this.setState({ userCoords: this.state.userCoords })
    }
    if (previousState.location !== this.state.location) {
      this.setState({ experiences: this.state.experiences })
    }
  }
  
  searchInput = e => {
    this.setState({ search: e.target.value })
  }

  handleSearch = () => {
    axios({
      method: 'POST',
      url: 'http://localhost:8080/getlocation',
      data: {
        keyword: this.state.search,
        location: `${this.state.userCoords.lat}, ${this.state.userCoords.lng}`
      }
    }).then(res => {
      let searchCoords = res.data.results[0].geometry.location
      this.setState({
        userCoords: searchCoords
      })
    })
  }
  //Code for the experience creation modal
  titleInput = e => {
    this.setState({ title: e.target.value })
  }
  locationInput = e => {
    this.setState({ location: e.target.value })
  }
  detailsInput = e => {
    this.setState({ details: e.target.value })
  }
  onChange = time => this.setState({ time })

  durationInput = e => {
    this.setState({ duration: e.target.value })
  }
  maxInput = e => {
    this.setState({ max: e.target.value })
  }

  create = () => {
    let currentEmail = firebase.auth().currentUser.email
    let currentUser = firebase.auth().currentUser.displayName
    this.setState({ placeName: this.state.location, currentUser: currentUser })
    axios
      .get('http://localhost:8080/getexperiences')
      .then(res => {
        let filter = res.data.filter(
          experience =>
            experience.placeName === this.state.placeName
              ? alert('Place already in use')
              : ''
        )

    axios({
      method: 'POST',
      url: 'http://localhost:8080/getlocation',
      data: {
        keyword: this.state.location,
        location: `${this.state.userCoords.lat}, ${this.state.userCoords.lng}`
      }
    }).then(res => {
      let expCoords
      res.data.results[0] === undefined
        ? alert('location does not exist')
        : (expCoords = res.data.results[0].geometry.location)
      this.setState(
        {
          title: this.state.title,
          time: this.state.time,
          duration: this.state.duration,
          details: this.state.details,
          placeName: this.state.placeName,
          location: expCoords,
          markerCoordinates: this.state.markerCoordinates.concat(expCoords),
          participants: this.state.currentUser
        },
        () => {
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
          this.setState({
            experiences: this.state.experiences.concat(newExpObj)
          })
        }
      )
      axios.post('http://localhost:8080/addexperience', {
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
      this.setState({
        title: '',
        time: this.state.time,
        duration: '',
        details: '',
        location: '',
        max: ''
      })
    })
  })
}

  // Experience Modal
  showExperience = exp => {
    let currentUser = firebase.auth().currentUser.displayName
    axios
      .get('http://localhost:8080/getexperiences')
      .then(res => {
        console.log(res.data)
        let filter = res.data.filter(
          experience =>
            experience.location === JSON.stringify(exp.position)
              ? experience
              : ''
        )
        this.setState({
          experience: filter,
          display: true,
          buttonLogic: filter
        })
        let clickedCoords = JSON.parse(filter[0].location)

        if (filter[0].participants === currentUser) {
          this.setState({ isDisabled: true, userCoords: clickedCoords })
        } else this.setState({ userCoords: clickedCoords, isDisabled: false })
      })
      .catch(error => {
        console.log(error)
      })
  }

  close = () => {
    this.setState({ display: false })
  }

  join = () => {
    let currentUser = firebase.auth().currentUser.displayName
    let currentEmail = firebase.auth().currentUser.email
    this.setState({ isJoined: true })
    axios.get('http://localhost:8080/getexperiences').then(res => {
      let listExperiences = res.data
      let filter = listExperiences.filter(
        experience =>
          experience.id === this.state.experience[0].id ? experience : ''
      )
      axios.get('http://localhost:8080/getuser').then(res => {
        console.log(res)
        let userArr = res.data
        let filter = listExperiences.filter(
          experience =>
            experience.id === this.state.experience[0].id ? experience : ''
        )

        let filterUserId = userArr.filter(
          user => (user.id === filter[0].User_id ? user : '')
        )
        let nameArr = filter[0].participants.split(',')
        let isMatch = false
        let userNeedsSpace = ' ' + currentUser
        nameArr.forEach(name => {
          if (name === userNeedsSpace) {
            this.setState({ isMatch: true })
            isMatch = true
          }
        })
        if (filterUserId[0].email !== currentEmail && isMatch === false) {
          this.setState({
            participants: filter[0].participants.concat(', ' + currentUser)
          })
          axios
            .put('http://localhost:8080/updateparticipants', {
              participants: this.state.participants,
              id: this.state.experience[0].id
            })
            .then(res => {
              axios.get('http://localhost:8080/getexperiences').then(res => {
                let listExperiences = res.data
                let filter = listExperiences.filter(
                  experience =>
                    experience.id === this.state.experience[0].id
                      ? experience
                      : ''
                )
                this.setState({
                  participants: filter[0].participants,
                  experience: filter
                })
              })
            })
        } else {
          let userNeedsSpace = ' ' + currentUser
          let unJoin = nameArr.filter(
            user => (user !== userNeedsSpace ? user : '')
          )
          let remaining = unJoin.join('')
          axios
            .put('http://localhost:8080/updateparticipants', {
              participants: remaining,
              id: this.state.experience[0].id
            })
            .then(res => {
              axios.get('http://localhost:8080/getexperiences').then(res => {
                let listExperiences = res.data
                let filter = listExperiences.filter(
                  experience =>
                    experience.id === this.state.experience[0].id
                      ? experience
                      : ''
                )
                this.setState({
                  participants: filter[0].participants,
                  experience: filter
                })
              })
            })
        }
      })
    })
  }

  render() {
    let Markers = []
    if (this.state.markerCoordinates !== '') {
      Markers = this.state.markerCoordinates.map((coord, i) => {
        return <Marker key={i} position={coord} onClick={this.showExperience} />
      })
    }
    const styles = {
      modal2: {
        marginTop: '100px',
        padding: '10px',
        marginLeft: '490px'
      },
      closeButton: {
        textAlign: 'right'
      },
      header: {
        textAlign: 'center'
      },
      searchArea: {
        background: '#1b1c1d',
        textAlign: 'center',
        marginTop: '-2px',
        flex: 1
      },
      loader: {
        top: '500px',
        color: 'black'
      },
      dimmer: {
        background: '#1b1c1d'
      },
      brand: {
        top: -10,
        textAlign: 'center',
        color: 'white'
      },
      divv: {
        textAlign: 'center',
        position: 'fixed'
      }
    }
    const { userCoords } = this.state

    return (
      <div style={styles.searchArea}>
        <Search
          searchInput={this.searchInput}
          handleSearch={this.handleSearch}
          search={this.state.search}
        />
        <CreateExperience
          title={this.state.title}
          titleInput={this.titleInput}
          onChange={this.onChange}
          location={this.state.location}
          locationInput={this.locationInput}
          max={this.state.max}
          maxInput={this.maxInput}
          description={this.state.description}
          detailsInput={this.detailsInput}
          create={this.create}
        />
        {this.state.loader === true ? (
          <div className="Load" style={styles.dimmer}>
            <Segment style={styles.dimmer}>
              <Dimmer style={styles.dimmer} active>
                <Loader style={styles.loader} size="massive" indeterminate>
                  Getting Location
                </Loader>
              </Dimmer>
            </Segment>
          </div>
        ) : (
          ''
        )}{' '}
        :
        {!(this.state.markerCoordinates === '') ? (
          <div>
            <Map
              google={this.props.google}
              center={{
                lat: userCoords.lat,
                lng: userCoords.lng
              }}
              zoom={14}
            >
              {Markers}
            </Map>
          </div>
        ) : (
          <div>
            <Map
              google={this.props.google}
              center={{
                lat: userCoords.lat,
                lng: userCoords.lng
              }}
              zoom={14}
            />
          </div>
        )}
        {!(this.state.experience === '') ? (
          <Modal
            style={styles.modal2}
            open={this.state.display}
            closeOnDimmerClick
          >
            <div style={styles.closeButton}>
              <Button onClick={this.close} color="red">
                Close
              </Button>
            </div>
            <Modal.Header style={styles.header}>
              {this.state.experience[0].title}
            </Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>Time</Header>
                <p>{this.state.experience[0].time}</p>
                <Header>Details</Header>
                <p>{this.state.experience[0].details}</p>
                <Header>Location</Header>
                <p>{this.state.experience[0].placeName}</p>
                <Header>Max Participants</Header>
                <p>{this.state.experience[0].max}</p>
                <Header>People Attending</Header>
                <p>{this.state.experience[0].participants}</p>
              </Modal.Description>
            </Modal.Content>
            <Button
              color="violet"
              onClick={this.join}
              disabled={this.state.isDisabled}
            >
              {this.state.isJoined ? 'Leave' : 'Join'}
            </Button>
          </Modal>
        ) : (
          ''
        )}
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: googleAPI
})(MapContainer)
