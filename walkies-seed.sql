-- password is password

INSERT INTO users (email, first_name, last_name, username, password, role, is_admin, city, state, zipcode)
VALUES ('admin@gmail.com',
        'admin',
        'admin',
        'admin',
        '$2b$12$Fm/8aHSqALrniNYeQ/5At.ZTb4W0PG/XdSexPYB99.ZS4TVzQSzna',
        'dog walker',
        TRUE,
        'san jose',
        'california',
        95123
);
