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
            fail();
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

describe("register", function () {
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
        let user = await User.register({
            ...newUser3,
            password: "password",
        });
        newUser3 = { ...newUser3, userId: 3, walkerId: 2 }
        expect(user).toEqual(newUser3);
        const found = await db.query("SELECT * FROM users WHERE username = 'user3'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(false);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("registration of 4th user who is a pet owner works", async function () {
        let user = await User.register({
            ...newUser4,
            password: "password",
        });
        newUser4 = { ...newUser4, userId: 4, ownerId: 2 }
        expect(user).toEqual(newUser4);
        const found = await db.query("SELECT * FROM users WHERE username = 'user4'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(false);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

});


/************************************** get */

describe("get", function () {
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

    // test("not found if no such user", async function () {
    //     try {
    //         await User.get("nope");
    //         fail();
    //     } catch (err) {
    //         expect(err instanceof NotFoundError).toBeTruthy();
    //     }
    // });
});


