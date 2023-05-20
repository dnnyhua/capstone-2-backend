-- password is password

INSERT INTO users (email, first_name, last_name, username, password, role, is_admin, city, state, zipcode)
VALUES ('admin@gmail.com',
        'admin',
        'admin',
        'admin',
        '$2b$12$Fm/8aHSqALrniNYeQ/5At.ZTb4W0PG/XdSexPYB99.ZS4TVzQSzna',
        'dog owner',
        TRUE,
        'san jose',
        'california',
        95123
);


INSERT INTO owners (bio, user_id)
VALUES ('I am a Yorkie dad!',
        1);


INSERT INTO jobs (date_of_walk, time_of_walk, pet_ids, owner_id, status)
VALUES ('7/4/2023', '2:00 pm', '4,6,33', 1, 'available'),
       ('7/5/2023', '2:00 pm', '4,6,33', 1, 'available');


