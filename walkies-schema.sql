CREATE TABLE users (
  id serial PRIMARY KEY,
  email TEXT NOT NULL UNIQUE ,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username varchar UNIQUE,
  profile_image TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  address TEXT NOT NULL,
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
  ON DELETE CASCADE

);

CREATE TABLE walkers (
  id serial PRIMARY KEY,
  availability TEXT,
  rate_per_30min INTEGER CHECK (rate_per_30min >= 0),
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id)REFERENCES users(id)
  ON DELETE CASCADE
);

CREATE TABLE pets (
  id serial PRIMARY KEY,
  owner_id INTEGER,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  age INTEGER,
  breed TEXT NOT NULL,
  weight INTEGER NOT NULL,
  size TEXT,
  friendly_w_other_dogs boolean,
  friendly_w_children boolean,
  img TEXT,
  additional_details TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (owner_id) REFERENCES owners(id)
  ON DELETE CASCADE
);

-- need to add walk duration
CREATE TABLE jobs (
  id serial PRIMARY KEY,
  date DATE,
  time TIME,
  duration INTEGER,
  pet_ids TEXT,
  owner_id INTEGER,
  address TEXT,
  city TEXT,
  state TEXT,
  zipcode INTEGER,
  status TEXT DEFAULT 'Pending Applications',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (owner_id) REFERENCES owners(id)
  ON DELETE CASCADE
);

CREATE TABLE applied_jobs (
  id serial PRIMARY KEY,
  job_id INTEGER,
  walker_id INTEGER,
  first_name TEXT,
  last_name TEXT,
  rate_per_30min INTEGER,
  status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (walker_id) REFERENCES walkers(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
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

