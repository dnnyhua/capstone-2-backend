const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");



    await db.query(`
      INSERT INTO users (email, first_name, last_name, username, password, role, is_admin, address, city, state, zipcode, profile_image, bio, rate)
      VALUES (
                'user1@gmail.com',
                'user1',
                'user1_lastName',
                'user1',
                $1,
                'dog owner',
                TRUE,
                '123 puppy dr',
                'san jose',
                'california',
                95123,
                'https://static.thenounproject.com/png/5034901-200.png',
                null,
                null
              ),
              (
                'user2@gmail.com',
                'user2',
                'user2_lastName',
                'user2',
                $2,
                'dog walker',
                FALSE,
                '789 puppy dr',
                'san jose',
                'california',
                95123,
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRNF8-gfvx__gaeVMxKBA2uxYZWju8XBV3_P0Rmsl_9lAcFVJCts7MZbNbE0bnARq1FFE&usqp=CAU',
                'huge dog lover',
                20)
              RETURNING username`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        ]
    );

    await db.query(`
        INSERT INTO owners (bio, user_id)
        VALUES ('I am a Yorkie dad!',1)
    `)

    await db.query(`
        INSERT INTO walkers (user_id, availability)
        VALUES (2, 'monday, wednesday')
    `);

}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {

    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.query("TRUNCATE TABLE jobs, users RESTART IDENTITY CASCADE");
    await db.end();

    await db.end();
}


module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
};