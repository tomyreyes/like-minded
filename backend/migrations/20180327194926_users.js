exports.up = function (knex, Promise) {
    return knex.schema
        .createTableIfNotExists('Users', function (user) {
            user.increments('id').primary(); // adds incrementing int for id
            user.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            user.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
            user.string('displayName').notNullable()
            user.string('email') // adds a string column
                .unique() // which has to be unique
                .notNullable() // and is required
        })
        .createTableIfNotExists('Experiences', function (experience) {
            experience.increments('id').primary();
            experience.string('title')
                .notNullable()
            experience.string('time')
                .notNullable()
            experience.string('duration')
                .notNullable()
            experience.string('details')
                .notNullable()
            experience.string('location')
                .notNullable()
            experience.string('placeName')
                .notNullable()
            experience.string('participants')
                .notNullable()
            experience.string('max')
                .notNullable()
            experience
                .integer('User_id')
                .references('id')
                .inTable('Users')
                .notNull()
                .onDelete('cascade');
        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('Users')
        .dropTable('Experiences')
};