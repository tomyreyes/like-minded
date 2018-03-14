const express = require ('express')
const authRoutes = require ('./routes/auth-routes')
const app = express()
const port = 8080


app.use('/auth', authRoutes)

app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`)
})