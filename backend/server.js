const express = require ('express')
const app = express()
const port = 8080
const User = require ('./models/Users')
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



app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`)
})