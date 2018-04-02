const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080;
const routes = require('./routes/routes')
const bodyParser = require('body-parser')

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    next();
});

app.use(bodyParser.json())

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})
