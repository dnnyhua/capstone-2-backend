CREATE TABLE users (
  id integer,
  email TEXT NOT NULL,
  username varchar PRIMARY KEY,
  dpassword TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "created_at" TIMESTAMP
);

CREATE TABLE owners (
  id integer,
  username varchar,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipcode INTEGER NOT NULL,
  bio TEXT NOT NULL,
  created_at TIMESTAMP
);

CREATE TABLE walkers (
  id integer,
  availability DATE,
  rate_per_hour integer CHECK (rate_per_hour >= 0),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipcode INTEGER NOT NULL
);

CREATE TABLE pets (
  id integer PRIMARY KEY,
  owner_id integer,
  availability DATE,
  name TEXT NOT NULL,
  bio TEXT,
  age integer,
  breed TEXT NOT NULL,
  weight INTEGER NOT NULL,
  size TEXT,
  created_at TIMESTAMP,
  friendly_w_other_dogs boolean,
  friendly_w_children boolean,
  addtional_care TEXT
);

CREATE TABLE jobs (
  id integer PRIMARY KEY,
  date_of_walk DATE,
  time_of_walk TIME,
  pet_ids TEXT,
  owner_id integer,
  status varchar,
  created_at TIMESTAMP
);

CREATE TABLE applied_jobs (
  id integer,
  job_id integer,
  walker_id integer,
  status TEXT,
  created_at TIMESTAMP
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

