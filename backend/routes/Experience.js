const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const Experience = require('../models/Experiences')

const Axios = require('axios')
const Experiences = require('../controllers/Experience')
const Users = require('../controllers/User')
const googleAPI = 'AIzaSyDK5cgjI7DpnkOJrbLuXUcx6FA2KPl72Jw'


router.get('/getcoordinates', (req, res) => {
    Experiences.getExperiences((experience) => {
        let coords = (experience.models.map(exp => JSON.parse(exp.attributes.location)))
        res.send(coords)
    })
})

router.get('/getexperiences', (req, res) => {
    Experiences.getExperiences((experiences) => {
        let experiencesArray = (experiences.models.map(exp => exp.attributes))
        res.send(experiencesArray)
    })
})



router.get('/getuser', (req, res) => {
    Users.getAllUsers((user) => {
        let userArr = (user.models.map(user => user.attributes))
        res.send(userArr)
    })
})

router.post('/adduser', (req, res) => {
    const { email, displayName } = req.body
    Users.addNewUser(
        {
            email,
            displayName
        }, (user) => {
            res.json(user)
        })
})

router.post('/getlocation', (req, res) => {
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
    }).then(success => {
        console.log(success)
        res.send(success.data)
    }).catch(error => {
        console.log(error)
        res.send(error)
    })
})
router.post('/addexperience', (req, res) => {

    let currentEmail = req.body.email
    let id
    User.where({ email: currentEmail })
        .fetch()
        .then(user => {
            id = user.attributes.id
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

router.put('/updateparticipants', (req, res) => {
    let currentId = req.body.id
    let newParticipants = req.body.participants
    new Experience({ id: currentId })
        .save({ participants: newParticipants }, { patch: true })
    res.json({ success: true })
})


module.exports = router