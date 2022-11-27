--Department Names

INSERT INTO department (department_name)
VALUES ('Business Development');

INSERT INTO department (department_name)
VALUES ('Software Development');

INSERT INTO department (department_name)
VALUES ('Human Resources');

INSERT INTO department (department_name)
VALUES ('Accounting');

INSERT INTO department (department_name)
VALUES ('Sales');

--Role Types

INSERT INTO [role] (title, department_id, salary)
VALUES ('Sales Person', 5, 80000);

INSERT INTO [role] (title, department_id, salary)
VALUES ('Engineer', 2, 100000);

INSERT INTO [role] (title, department_id, salary)
VALUES ('Human Resource Director', 3, 75000);

INSERT INTO [role] (title, department_id, salary)
VALUES ('Accountant', 4, 75000);

INSERT INTO [role] (title, department_id, salary)
VALUES ('President', 1, 175000);

INSERT INTO [role] (title, department_id, salary)
VALUES ('CEO', 1, 155000);

INSERT INTO [role] (title, department_id, salary)
VALUES ('Executive Secretary', 1, 50000);

--Employees

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jane', 'Doe', 5, NULL);