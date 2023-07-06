-- password: {admin:password, johnnybravo:hairgel, jellyfishking:jellyfish}

-- NEED TO INSERT walk_duration into jobs

INSERT INTO users (email, first_name, last_name, username, password, role, is_admin, address, city, state, zipcode, profile_image, bio, rate)
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
        95123,
        'https://static.thenounproject.com/png/5034901-200.png',
        null,
        null
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
        95123,
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRNF8-gfvx__gaeVMxKBA2uxYZWju8XBV3_P0Rmsl_9lAcFVJCts7MZbNbE0bnARq1FFE&usqp=CAU',
        'huge dog lover',
        20
        ),
        ('jellyfishking@gmail.com',
        'spongebob',
        'squarepants',
        'jellyfishking',
        '$2b$12$IF28kwMiqOeOt7cJw7WbK.JpYG4Vvpt1qhfQNJgNLeeRoBMX8YWwC',
        'dog owner',
        FALSE,
        '456 happy dr',
        'san francisco',
        'california',
        95123,
        'https://static.thenounproject.com/png/5034901-200.png',
        null,
        null
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
        95123,
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBIYoCdF6ixsv0vzgejZMsBkpTYbh93v-67nbZk_hj2NBjVa5j3zrLMGr17T9OBMqWVzA&usqp=CAU',
        'I have experience walking dogs of all sizes',
        25
        )
;

INSERT INTO owners (bio, user_id)
VALUES ('I am a Yorkie dad!',1),
       ('I am a Pug dad!',3)
;

-- Need to incorporate availability later
INSERT INTO walkers (user_id, availability)
VALUES (2, 'monday, wednesday'),
       (4, 'thursday, wednesday')
;


INSERT INTO jobs (date, time, duration, pet_ids, owner_id, address, city, state, zipcode, status)
VALUES ('6/4/2023', '2:00 pm', 30, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'New'),
       ('6/5/2023', '2:00 pm', 30, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'Needs Review'),
       ('6/5/2023', '3:00 pm', 30, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'Needs Review'),
       ('6/5/2023', '4:00 pm', 30, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'Needs Review'),
       ('6/5/2023', '5:00 pm', 30, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'Needs Review'),
       ('6/4/2023', '5:00 pm', 30, '3,4', 2, '456 happy dr', 'san francisco', 'california', 95123, 'Walk Scheduled'),
       ('6/2/2023', '5:00 pm', 30, '3,4', 2, '456 happy dr', 'san francisco', 'california', 95123, 'Walk Scheduled'),
       ('6/5/2023', '2:00 pm', 30, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'New'),
       ('7/1/2023', '2:00 pm', 30, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'New'),
       ('7/2/2023', '3:00 pm', 30, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'New'),
       ('7/3/2023', '4:00 pm', 45, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'New'),
       ('7/4/2023', '5:00 pm', 45, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'New'),
       ('7/5/2023', '6:00 pm', 45, '1,2', 1, '123 puppy dr', 'san jose', 'california', 95321, 'New')
;


INSERT INTO applied_jobs (job_id, walker_id, first_name, last_name, rate, bio, status, profile_image )
VALUES (2, 1, 'Johnny', 'Bravo', 20, 'huge dog lover', 'Pending Review', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRNF8-gfvx__gaeVMxKBA2uxYZWju8XBV3_P0Rmsl_9lAcFVJCts7MZbNbE0bnARq1FFE&usqp=CAU'),
       (3, 1, 'Johnny', 'Bravo', 20, 'huge dog lover', 'Pending Review', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRNF8-gfvx__gaeVMxKBA2uxYZWju8XBV3_P0Rmsl_9lAcFVJCts7MZbNbE0bnARq1FFE&usqp=CAU'),
       (2, 2, 'Tom', 'Holland', 25, 'I have experience walking dogs of all sizes', 'Pending Review', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBIYoCdF6ixsv0vzgejZMsBkpTYbh93v-67nbZk_hj2NBjVa5j3zrLMGr17T9OBMqWVzA&usqp=CAU'),
       (3, 2, 'Tom', 'Holland', 25, 'I have experience walking dogs of all sizes', 'Pending Review', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBIYoCdF6ixsv0vzgejZMsBkpTYbh93v-67nbZk_hj2NBjVa5j3zrLMGr17T9OBMqWVzA&usqp=CAU'),
       (4, 2, 'Tom', 'Holland', 25, 'I have experience walking dogs of all sizes', 'Pending Review', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBIYoCdF6ixsv0vzgejZMsBkpTYbh93v-67nbZk_hj2NBjVa5j3zrLMGr17T9OBMqWVzA&usqp=CAU'),
       (5, 2, 'Tom', 'Holland', 25, 'I have experience walking dogs of all sizes', 'Pending Review', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBIYoCdF6ixsv0vzgejZMsBkpTYbh93v-67nbZk_hj2NBjVa5j3zrLMGr17T9OBMqWVzA&usqp=CAU'),
       (6, 2, 'Tom', 'Holland', 25, 'I have experience walking dogs of all sizes', 'Hired', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBIYoCdF6ixsv0vzgejZMsBkpTYbh93v-67nbZk_hj2NBjVa5j3zrLMGr17T9OBMqWVzA&usqp=CAU'),
       (7, 2, 'Tom', 'Holland', 25, 'I have experience walking dogs of all sizes', 'Hired', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBIYoCdF6ixsv0vzgejZMsBkpTYbh93v-67nbZk_hj2NBjVa5j3zrLMGr17T9OBMqWVzA&usqp=CAU')
;


INSERT INTO pets (owner_id, name, gender, age , breed, weight, size, friendly_w_other_dogs, friendly_w_children, img, additional_details)
VALUES (1, 'Duke', 'male', 12, 'yorkie', 10, 'small', FALSE, TRUE, 'https://images.vexels.com/media/users/3/237182/isolated/preview/12d16be249ddb2b69cdfad39bbf58551-simple-cute-spotted-doodle-dog.png', 'hates other dogs'),
       (1, 'Gizmo', 'male', 6, 'schipperke, keeshond', 14, 'small', FALSE, TRUE, 'https://images.vexels.com/media/users/3/237182/isolated/preview/12d16be249ddb2b69cdfad39bbf58551-simple-cute-spotted-doodle-dog.png', 'poops on sidewalk...'),
       (2, 'Buddy', 'male', 4, 'golden retriever', 60, 'large', TRUE, TRUE, 'https://i0.wp.com/regencyranchgoldens.com/wp-content/uploads/2022/04/golden-head1.png?resize=256%2C256&ssl=1', 'likes to eat rocks. keep an eye on him.'),
       (2, 'Lady', 'female', 3, 'pug', 14, 'small', TRUE, TRUE, 'https://m.media-amazon.com/images/I/91aJS1ribwL._CR0,521,986,986_UX256.jpg', 'please reward her after walk')
;



 