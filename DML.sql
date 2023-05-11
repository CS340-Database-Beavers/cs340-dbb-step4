-------------------------- Role Table Queries --------------------------
-- Adding a new role to the table
INSERT INTO roles VALUES
(DEFAULT,"name");

-- Changing an existing role
UPDATE roles SET role_name="new_name"
WHERE role_id=1;

-- Deleting a role might cause problems since other data depends on it
-- even if nobody uses the role now, that may not be the case in the future...
-- NO DELETE

-- SELECT * FROM roles;



-------------------------- Employee Table Queries --------------------------
-- Adding a new employee to the DB
INSERT INTO employees VALUES
(DEFAULT, '2023-5-10', "Tommy Wiseo", 11, 1, "420 Godknowswhere St", '1970-5-10');

-- We shouldn't be taking employees out of the DB, in case we need to
-- refer back to them in the future for any reason
-- NO DELETE

-- We should, however, mark employees as "unactive" if they leave the
-- company
UPDATE employees SET is_active=0 
WHERE employee_id=5;

-- or as active if they re-join the company
UPDATE employees SET is_active=1 
WHERE employee_id=3;

-- We should also allow our admin to modify the other aspects of an employee's data
UPDATE employees SET hire_date='1111-1-1', name="none", role=11, is_active=0, address="none", birthdate="1111-1-1"
WHERE employee_id=1;

-- SELECT * FROM employees;



-------------------------- Salaries Table Queries --------------------------
-- Adding a new salary to the table
INSERT INTO salaries VALUES
(DEFAULT,'1111-1-1',0.0,1);

-- We don't want to have ability to UPDATE salaries; this would make
-- the admin unable to track an employees' salary history
-- NO UPDATE

-- Under the same logic, we don't want to be able to DELETE salaries,
-- as this would result in the same inability to track salary history
-- NO DELETE

SELECT * FROM salaries;



-------------------------- Projects Table Queries --------------------------
-- Adding a new project to the table
INSERT INTO projects VALUES
(DEFAULT,1,0,'1111-1-1','1111-1-1',"none");

-- We want to be able to refer back to previous projects for analytics,
-- so we shouldn't DELETE projects
-- NO DELETE

-- Instead, as with employees, we should mark projects as inactive
UPDATE projects SET is_ongoing=0
WHERE project_id=1;

-- Or active
UPDATE projects SET is_ongoing=1
WHERE project_id=3;

-- Similarly, we should allow the other attributes of a project
-- to be edited by an admin
UPDATE projects SET project_name="something", percent_completed=0, deadline='1111-1-1', start_date='1111-1-1'
WHERE project_id=2;

-- For ease of use, there should be specific queries to edit parts of a
-- project that may change often, such as the deadline or % completed
UPDATE projects SET deadline='2222-2-2'
WHERE project_id=2;

UPDATE projects SET percent_completed=100
WHERE project_id=2;


-------------------------- Employees_Projects Table Queries --------------------------
-- Adding an entry
INSERT INTO employees_projects VALUES
(1,1,'1111-1-1',24);

-- In the case where an admin finds incorrect information entered by
-- an employee (eg, wrong project listed, wrong date of work), we
-- should give the admin the ability to correct the mistake
UPDATE employees_projects SET project_id=1, date_of_work='1111-1-1', number_hours=0
WHERE employee_id=1 AND project_id=2 AND date_of_work='1111-1-1';

-- In the case where an admin finds falsified information (eg, an
-- employee listing that they worked on a day when they didn't),
-- the admin should have the ability to DELETE that information
DELETE FROM employees_projects
WHERE employee_id=1 AND project_id=1 AND date_of_work='1111-1-1';