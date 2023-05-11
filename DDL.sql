---------------------- Creating the tables ---------------------------

DROP TABLE IF EXISTS employees_projects;
DROP TABLE IF EXISTS salaries;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS roles;

-- I made most of the ints UNSIGNED since we won't be dealing with
-- negative numbers

-- -----------------------------------------------------
-- Table roles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  role_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(45) NOT NULL UNIQUE,
  PRIMARY KEY (role_id)
);


-- -----------------------------------------------------
-- Table employees
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
  employee_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  hire_date DATE NOT NULL,
  name VARCHAR(45) NOT NULL,
  role INT UNSIGNED NOT NULL,
  is_active TINYINT(1) NOT NULL,
  address VARCHAR(45) NULL,
  birthdate DATE NOT NULL, -- changed to be NOT NULL for duplicate checks
  PRIMARY KEY (employee_id),
  CONSTRAINT fk_employees_role_types
    FOREIGN KEY (role)
    REFERENCES roles (role_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT already_in_table UNIQUE(name,birthdate)
);


-- -----------------------------------------------------
-- Table salaries
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS salaries (
  salary_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  effective_date DATE NOT NULL,
  pay_amount DECIMAL(10,2) UNSIGNED NOT NULL,
  employee_id INT UNSIGNED NULL,
  PRIMARY KEY (salary_id),
  CONSTRAINT fk_salaries_employees1
    FOREIGN KEY (employee_id)
    REFERENCES employees (employee_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT err_cannot_overide_entry UNIQUE(employee_id,effective_date)
);


-- -----------------------------------------------------
-- Table projects
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  project_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  is_ongoing TINYINT(1) NOT NULL,
  percent_completed INT UNSIGNED NULL, -- I changed this to an INT type since DECIMALS unfortunately get rounded to nearest whole number
  deadline DATETIME NOT NULL,
  start_date DATE NOT NULL,
  project_name VARCHAR(45) NOT NULL UNIQUE,
  PRIMARY KEY (project_id),
  CONSTRAINT valid_percent_complete CHECK(0 <= percent_completed AND percent_completed <= 100),
  CONSTRAINT start_before_deadline CHECK(start_date <= deadline),
  CONSTRAINT bool_is_ongoing CHECK(is_ongoing=0 OR is_ongoing=1)
);


-- -----------------------------------------------------
-- Table employees_projects
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS employees_projects (
  employee_id INT UNSIGNED NOT NULL,
  project_id INT UNSIGNED NOT NULL,
  date_of_work DATE NOT NULL,
  number_hours TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (employee_id,project_id,date_of_work), -- I changed the primary key to be a new field, "entry_id", since there can be multiple entries with the same (employee_id,project_id)
  CONSTRAINT fk_employees_has_projects_employees1
    FOREIGN KEY (employee_id)
    REFERENCES employees (employee_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_employees_has_projects_projects1
    FOREIGN KEY (project_id)
    REFERENCES projects (project_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT err_duplicate_input UNIQUE(employee_id,project_id,date_of_work),
  CONSTRAINT over_max_hours_in_day CHECK(number_hours <= 24)
);

DESCRIBE roles;
DESCRIBE employees;
DESCRIBE salaries;
DESCRIBE projects;
DESCRIBE employees_projects;


---------------------- Filling the tables ---------------------------

INSERT INTO roles VALUES
(DEFAULT, "CEO of Beavers for Better"),
(DEFAULT, "Senior Mechanical Engineer"),
(DEFAULT, "Mechanical Engineer"),
(DEFAULT, "Senior Electric Engineer"),
(DEFAULT, "Electric Engineer"),
(DEFAULT, "Senior Software Engineer"),
(DEFAULT, "Software Engineer"),
(DEFAULT, "Head of Communications"),
(DEFAULT, "Technical Writer"),
(DEFAULT, "Kinesthetics Specialist"),
(DEFAULT, "AI Systems Specialist");

INSERT INTO employees VALUES
(DEFAULT, '2020-12-31', "Benny Beaverton", (SELECT role_id FROM roles WHERE role_name="CEO of Beavers for Better"),1,"5551 NW Harrison Blvd",'1990-10-6'),
(DEFAULT, '2020-12-31', "Blaid Beaverton", (SELECT role_id FROM roles WHERE role_name="Senior Mechanical Engineer"),1,"5551 NW Harrison Blvd",'1992-11-4'),
(DEFAULT, '2021-3-1', "Oregon Duck", (SELECT role_id FROM roles WHERE role_name="Electric Engineer"),0,"2555 SE Portland Ave",'1990-10-6'),
(DEFAULT, '2021-12-31', "Roger Smith", (SELECT role_id FROM roles WHERE role_name="Senior Software Engineer"),1,"8750 Rocky Way",'1995-5-5');

INSERT INTO salaries VALUES
(DEFAULT, '2020-12-31', 18.00, (SELECT employee_id FROM employees WHERE name="Benny Beaverton")),
(DEFAULT, '2021-12-31', 22.00, (SELECT employee_id FROM employees WHERE name="Benny Beaverton")),
(DEFAULT, '2022-12-31', 30.00, (SELECT employee_id FROM employees WHERE name="Benny Beaverton")),
(DEFAULT, '2020-12-31', 18.00, (SELECT employee_id FROM employees WHERE name="Blaid Beaverton")),
(DEFAULT, '2021-12-31', 23.00, (SELECT employee_id FROM employees WHERE name="Blaid Beaverton")),
(DEFAULT, '2022-12-31', 34.00, (SELECT employee_id FROM employees WHERE name="Blaid Beaverton")),
(DEFAULT, '2021-3-1', 18.00, (SELECT employee_id FROM employees WHERE name="Oregon Duck")),
(DEFAULT, '2022-3-1', 18.01, (SELECT employee_id FROM employees WHERE name="Oregon Duck")),
(DEFAULT, '2022-12-1', 18.02, (SELECT employee_id FROM employees WHERE name="Oregon Duck")),
(DEFAULT, '2021-12-31', 22.00, (SELECT employee_id FROM employees WHERE name="Roger Smith")),
(DEFAULT, '2022-12-31', 32.00, (SELECT employee_id FROM employees WHERE name="Roger Smith"));

INSERT INTO projects VALUES
(DEFAULT, 1, 85, '2024-2-12','2022-11-20', "OSURC Autonomous Mars Rover"),
(DEFAULT, 1, 10, '2024-10-19','2023-5-4', "Cryptic Technomancer"),
(DEFAULT, 0, 100, '2023-1-1', '2020-1-1', "Wall-E");

INSERT INTO employees_projects VALUES
((SELECT employee_id FROM employees WHERE name="Benny Beaverton"), (SELECT project_id FROM projects WHERE project_name="Wall-E"),
'2020-1-1',7),
((SELECT employee_id FROM employees WHERE name="Blaid Beaverton"), (SELECT project_id FROM projects WHERE project_name="Wall-E"),
'2020-1-1',4),
((SELECT employee_id FROM employees WHERE name="Oregon Duck"), (SELECT project_id FROM projects WHERE project_name="Wall-E"),
'2020-1-1',1),
((SELECT employee_id FROM employees WHERE name="Benny Beaverton"), (SELECT project_id FROM projects WHERE project_name="Wall-E"),
'2020-1-2',9),
((SELECT employee_id FROM employees WHERE name="Blaid Beaverton"), (SELECT project_id FROM projects WHERE project_name="Wall-E"),
'2020-1-2',9),
((SELECT employee_id FROM employees WHERE name="Benny Beaverton"), (SELECT project_id FROM projects WHERE project_name="Wall-E"),
'2020-1-3',8),
((SELECT employee_id FROM employees WHERE name="Blaid Beaverton"), (SELECT project_id FROM projects WHERE project_name="Wall-E"),
'2020-1-3',10),
((SELECT employee_id FROM employees WHERE name="Oregon Duck"), (SELECT project_id FROM projects WHERE project_name="Wall-E"),
'2020-1-3',2);


SELECT * FROM employees;
SELECT * FROM salaries;
SELECT * FROM roles;
SELECT * FROM projects;
SELECT * from employees_projects;