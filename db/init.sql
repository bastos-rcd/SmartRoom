CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    status INT NOT NULL CHECK (status IN (0, 1))
);

INSERT INTO "user" (first_name, last_name, email, password, role, status)
VALUES ('John', 'Doe', 'john.doe@example.com', 'hashedpwd', 'admin', 1);
INSERT INTO "user" (first_name, last_name, email, password, role, status)
VALUES ('Jane', 'Smith', 'jane.smith@example.com', 'hashedpwd', 'user', 1);

CREATE TABLE "building" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    nb_floors INT NOT NULL CHECK (nb_floors > 0)
);

INSERT INTO "building" (name, address, nb_floors)
VALUES ('Main', '28 Avenue du BG, 31100 Toulouse, France', 3);

CREATE TABLE "room" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    floor INT NOT NULL,
    state INT NOT NULL CHECK (state IN (0, 1)),
    location VARCHAR(255),
    building_id INT REFERENCES "building"(id) ON DELETE CASCADE
);

INSERT INTO "room" (name, capacity, floor, state, location, building_id)
VALUES ('A101', 30, 2, 1, 'Aile nord', 1);
INSERT INTO "room" (name, capacity, floor, state, location, building_id)
VALUES ('A01', 14, 1, 1, 'Aile sud', 1);

CREATE TABLE "equipment" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100) NOT NULL,
    available INT NOT NULL,
    room_id INT REFERENCES "room"(id) ON DELETE SET NULL
);

INSERT INTO "equipment" (name, type, available, room_id)
VALUES ('Vidéo-projecteur', 'informatique', 1, 1);
INSERT INTO "equipment" (name, type, available, room_id)
VALUES ('Tableau blanc', 'fourniture', 1, 2);

CREATE TABLE "reservation" (
    id SERIAL PRIMARY KEY,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'modified')),
    comment TEXT,
    user_id INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    room_id INT NOT NULL REFERENCES "room"(id) ON DELETE CASCADE
);

INSERT INTO "reservation" (start_date, end_date, status, comment, user_id, room_id)
VALUES ('2026-01-01 10:00', '2026-01-01 12:00', 'confirmed', 'Réunion hebdomadaire', 1, 1);

CREATE TABLE "request" (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('incident', 'request')),
    description TEXT NOT NULL,
    status INT NOT NULL CHECK (status IN (0, 1)), 
    creation_date TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

INSERT INTO "request" (type, description, status, user_id)
VALUES ('incident', 'Le projecteur ne fonctionne plus', 1, 1);

CREATE TABLE "parameter" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    value TEXT NOT NULL,
    user_id INT REFERENCES "user"(id) ON DELETE SET NULL
);

INSERT INTO "parameter" (name, value, user_id)
VALUES ('maintenance_mode', 'off', 1);