SELECT * FROM employees;

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

-- We should also allow our admin to modify an employee's data
UPDATE employees SET hire_date='1111-1-1', name="none", role=11, is_active=0, address="none", birthdate="1111-1-1"
WHERE employee_id=1;

-- SELECT * FROM employees;



-------------------------- Role Table Queries --------------------------
-- Adding a new role to the table
INSERT INTO roles VALUES
(DEFAULT,"name");

-- Changing an existing role
UPDATE roles SET role_name="new_name"
WHERE role_id=1;

-- Deleting a role might cause problems since other data depends on it
-- NO DELETE

-- SELECT * FROM roles;



-------------------------- Salaries Table Queries --------------------------
