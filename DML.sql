-- all variable names are surrounded by two percents (eg, %%var_name%%)

---------------- Triggers to double check data integrity ---------------
-- CREATE TRIGGER role_insert_check
-- BEFORE INSERT ON roles
-- FOR EACH ROW 
-- BEGIN
--   IF NEW.role_id NOT RLIKE "^[0-9]+$" 
--   OR NEW.role_name NOT RLIKE "^[a-Z]+$"
--   THEN
--     SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid role entry'
--   END IF;
-- END;

-------------------------- Role Table Queries --------------------------
-- Viewing the table as a whole
SELECT * FROM roles;

-- Adding a new role to the table
INSERT INTO roles VALUES
(DEFAULT,%%role_name%%);

-- Changing an existing role
UPDATE roles SET role_name=%%role_name%%
WHERE role_id=%%role_id%%;

-- Deleting a role might cause problems since other data depends on it
-- even if nobody uses the role now, that may not be the case in the future...
-- NO DELETE

-- Retrieve the number of working employees for each role
-- Useful for seeing the skill areas a company may need to fill/cut
SELECT r.role_id as "role_id", r.role_name, SUM(1) as "number of workers"
FROM employees as e, roles as r
WHERE e.role = r.role_id
AND e.employee_status = 1
GROUP BY e.role
UNION
SELECT r.role_id as "role_id", r.role_name, 0 as "number of workers"
FROM roles as r
WHERE r.role_id NOT IN 
(
    SELECT role
    FROM employees
    WHERE employee_status=1
);


-------------------------- Employee Table Queries --------------------------

-- Viewing the table as a whole
SELECT * FROM employees;

-- Viewing all employees whom are of a particular role
SELECT *
FROM employees
WHERE role=%%role_id%%;

-- Searching for employees of a particular name
SELECT *
FROM employees
WHERE name=%%name%%;

-- Finding the current salary of an employee %%employee%% as of the date %%date%%
SELECT name, role, MAX(effective_date) AS "effective_date", pay_amount
FROM employees AS e, salaries AS s
WHERE e.employee_id=%%employee%%
AND e.employee_id = s.employee_id
AND s.effective_date < %%date%%;

-- Adding a new employee to the DB
INSERT INTO employees VALUES
(
DEFAULT, 
%%hire_date%%, 
%%full_name%%,
%%role_id%%,
1, 
%%address%%, 
%%birthdate%%
);

-- We shouldn't be taking employees out of the DB, in case we need to
-- refer back to them in the future for any reason
-- NO DELETE

-- We should, however, be able to mark employees based on their current status
UPDATE employees SET employee_status=%%employee_status%% 
WHERE employee_id=%%employee_id%%;

-- We should also allow our admin to modify the other aspects of an employee's data
UPDATE employees SET 
hire_date=%%hire_date%%, 
name=%%new_name%%, 
role=%%role_id%%, 
employee_status=%%employee_status%%, 
address=%%address%%, 
birthdate=%%birthdate%%
WHERE employee_id=%%employee_id%%;

-- SELECT * FROM employees;



-------------------------- Salaries Table Queries --------------------------
-- Viewing the entire salary table
SELECT * 
FROM salaries;

-- Adding a new salary to the table
INSERT INTO salaries VALUES
(DEFAULT,%%effective_date%%, %%ammount%%, %%employee_id%%);

-- We want to have the ability to DELETE salaries in a *very*
-- limited capacity to ensure all employees' salary histories are
-- accurate. Thus, we allow deletes here, but the TRIGGER
-- "delete_within_the_month" limits what can be deleted. See DDL.sql
-- for more information on this.
-- Essentially, you should be deleteing salaries with incorrect info
-- by the end of the month
DELETE FROM salaries
WHERE employee_id=%%employee_id%% 
AND effective_date=%%effective_date%%;


-- Under the same logic, we don't want to be able to UPDATE salaries,
-- as this would result in the same inability to track salary history
-- NO UPDATE





-------------------------- Projects Table Queries --------------------------
-- Viewing the table as a whole
SELECT * FROM projects;

-- Viewing active projects
SELECT * 
FROM projects
WHERE is_ongoing=1; 

-- Viewing inactive projects
SELECT * 
FROM projects
WHERE is_ongoing=0; 

-- Viewing all employees whom are working on a project
-- (and whom are still actively working on said project)
SELECT name, role 
FROM employees 
WHERE employee_status=1
OR employee_status=2    -- assuming that, if someone is sick, they'll be back soon 
AND employee_id IN 
  (
  SELECT UNIQUE employee_id 
  FROM employees_projects
  WHERE project_id=%%project_id%%
  );

-- Adding a new project to the table
INSERT INTO projects VALUES
(DEFAULT, 1, 0, %%deadline%%, %%start_date%%, %%project_name%%);

-- We want to be able to refer back to previous projects for analytics,
-- so we shouldn't DELETE projects
-- NO DELETE

-- Instead, as with employees, we should mark projects as inactive
UPDATE projects SET is_ongoing=0
WHERE project_id=%%project_id%%;

-- Or active
UPDATE projects SET is_ongoing=1
WHERE project_id=%%project_id%%;

-- Similarly, we should allow the other attributes of a project
-- to be edited by an admin
UPDATE projects SET project_name=%%project_name%%, 
percent_completed=%%percent_completed%%, 
deadline=%%deadline%%, 
start_date=%%start_date%%
WHERE project_id=%%project_id%%;

-- For ease of use, there should be specific queries to edit parts of a
-- project that may change often, such as the deadline or % completed
UPDATE projects SET deadline=%%deadline%%
WHERE project_id=%%project_id%%;

UPDATE projects SET percent_completed=%%percent_completed%%
WHERE project_id=%%project_id%%;


-------------------------- Employees_Projects Table Queries --------------------------
-- Viewing the entire table
SELECT * FROM employees_projects;

-- Viewing what the employee X has been working on
-- from the date range ST to ED
SELECT name, role, employee_status, project_id, date_of_work, number_hours
FROM employees AS e, employees_projects as ep
WHERE e.employee_id=%%X%%
AND date_of_work >= %%ST%%
AND date_of_work <= %%ED%%
AND e.employee_id=ep.employee_id;

-- Check the total number of hours that have been
-- put into project X
SELECT p.project_id, project_name, deadline, percent_completed, SUM(number_hours) as "Total Hours"
FROM employees_projects as ep, projects as p
WHERE p.project_id=ep.project_id
AND p.project_id=%%X%%;

-- Adding an entry
INSERT INTO employees_projects VALUES
(%%employee_id%%, %%project_id%%, %%date_of_work%%, %%number_hours%%);

-- In the case where an admin finds incorrect information entered by
-- an employee (eg, wrong project listed, wrong date of work), we
-- should give the admin the ability to correct the mistake
UPDATE employees_projects SET 
project_id=%%correct_project_id%%, 
date_of_work=%%correct_date_of_work%%, 
number_hours=%%correct_number_hours%%
WHERE employee_id=%%target_employee_id%% 
AND project_id=%%target_project_id%% 
AND date_of_work=%%target_day_of_work%%;

-- In the case where an admin finds falsified information (eg, an
-- employee listing that they worked on a day when they didn't),
-- the admin should have the ability to DELETE that information
DELETE FROM employees_projects
WHERE employee_id=%%bad_employee%% 
AND date_of_work=%%target_day_of_work%%;





-- SELECT * 
-- FROM roles as r
-- WHERE r.role_id RLIKE '^[0-9]+$';


-- INSERT INTO roles VALUES
-- (DEFAULT, 11);