CREATE TABLE Departments (
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR (200) NOT NULL,
	
	PRIMARY KEY (department_id)
);
-- END TABLE
CREATE TABLE Roles (
    role_id INT NOT NULL AUTO_INCREMENT,
    job_title VARCHAR (200) NOT NULL,
    department_id INT NOT NULL,
    salary INT,
	
	PRIMARY KEY (role_id),
	FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);
-- END TABLE
CREATE TABLE Employees (
	employee_id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(30) NOT NULL,
	last_name VARCHAR(30) NOT NULL,
	role_id INT NOT NULL,
	manager_id INT,

	PRIMARY KEY (employee_id),
	FOREIGN KEY (role_id) REFERENCES Roles(role_id),
	FOREIGN KEY (manager_id) REFERENCES Employees(employee_id)
);


-- see crud info 


-- INSERT INTO Departments (department_name) VALUES ("Human Resources");
-- INSERT INTO Departments (department_name) VALUES ("Engineering");

-- INSERT INTO Roles (job_title, department_id, salary) VALUES ("Hiring people", 1, 10000);
-- INSERT INTO Roles (job_title, department_id, salary) VALUES ("Code monkey", 2, 100000000);
-- INSERT INTO Roles (job_title, department_id, salary) VALUES ("Emotional support", 1, NULL);

-- SELECT Roles.job_title, Departments.department_name, Roles.department_id FROM Roles
-- 	JOIN Departments ON Roles.department_id = Departments.department_id;

-- INSERT INTO Employees (first_name, last_name, role_id, manager_id) VALUES ("Mary", "Doe", 1, NULL);

/* SELECT * FROM Employees
JOIN Roles ON roles.role_id = Employees.role_id
JOIN Departments ON roles.department_id = Departments.department_id;*/
