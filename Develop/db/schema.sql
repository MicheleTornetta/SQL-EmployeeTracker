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

