const Experience = require('../models/Experiences')

const Experiences = {
    getExperiences: (callback) =>{
        Experience.fetchAll()
            .then(experience => {
                callback(experience)
            })
    },
    updateExperiences: ({id, currentId, participants, newParticipants}, callback) => {
        Experience.where({ id: currentId })
            .save({ participants: newParticipants }, {method: 'update',require: true, patch: true })
            .then(experience => {
                callback(experience)
            })
    },
    newExperiences: ({title, time, duration, location, details, User_id, placeName, max, participants}, callback) => {
       new Experience({
            title, 
            time,
            duration,
            location,
            details,
            User_id: id,
            placeName,
            max, 
            participants
        }).save()
        .then(experience => {
            callback(experience)
        })
    }

}

module.exports = Experiences