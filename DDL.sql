-- -------------------- Creating the tables ---------------------------

DROP TABLE IF EXISTS employees_projects;
DROP TABLE IF EXISTS salaries;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employee_statuses;

-- I made most of the ints UNSIGNED since we won't be dealing with
-- negative numbers

-- -----------------------------------------------------
-- Table roles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  role_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(45) NOT NULL UNIQUE,
  PRIMARY KEY (role_id),
  CONSTRAINT valid_role_name CHECK( role_name RLIKE '^[[a-z]|[A-Z]]+$' )
);

CREATE TABLE IF NOT EXISTS statuses (
  status_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  status_name VARCHAR(45) NOT NULL UNIQUE,
  PRIMARY KEY (status_id),
  CONSTRAINT valid_status_name CHECK( status_name RLIKE '^[[a-z]|[A-Z]]+$')
);

-- -----------------------------------------------------
-- Table employees
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
  employee_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  hire_date DATE NOT NULL,
  name VARCHAR(45) NOT NULL,
  role INT UNSIGNED NULL, -- changed to NULLable for 1:M partial participation / NULLable FK requirement
  employee_status INT UNSIGNED NOT NULL,
  address VARCHAR(45) NULL,
  birthdate DATE NOT NULL, -- changed to be NOT NULL for duplicate checks
  PRIMARY KEY (employee_id),
  CONSTRAINT fk_employees_role_types
    FOREIGN KEY (role)
    REFERENCES roles (role_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_employee_statuses
    FOREIGN KEY (employee_status)
    REFERENCES statuses (status_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT not_already_in_table UNIQUE(name,birthdate),
  CONSTRAINT valid_hire_date CHECK(
    hire_date NOT RLIKE "^0000-00-00$" -- if an invalid date is entered, date defaults to 0000-00-00
  ),
  CONSTRAINT valid_birth_date CHECK (
    birthdate NOT RLIKE "^0000-00-00$" -- see above
  ),
  CONSTRAINT hire_date_after_bday CHECK(birthdate <= hire_date)
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
  CONSTRAINT not_in_table_already UNIQUE(employee_id,effective_date),
  CONSTRAINT valid_effective_date CHECK (
    effective_date NOT RLIKE "^0000-00-00$" -- if invalid entry for date, get "0000-00-00"
  )
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
  CONSTRAINT bool_is_ongoing CHECK(is_ongoing=0 OR is_ongoing=1),
  CONSTRAINT valid_deadline_date CHECK (
    deadline NOT RLIKE "^0000-00-00$" -- if invalid entry for date, get "0000-00-00"
  ),
  CONSTRAINT valid_start_date CHECK (
    start_date NOT RLIKE "^0000-00-00$" -- if invalid entry for date, get "0000-00-00"
  ),
  CONSTRAINT valid_project_name CHECK( project_name RLIKE '^[[a-z]|[A-Z]]+[0-9]*$' )
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



-- -------------------- Data Integrity Triggers ---------------------

-- assuming employees are paid at the end of the month,
-- we should only allow salary adjustments to be changed within the
-- current month if we want to keep a valid record of each employee's
-- earnings history (otherwise, modifying previous month's salaries would change 
-- our results when calculating an employee's earnings history)
DROP TRIGGER IF EXISTS no_delete_past_salary;
DELIMITER $$
CREATE TRIGGER no_delete_past_salary
BEFORE DELETE ON salaries
  FOR EACH ROW 
    BEGIN
      IF YEAR(OLD.effective_date)*12 + MONTH(OLD.effective_date) < YEAR(CURRENT_DATE())*12 + MONTH(CURRENT_DATE()) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'err: cannot delete a past salary';
      END IF;
    END; $$
DELIMITER ;



-- it'd be nice to be able to delete roles added in error,
-- at the same time, we don't want to give the user the ability to
-- delete roles which are assigned to any employee - otherwise, we
-- would be creating corrupt data.
-- This check ensures that any role that is deleted is not already
-- assigned to an employee.
DROP TRIGGER IF EXISTS employee_has_role;
DELIMITER $$
CREATE TRIGGER employee_has_role
BEFORE DELETE ON roles
  FOR EACH ROW 
    BEGIN
      IF OLD.role_id IN (SELECT role FROM employees) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'err: cannot delete a role which an active or inactive employee possesses';
      END IF;
    END; $$
DELIMITER ;



-- it'd be nice to be able to delete employees added in error,
-- at the same time, we don't want to give the user the ability to
-- delete employees which are connected to other pieces of data - 
-- otherwise, we could create corrupt data.
-- This check ensures that an employee that is deleted is not
-- connected to any other piece of data.
DROP TRIGGER IF EXISTS employee_dependancy;
DELIMITER $$
CREATE TRIGGER employee_dependancy
BEFORE DELETE ON employees
  FOR EACH ROW 
    BEGIN
      IF OLD.employee_id IN (SELECT employee_id FROM salaries) OR OLD.employee_id IN (SELECT employee_id FROM employees_projects) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'err: cannot delete an employee who is referenced elsewhere in the database.';
      END IF;
    END; $$
DELIMITER ;



-- it'd be nice to be able to delete projects added in error,
-- or that will never be worked on due to being scrapped before they start 
-- at the same time, we don't want to give the user the ability to
-- delete projects which are connected to other pieces of data - 
-- otherwise, we could create corrupt data.
-- This check ensures that an project that is deleted is not
-- found within employee_projects.
DROP TRIGGER IF EXISTS project_dependancy;
DELIMITER $$
CREATE TRIGGER project_dependancy
BEFORE DELETE ON projects
  FOR EACH ROW 
    BEGIN
      IF OLD.project_id IN (SELECT project_id FROM employees_projects) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'err: cannot delete a project that has already been worked on.';
      END IF;
    END; $$
DELIMITER ;



-- -------------------- Filling the tables ---------------------------
INSERT INTO statuses VALUES
(DEFAULT, "Active"),
(DEFAULT, "Sick"),
(DEFAULT, "Medical Leave"),
(DEFAULT, "Fired"),
(DEFAULT, "Quit");



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
(DEFAULT, '2021-3-1', "Oregon Duck", (SELECT role_id FROM roles WHERE role_name="Electric Engineer"),4,"2555 SE Portland Ave",'1990-10-6'),
(DEFAULT, '2023-1-31', "Roger Smith", (SELECT role_id FROM roles WHERE role_name="Senior Software Engineer"),1,"8750 Rocky Way",'1995-5-5'),
(DEFAULT, '2023-1-31', "Tweedle Dee", (SELECT role_id FROM roles WHERE role_name="Software Engineer"),1,"1458 Wonderland Way",'1895-5-5'),
(DEFAULT, '2023-1-31', "Tweedle Dum", (SELECT role_id FROM roles WHERE role_name="Software Engineer"),1,"1458 Wonderland Way",'1895-5-5'),
(DEFAULT, '2023-1-31', "Knives Chau", (SELECT role_id FROM roles WHERE role_name="Software Engineer"),1,"555 Westward Way",'2000-10-10'),
(DEFAULT, '2023-1-31', "Scott Pilgrim", (SELECT role_id FROM roles WHERE role_name="Electric Engineer"),1,"8705 Scotty Blvd",'1999-10-12'),
(DEFAULT, '2023-1-31', "Luke Skywalker", (SELECT role_id FROM roles WHERE role_name="Electric Engineer"),1,"0000 Milky Way",'2000-12-12');

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
(DEFAULT, '2023-12-31', 32.00, (SELECT employee_id FROM employees WHERE name="Roger Smith"));

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

-- INSERT INTO employees VALUES
-- (DEFAULT, '2020-5-10', "Sal sunman", (SELECT role_id FROM roles WHERE role_name="CEO of Beavers for Better"),1,"5551 NW Harrison Blvd",'2025-5-10');