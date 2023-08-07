"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const User = require("./user.js")

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** authenticate */

describe("authenticate", function () {
    test("user1 authentication works", async function () {
        const user = await User.authenticate("user1", "password1");
        expect(user).toEqual({
            username: "user1",
            firstName: "user1",
            lastName: "user1_lastName",
            email: "user1@gmail.com",
            isAdmin: true,
            role: "dog owner"
        });
    });

    test("user2 authentication works", async function () {
        const user = await User.authenticate("user2", "password2");
        expect(user).toEqual({
            username: "user2",
            firstName: "user2",
            lastName: "user2_lastName",
            email: "user2@gmail.com",
            isAdmin: false,
            role: "dog walker"
        });
    });

    test("unauth if no such user", async function () {
        try {
            await User.authenticate("fakeUser", "password");
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });

    /** NOTES for "unauth if no such user"
    
     If the authentication process does not throw an error and reaches the fail() function call, the test fails. This is because it indicates that the authentication succeeded for a non-existent user, which is unexpected. 
     
     If an error is thrown during the authentication process, the catch block is executed. The expect function is used to assert that caught error instance is an UnauthorizedError (presumably a custom error type specific to unauthorized access). 
     
     If the caught error is indeed an instance of UnauthorizedError, the test passes.
    */

    test("unauth if wrong password", async function () {
        try {
            await User.authenticate("user1", "password222");
            fail();
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });

})

/************************************** register */

describe("register new user", function () {
    let newUser3 = {
        email: "user3@gmail.com",
        firstName: "user3",
        lastName: "user3_lastName",
        username: "user3",
        role: "dog walker",
        isAdmin: false,
        address: "123 test way",
        city: "test city",
        state: "test state",
        zipcode: 12345,
        profileImage: "https://static.thenounproject.com/png/5034901-200.png",
        bio: "dog lover here!",
        rate: 10
    };

    let newUser4 = {
        email: "user4@gmail.com",
        firstName: "user4",
        lastName: "user4_lastName",
        username: "user4",
        role: "dog owner",
        isAdmin: false,
        address: "123 test way",
        city: "test city",
        state: "test state",
        zipcode: 12345,
        profileImage: "https://static.thenounproject.com/png/5034901-200.png",
        bio: null,
        rate: null
    };

    test("registration of 3rd user who is a pet walker works", async function () {
        await User.register({
            ...newUser3,
            password: "password",
        });
        const newUser = await db.query("SELECT * FROM users WHERE username = 'user3'");
        expect(newUser.rows.length).toEqual(1);
        expect(newUser.rows[0].is_admin).toEqual(false);
        expect(newUser.rows[0].id).toEqual(3);
        expect(newUser.rows[0].role).toEqual('dog walker');
        expect(newUser.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("registration of 4th user who is a pet owner works", async function () {
        await User.register({
            ...newUser4,
            password: "password",
        });
        const newUser = await db.query("SELECT * FROM users WHERE username = 'user4'");
        expect(newUser.rows.length).toEqual(1);
        expect(newUser.rows[0].is_admin).toEqual(false);
        expect(newUser.rows[0].id).toEqual(4);
        expect(newUser.rows[0].role).toEqual('dog owner');
        expect(newUser.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("invalid data", async function () {
        let resp = await User.register({
            ...newUser4,
            password: "password",
            email: 'wrong data'
        })
        console.log(resp)
        // expect(resp.statusCode).toEqual(401)
    })

});


/************************************** get */

describe("get user info with username", function () {
    test("get user1 works", async function () {
        let user = await User.getUser("user1");
        expect(user).toEqual({
            email: "user1@gmail.com",
            firstName: "user1",
            lastName: "user1_lastName",
            username: "user1",
            role: "dog owner",
            isAdmin: true,
            address: "123 puppy dr",
            city: "san jose",
            state: "california",
            zipcode: 95123,
            profileImage: "https://static.thenounproject.com/png/5034901-200.png",
            bio: null,
            rate: null
        });
    });

    test("not found if no such user", async function () {
        try {
            await User.getUser("barack");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});


/************************************** update */

describe("update", function () {
    const updateData = {
        firstName: "user123",
        lastName: "user123_lastName",
        email: "user123@email.com",
    };

    test("works", async function () {
        let job = await User.update("user1", updateData);
        expect(job).toEqual({
            username: "user1",
            ...updateData,
            isAdmin: true,
            address: "123 puppy dr",
            city: "san jose",
            state: "california",
            zipcode: 95123,
            profileImage: "https://static.thenounproject.com/png/5034901-200.png"
        });
    });

});


/************************************** delete */

describe("delete user", function () {
    test("works", async function () {
        await User.remove("user1");
        const res = await db.query(
            "SELECT * FROM users WHERE username='user1'");
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such user", async function () {
        try {
            await User.remove("nope");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});