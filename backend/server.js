const express = require ('express')
const app = express()
const port = 8080
const User = require ('./models/Users')
const Experience = require ('./models/Experiences')
const bodyParser = require('body-parser')
const Participants = require('./models/Participants')

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

app.get('/getuser' , (req, res) =>{
    User.fetchAll()
    .then(user => {
        let userArr = (user.models.map(user => user.attributes))
        res.send(userArr)
    })
})

// app.get('/getid', (req, res)=> {
//     User.where({email:'tomysteeze@gmail.com'})
//     .fetch()
//     .then(user => {
//         console.log(user.attributes.id)
//     })
// })

// app.post('/adduser', (req, res) => {
//     let currentEmail = req.body.email
//     let arrayEmail
//     let newUser = new User({
//         email: req.body.email,
//         displayName: req.body.displayName
//     })
//     User.fetchAll()
//         .then(user => {
//         let dbEmails = user.modelsmap(user => user.attributes.email)
//             for (let i = 0; i < arrayEmail.length - 1; i++) {
//                 if (arrayEmail[i]!== currentEmail) {
//                     new User.save()
//                         .then(user => {
//                             console.log(user)
//                                             })}
//                  else console.log('same user info')
//             } 
//             res.json({ success: true })
// })

app.post('/adduser', (req, res)=>{
    let receivedEmail = req.body.email
    let arrayEmail
    let newUser = new User ({
        email: req.body.email,
        displayName: req.body.displayName
    })
    // User.fetchAll()
    //     .then(user => {
    //         arrayEmail = user.models.map(user => user.attributes.email)
    //             for(let i = 0; i < arrayEmail.length - 1; i++) {
    //                 if (arrayEmail[i] !== receivedEmail) {
                        newUser.save()
                            .then(user => {
                                console.log(user)
                            })
        //             }else console.log('this exists')
        //         } res.json({success:true})
        // })
})
    

app.get('/getcoordinates', (req, res)=>{
   Experience.fetchAll()
        .then(experience => {
            let coords = (experience.models.map(exp => JSON.parse(exp.attributes.location)))
            res.send(coords)
        })
})

app.get('/getexperiences', (req, res)=> {
    Experience.fetchAll()
    .then(experiences => {
        let experiencesArray = (experiences.models.map(exp => exp.attributes))
        res.send(experiencesArray)
    })
})

//app.get user who owns the experience? 

app.post('/addexperience', (req, res) => {

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

app.put('/updateparticipants', (req, res)=>{
    let currentId = req.body.id
    let newParticipants = req.body.participants
    new Experience({id: currentId})
    .save({participants: newParticipants}, {patch: true})
    res.json({success:true})
})

    


app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`)
})