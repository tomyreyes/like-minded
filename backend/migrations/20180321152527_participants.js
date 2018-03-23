
exports.up = function (knex, Promise) {
    return knex.schema

        .table('Experiences', function (experience) {
           
            experience
                .integer('Participant_key')
                .references('id')
                .inTable('Users')
                .onDelete('cascade');

        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('Users')
        .dropTable('Experiences')
};