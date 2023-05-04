CREATE TABLE "users" (
  "id" integer,
  "email" varchar PRIMARY KEY,
  "username" varchar,
  "password" varchar,
  "role" varchar,
  "created_at" timestamp
);

CREATE TABLE "owners" (
  "id" integer,
  "username" varchar,
  "first_name" varchar,
  "last_name" varchar,
  "location" varchar,
  "bio" text,
  "created_at" timestamp
);

CREATE TABLE "walkers" (
  "id" integer,
  "availability" datetime,
  "rate_per_hour" integer,
  "location" varchar
);

CREATE TABLE "pets" (
  "id" integer PRIMARY KEY,
  "availability" datetime,
  "owner_id" integer,
  "name" varchar,
  "bio" text,
  "age" integer,
  "breed" varchar,
  "weight" varchar,
  "size" varchar,
  "created_at" timestamp,
  "friendly_w_other_dogs" boolean,
  "friendly_w_children" boolean,
  "addtional_care" text
);

CREATE TABLE "jobs" (
  "id" integer PRIMARY KEY,
  "date_time_of_walk" datetime,
  "pet_ids" string,
  "owner_id" integer,
  "status" varchar,
  "created_at" timestamp
);

CREATE TABLE "applied_jobs" (
  "id" integer,
  "job_id" integer,
  "walker_id" integer,
  "status" varchar,
  "created_at" timestamp
);

COMMENT ON COLUMN "users"."role" IS 'pet owner or pet walker';

COMMENT ON COLUMN "walkers"."location" IS 'zipcode, city, state';

COMMENT ON COLUMN "pets"."weight" IS 'in lbs';

COMMENT ON COLUMN "pets"."size" IS 'null, based on weight this will be small, med, large, x-large';

COMMENT ON COLUMN "applied_jobs"."status" IS 'applied, approved, rejected';

ALTER TABLE "pets" ADD FOREIGN KEY ("owner_id") REFERENCES "owners" ("id");

ALTER TABLE "jobs" ADD FOREIGN KEY ("owner_id") REFERENCES "owners" ("id");

ALTER TABLE "walkers" ADD FOREIGN KEY ("id") REFERENCES "users" ("id");

ALTER TABLE "owners" ADD FOREIGN KEY ("id") REFERENCES "users" ("id");

ALTER TABLE "applied_jobs" ADD FOREIGN KEY ("job_id") REFERENCES "jobs" ("id");

ALTER TABLE "applied_jobs" ADD FOREIGN KEY ("walker_id") REFERENCES "walkers" ("id");
