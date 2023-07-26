\echo 'Delete and recreate walkies db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS walkies;
CREATE DATABASE walkies;
\connect walkies

\i walkies-schema.sql
\i walkies-seed.sql

\echo 'Delete and recreate walkies_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS walkies_test;
CREATE DATABASE walkies_test;
\connect walkies_test

\i walkies-schema.sql
