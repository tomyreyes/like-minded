const express = require ('express')
const app = express()
const port = 8080
const User = require ('./models/Users')
const Experience = require ('./models/Experiences')
const bodyParser = require('body-parser')

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

app.post('/adduser', (req, res)=>{
    let newUser = new User({
        email: req.body.email
    })
    newUser.save()
        .then(user =>{
            console.log(user)
        })
    res.json({ success: true })
})

app.get('/getuser' , (req, res) =>{
    User.fetchAll()
    .then(user => {
        console.log(user.models.map(user => user.attributes))
    })
})

app.get('/getid', (req, res)=> {
    User.where({email:'tomysteeze@gmail.com'})
    .fetch()
    .then(user => {
        console.log(user.attributes.id)
    })
})

app.post('/addexperience', (req, res)=> {
    let currentEmail = req.body.email
    let id 
    User.where({email: currentEmail})
    .fetch()
    .then(user => {
         id = user.attributes.id

            let newExperience = new Experience({
                title: req.body.title,
                time: req.body.time,
                duration: req.body.duration,
                
                location: req.body.location, //probs wont need to parse this when real data comes in 
                details: req.body.details,
                User_id: id
                // req.body.User_id //req.body.email find ID
                //
                //knex syntax to find user determine id from email? axios.post email and use this received email to be searched via bookshelf 
            })
            newExperience.save()
                .then(experience => {
                    console.log(experience)
                })
            res.json({ success: true })
        })
    })
    


app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`)
})