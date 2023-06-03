-- password: {admin:password, johnnybravo:hairgel, jellyfishking:jellyfish}

-- NEED TO INSERT walk_duration into jobs

INSERT INTO users (email, first_name, last_name, username, password, role, is_admin, address, city, state, zipcode)
VALUES ('admin@gmail.com',
        'admin_firstName',
        'admin_lastName',
        'admin',
        '$2b$12$Fm/8aHSqALrniNYeQ/5At.ZTb4W0PG/XdSexPYB99.ZS4TVzQSzna',
        'dog owner',
        TRUE,
        '123 puppy dr',
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
        '789 puppy dr',
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
        '456 happy dr',
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
        '444 rosewood dr',
        'san jose',
        'california',
        95123
        );

INSERT INTO owners (bio, user_id)
VALUES ('I am a Yorkie dad!',1),
       ('I am a Pug dad!',3);

INSERT INTO walkers (user_id, availability, rate_per_30min)
VALUES (2, 'monday, wednesday', '20'),
       (4, 'thursday, wednesday', '25');


INSERT INTO jobs (date, time, pet_ids, owner_id, address, city, state, zipcode, status)
VALUES ('7/4/2023', '2:00 pm', '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'Pending'),
       ('7/5/2023', '2:00 pm', '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'Pending'),
       ('7/4/2023', '5:00 pm', '3,4', 2, '456 happy dr', 'san jose', 'california', 95321, 'Canceled'),
       ('7/5/2023', '5:00 pm', '3,4', 2, '456 happy dr', 'san jose', 'california', 95321, 'Completed');


-- Still deciding on the options for status
INSERT INTO applied_jobs (job_id, walker_id, status )
VALUES (1, 1, 'Pending'),
       (2, 1, 'Pending'),
       (3, 2, 'Canceled'),
       (4, 2, 'Completed');


INSERT INTO pets (owner_id, name, gender, age , breed, weight, size, friendly_w_other_dogs, friendly_w_children, img, additional_details)
VALUES (1, 'Duke', 'male', 12, 'yorkie', 10, 'small', FALSE, TRUE, null, 'hates other dogs'),
       (1, 'Gizmo', 'male', 6, 'schipperke, keeshond', 14, 'small', FALSE, TRUE, null, 'poops on sidewalk...'),
       (2, 'Buddy', 'male', 4, 'golden retriever', 60, 'large', TRUE, TRUE, 'https://i0.wp.com/regencyranchgoldens.com/wp-content/uploads/2022/04/golden-head1.png?resize=256%2C256&ssl=1', 'likes to eat rocks. keep an eye on him.'),
       (2, 'Lady', 'female', 3, 'pug', 14, 'small', TRUE, TRUE, 'https://m.media-amazon.com/images/I/91aJS1ribwL._CR0,521,986,986_UX256.jpg', 'please reward her after walk')
;



 