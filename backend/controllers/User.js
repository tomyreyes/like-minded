const User = require('../models/Users')


const Users = {
    getAllUsers: (callback) => {
        User.fetchAll()
            .then(user => {  
                callback(user)
            })
    },
    addNewUser: ({ email, displayName }, callback) =>{
        new User({
            email,
            displayName
        }).save()
            .then(user => {
                callback(user)
            })
    },
    getCurrentUser: ({ email, currentEmail, experience}, callback) => {
        User
        .query({where: { email: currentEmail }})
            .fetch({withRelated: ['title']})
            .then(user => {
               callback(user)
            })
        }
    }


module.exports = Users 