const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080;
const User = require('./models/Users')
const Experience = require('./models/Experiences')
const bodyParser = require('body-parser')
const Participants = require('./models/Participants')
const Axios = require('axios')

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    next();
});

app.use(bodyParser.json())

const knex = require('knex')({
    client: 'postgres',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '',
        database: 'like-minded',
        charset: 'utf8'
    }
});

const bookshelf = require('bookshelf')(knex)

const googleAPI = 'AIzaSyDK5cgjI7DpnkOJrbLuXUcx6FA2KPl72Jw'

app.get('/getuser', (req, res) => {
    User.fetchAll()
        .then(user => {
            let userArr = (user.models.map(user => user.attributes))
            res.send(userArr)
        })
})


app.post('/adduser', (req, res) => {
    let receivedEmail = req.body.email
    let arrayEmail
    console.log(req.body)
    let newUser = new User({
        email: req.body.email,
        displayName: req.body.displayName
    }).save()
})

app.post('/getlocation', (req, res) => {
    console.log(req.body)
    const { keyword, location } = req.body

    Axios({
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        params: {
        key: googleAPI,
        location: location,
        keyword: keyword,
        radius: 50000
        }
    }).then(success =>{
        console.log(success)
        res.send(success.data)
    }).catch(error =>{
        console.log(error)
        res.send(error)
    })
})





app.get('/getcoordinates', (req, res) => {
    Experience.fetchAll()
        .then(experience => {
            let coords = (experience.models.map(exp => JSON.parse(exp.attributes.location)))
            res.send(coords)
        })
})

app.get('/getexperiences', (req, res) => {
    Experience.fetchAll()
        .then(experiences => {
            let experiencesArray = (experiences.models.map(exp => exp.attributes))
            res.send(experiencesArray)
        })
})

app.post('/addexperience', (req, res) => {

    let currentEmail = req.body.email
    console.log(currentEmail)
    let id
    User.where({ email: currentEmail })
        .fetch()
        .then(user => {
            id = user.attributes.id
            console.log(user.attributes)
            let newExperience = new Experience({
                title: req.body.title,
                time: req.body.time,
                duration: req.body.duration,
                location: req.body.location,
                details: req.body.details,
                User_id: id,
                placeName: req.body.placeName,
                max: req.body.max,
                participants: req.body.participants

            })
            newExperience.save()
                .then(experience => {
                    console.log(experience)
                })
            res.json({ success: true })
        })
})

app.put('/updateparticipants', (req, res) => {
    let currentId = req.body.id
    let newParticipants = req.body.participants
    new Experience({ id: currentId })
        .save({ participants: newParticipants }, { patch: true })
    res.json({ success: true })
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})
