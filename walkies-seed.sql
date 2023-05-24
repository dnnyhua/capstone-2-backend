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
        ('tomholland@gmail.com',
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


INSERT INTO jobs (date_of_walk, time_of_walk, pet_ids, pet_sizes, owner_id, status)
VALUES ('7/4/2023', '2:00 pm', '1,2', 'small, small', 1, 'Pending'),
       ('7/5/2023', '2:00 pm', '1,2', 'small, small', 1, 'Pending'),
       ('7/4/2023', '5:00 pm', '3,4', 'large, small', 2, 'Canceled'),
       ('7/5/2023', '5:00 pm', '3,4', 'small, small', 2, 'Completed');


-- Still deciding on the options for status
INSERT INTO applied_jobs (job_id, walker_id, status )
VALUES (1, 1, 'Pending'),
       (2, 1, 'Pending'),
       (3, 2, 'Canceled'),
       (4, 2, 'Completed');


INSERT INTO pets (owner_id, name, gender, age , breed, weight, size, friendly_w_other_dogs, friendly_w_children, addtional_details)
VALUES (1, 'Duke', 'male', 12, 'yorkie', 10, 'small', FALSE, TRUE, 'hates other dogs'),
       (1, 'Gizmo', 'male', 6, 'schipperke, keeshond', 14, 'small', FALSE, TRUE, 'poops on sidewalk...'),
       (2, 'Buddy', 'male', 4, 'golden retriever', 60, 'large', TRUE, TRUE, 'likes to eat rocks. keep an eye on him.'),
       (2, 'Lady', 'female', 3, 'pug', 14, 'small', TRUE, TRUE, 'please reward her after walk')
;



 