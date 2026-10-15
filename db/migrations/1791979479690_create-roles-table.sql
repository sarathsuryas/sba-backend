-- Up Migration
CREATE TABLE roles (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE,
    description TEXT
);

INSERT INTO roles (name, description) VALUES
    ('customer', 'Bank customer'),
    ('staff',    'Bank staff member'),
    ('admin',    'System administrator');

-- Down Migration
DROP TABLE roles;
