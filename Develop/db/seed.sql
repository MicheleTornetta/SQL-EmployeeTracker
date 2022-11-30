-- Department Names

INSERT INTO departments (department_name) VALUES ('Business Development');

INSERT INTO departments (department_name) VALUES ('Software Development');

INSERT INTO departments (department_name) VALUES ('Human Resources');


-- Role Types

INSERT INTO roles (job_title, department_id, salary) VALUES ('President', 1, 175000);

INSERT INTO roles (job_title, department_id, salary) VALUES ('Human Resource Director', 3, 75000);

INSERT INTO roles (job_title, department_id, salary) VALUES ('Engineer', 2, 100000);


-- Employees

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Miller', 1, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jannette', 'Smith', 2, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Tom', 'Carn', 3, 1);

