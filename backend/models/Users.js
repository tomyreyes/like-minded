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
const bookshelf = require('bookshelf')(knex);


const Users = bookshelf.Model.extend({
    tableName: 'Users',
    experience: function () {
        return this.hasMany(Experiences)
    }
})



module.exports = Users