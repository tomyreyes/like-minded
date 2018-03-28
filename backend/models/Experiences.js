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


const Experiences = bookshelf.Model.extend({
    tableName: 'Experiences',
    user: function () {
        return this.belongsTo(Users)
    }
})



module.exports = Experiences