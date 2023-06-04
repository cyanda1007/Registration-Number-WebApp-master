DROP TABLE IF EXISTS regByTown, regNumbers;


CREATE TABLE regByTown(
    town_id SERIAL NOT NULL PRIMARY KEY,
    town_name TEXT NOT NULL ,
    town_code TEXT NOT NULL
)

CREATE TABLE regNumbers(
    reg_id SERIAL NOT NULL,
    reg_number TEXT NOT NULL PRIMARY KEY,
    town_id INT NOT NULL,
    foreign key (town_id) references regByTown(id)
)

INSERT INTO regByTown(town_name, town_code)
VALUES('Cape Town','CA'),('Bellville', 'CY'),('Paarl', 'CJ'),('Stellenbosch', 'CL');