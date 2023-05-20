CREATE TABLE users (
  id serial PRIMARY KEY,
  email TEXT NOT NULL UNIQUE ,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username varchar UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipcode INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE owners (
  id serial PRIMARY KEY,
  bio TEXT,
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)

);

CREATE TABLE walkers (
  id serial PRIMARY KEY,
  availability DATE,
  rate_per_hour integer CHECK (rate_per_hour >= 0),
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)

);

CREATE TABLE pets (
  id serial PRIMARY KEY,
  owner_id integer,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  age integer,
  breed TEXT NOT NULL,
  weight INTEGER NOT NULL,
  size TEXT,
  friendly_w_other_dogs boolean,
  friendly_w_children boolean,
  addtional_details TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jobs (
  id serial PRIMARY KEY,
  date_of_walk DATE,
  time_of_walk TIME,
  pet_ids TEXT,
  owner_id integer,
  status varchar,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE applied_jobs (
  id serial PRIMARY KEY,
  job_id integer,
  walker_id integer,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON COLUMN "users"."role" IS 'pet owner or pet walker';

COMMENT ON COLUMN "pets"."weight" IS 'in lbs';

COMMENT ON COLUMN "pets"."size" IS 'null, based on weight this will be small, med, large, x-large';

COMMENT ON COLUMN "applied_jobs"."status" IS 'applied, approved, rejected';

-- ALTER TABLE pets ADD FOREIGN KEY (owner_id) REFERENCES owners (id);
-- ALTER TABLE jobs ADD FOREIGN KEY (owner_id) REFERENCES owners (id);
-- ALTER TABLE walkers ADD FOREIGN KEY (id) REFERENCES users (id);
-- ALTER TABLE owners ADD FOREIGN KEY (id) REFERENCES users (id);
-- ALTER TABLE applied_jobs ADD FOREIGN KEY (job_id) REFERENCES jobs (id);
-- ALTER TABLE applied_jobs ADD FOREIGN KEY (walker_id) REFERENCES walkers (id);

