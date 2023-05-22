-- password: {admin:password, johnnybravo:hairgel, jellyfishking:jellyfish}

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
        ),
        (
        'johnnybravo@gmail.com',
        'johnny',
        'bravo',
        'johnnybravo',
        '$2b$12$OipouLcD106whl7v51ME8ueV/Rkb1uSX81vYho.sLDbvDHmAcK6e.',
        'dog walker',
        FALSE,
        'san jose',
        'california',
        95123
        ),
        ('jellyfishking@gmail.com',
        'spongebob',
        'squarepants',
        'jellyfishking',
        '$2b$12$IF28kwMiqOeOt7cJw7WbK.JpYG4Vvpt1qhfQNJgNLeeRoBMX8YWwC',
        'dog owner',
        FALSE,
        'san jose',
        'california',
        95123
        ),
        ('TomHolland@gmail.com',
        'tom',
        'holland',
        'tomholland',
        '$2b$12$OkhyfC1ped3zFo6xw6CjLereR7QL1qv/NFicTntUwjSQdLCDabTYi',
        'dog walker',
        FALSE,
        'san jose',
        'california',
        95123
        );


INSERT INTO owners (bio, user_id)
VALUES ('I am a Yorkie dad!',1),
       ('I am a Pug dad!',3);

INSERT INTO walkers (user_id)
VALUES (2),(4);


INSERT INTO jobs (date_of_walk, time_of_walk, pet_ids, owner_id, status)
VALUES ('7/4/2023', '2:00 pm', '1,2,33', 1, 'available'),
       ('7/5/2023', '2:00 pm', '1,2,33', 1, 'available'),
       ('7/4/2023', '5:00 pm', '4,5,66', 2, 'available'),
       ('7/5/2023', '5:00 pm', '4,5,66', 2, 'available');


