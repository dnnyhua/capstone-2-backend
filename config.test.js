"use strict";

describe("config can come from env", function () {
    test("production works", function () {
        process.env.SECRET_KEY = "abc";
        process.env.PORT = "5000";
        // process.env.DATABASE_URL = "production";
        process.env.NODE_ENV = "production";

        const config = require("./config");
        expect(config.SECRET_KEY).toEqual("abc");
        expect(config.PORT).toEqual(5000);
        expect(config.getDatabaseUri()).toEqual("postgresql://dnnyhua:1123@localhost/walkies");
        expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

        delete process.env.SECRET_KEY;
        delete process.env.PORT;
        delete process.env.BCRYPT_WORK_FACTOR;
        delete process.env.DATABASE_URL;

        // expect(config.getDatabaseUri()).toEqual("postgresql://dnnyhua:1123@localhost/walkies");
        process.env.NODE_ENV = "test";

        expect(config.getDatabaseUri()).toEqual("postgresql://dnnyhua:1123@localhost/walkies_test");
    });
})


