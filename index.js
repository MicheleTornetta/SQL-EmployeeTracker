const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const table = require("table");
const fs = require("fs");

(async () => {
  const secrets = require("./secrets.json");
//log into db
  const connection = await mysql.createConnection({
    host: "localhost",
    // Your username
    user: "root",
    // Your password
    password: secrets.password,
    database: "testdb",
  });
  //clean data for testing
  await connection.query("DROP TABLE IF EXISTS Employees");
  await connection.query("DROP TABLE IF EXISTS Roles");
  await connection.query("DROP TABLE IF EXISTS Departments");
  //create the testing data
  const schema = fs
    .readFileSync("Develop/db/schema.sql")
    .toString()
    .split("-- END TABLE");
  for (let i = 0; i < schema.length; i++) {
    await connection.query(schema[i]);
  }

  const seed = fs.readFileSync("Develop/db/seed.sql").toString().split("\n");

  for (let i = 0; i < seed.length; i++) {
    if (seed[i].trim()) {
      await connection.query(seed[i]);
    }
  }

  let runAgain = true;
  // ask what user wants to do questions
  while (runAgain) {
    let answer = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "List Departments",
          "List Roles",
          "List Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
          "Done",
        ],
      },
    ]);

    // full department list 
    if (answer.choice === "List Departments") {
      //getting data from database
      const [rows] = await connection.query(`
        SELECT department_id, department_name FROM Departments`);
        
      const formatted = [
        [
          "Department ID",
          "Department Name",
        ],
        ...rows.map((row) => {
          
          return [
            row.department_id,
            row.department_name,

          ];
        }),
      ];

      console.log(table.table(formatted));
    }

    // full role/title list 
    else if (answer.choice === "List Roles") {
      //getting data from database
      const [rows] = await connection.query(`
      SELECT role_id, job_title FROM roles`);
        
      const formatted = [
        [
          "Role ID",
          "Title",
        ],
        ...rows.map((row) => {
          
          return [
            row.role_id,
            row.job_title,

          ];
        }),
      ];

      console.log(table.table(formatted));
    }

    // full employee list to include id, name, title, dept, salary & manager
    else if (answer.choice === "List Employees") {
      // to join differnt tables
      const [rows] = await connection.query(`
        SELECT 
          Employees.*, Roles.job_title, Roles.salary, 
          Departments.department_name, managers.first_name AS manager_first_name, 
          managers.last_name AS manager_last_name
        FROM Employees
          JOIN Roles ON roles.role_id = Employees.role_id
          JOIN Departments ON roles.department_id = Departments.department_id
          LEFT JOIN Employees managers ON managers.employee_id = Employees.manager_id;`);

      const formatted = [
        [
          "Employee ID",
          "First Name",
          "Last Name",
          "Job Title",
          "Department",
          "Salary",
          "Manager",
        ],
        ...rows.map((row) => {
          let manager;
          if (row.manager_first_name) {
            manager = row.manager_first_name + " " + row.manager_last_name;
          } else {
            manager = "None";
          }

          return [
            row.employee_id,
            row.first_name,
            row.last_name,
            row.job_title,
            row.department_name,
            "$" + row.salary,
            manager,
          ];
        }),
      ];

      console.log(table.table(formatted));
      //add department
    } else if (answer.choice === "Add Department") {
      const departmentAnswers = await inquirer.prompt([
        {
          type: "input",
          message: "What is the department's name?",
          name: "depName",
          validate: (typeInput) => {
            if (typeInput) {
              return true;
            } else {
              return "Please enter the department's name.";
            }
          },
        },
      ]);
      //add new department
      await connection.query(
        `
        INSERT INTO departments (department_name) VALUES (?);
        `,
        [departmentAnswers.depName]
      );
      console.log("Department added to the database.");
    } else if (answer.choice === "Add Role") {
      const [rows] = await connection.query(
        `SELECT department_name, department_id FROM Departments;`
      );

      const choices = rows.map(function (department) {
        return department.department_name;
      });
      // add new role title
      const roleAnswers = await inquirer.prompt([
        {
          type: "input",
          message: "What is the job title's name?",
          name: "roleName",
          validate: (typeInput) => {
            if (typeInput) {
              return true;
            } else {
              return "Please enter the job title's name.";
            }
          },
        },
        //add salary to role title
        {
          type: "input",
          message: "What is the salary?",
          name: "roleSalary",
          validate: (typeInput) => {
            if (!isNaN(Number(typeInput))) {
              return true;
            } else {
              return "Please enter the salary for this role.";
            }
          },
        },
        //assign role to a specific department
        {
          type: "list",
          name: "departmentName",
          message: "Which departments does this role belong to?",
          choices: choices,
        },
      ]);

      for (let i = 0; i < rows.length; i++) {
        if (rows[i].department_name === roleAnswers.departmentName) {
          await connection.query(
            `
          INSERT INTO Roles (job_title, department_id, salary) VALUES (?, ?, ?);
          `,
            [
              roleAnswers.roleName,
              rows[i].department_id,
              roleAnswers.roleSalary,
            ]
          );

          break;
        }
      }
      console.log("You have added a new employee role!");
    } else if (answer.choice === "Add Employee") {
      // ROLES
      const [rolesRows] = await connection.query(
        `SELECT job_title, role_id FROM Roles;`
      );

      const rolesChoices = rolesRows.map(function (role) {
        return role.job_title;
      });

      // MANAGERS
      const [managersRows] = await connection.query(
        `SELECT first_name, last_name, employee_id FROM Employees;`
      );

      const managersChoices = [
        "None",
        ...managersRows.map(function (employee) {
          return employee.first_name + " " + employee.last_name;
        }),
      ];

      const newEmployeeAnswers = await inquirer.prompt([
        //add new employee first name
        {
          type: "input",
          message: "What is the new employee's First Name?",
          name: "firstName",
          validate: (typeInput) => {
            if (typeInput) {
              return true;
            } else {
              return "Please enter the new employee's first name.";
            }
          },
        },
        //add new employee last name
        {
          type: "input",
          message: "What is the new employee's Last Name?",
          name: "lastName",
          validate: (typeInput) => {
            if (typeInput) {
              return true;
            } else {
              return "Please enter the new employee's Last name.";
            }
          },
        },
        //assign role to a specific rol
        {
          type: "list",
          name: "EmployeeRole",
          message: "Which role/title does this employee have?",
          choices: rolesChoices,
        },
        {
          type: "list",
          name: "EmployeeManager",
          message: "Which manager does this employee have?",
          choices: managersChoices,
        },
      ]);

      let roleId;
      let managerId;

      for (let i = 0; i < rolesRows.length; i++) {
        if (rolesRows[i].job_title === newEmployeeAnswers.EmployeeRole) {
          roleId = rolesRows[i].role_id;
          break;
        }
      }

      if (newEmployeeAnswers.EmployeeManager !== "None") {
        for (let i = 0; i < managersRows.length; i++) {
          if (
            managersRows[i].first_name + " " + managersRows[i].last_name ===
            newEmployeeAnswers.EmployeeManager
          ) {
            managerId = managersRows[i].employee_id;
            break;
          }
        }
      } else {
        managerId = null;
      }

      await connection.query(
        `
        INSERT INTO Employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);
        `,
        [
          newEmployeeAnswers.firstName,
          newEmployeeAnswers.lastName,
          roleId,
          managerId,
        ]
      );
      console.log("You have added a new employee!");
    } else if (answer.choice === "Update Employee Role") {
      // Update Role
      const [rolesRows] = await connection.query(
        `SELECT job_title, role_id FROM Roles;`
      );

      const rolesChoices = rolesRows.map(function (role) {
        return role.job_title;
      });

      // MANAGERS
      const [employeeRows] = await connection.query(
        `SELECT first_name, last_name, employee_id FROM Employees;`
      );

      const employeeChoices = employeeRows.map(function (employee) {
        return employee.first_name + " " + employee.last_name;
      });

      //find empoyee

      const answers = await inquirer.prompt([
        {
          type: "list",
          message: "Which employee?",
          name: "employeeName",
          choices: employeeChoices,
        },
        {
          type: "list",
          message: "What is the employee's new role/title?",
          name: "employeeRole",
          choices: rolesChoices,
        },
      ]);

      let roleId;

      for (let i = 0; i < rolesRows.length; i++) {
        if (rolesRows[i].job_title === answers.employeeRole) {
          roleId = rolesRows[i].role_id;
          break;
        }
      }

      let employeeId;

      for (let i = 0; i < employeeRows.length; i++) {
        if (
          employeeRows[i].first_name + " " + employeeRows[i].last_name ===
          answers.employeeName
        ) {
          employeeId = employeeRows[i].employee_id;
          break;
        }
      }

      await connection.query(
        `
        UPDATE Employees SET role_id = ? WHERE employee_id = ?;
      `,
        [roleId, employeeId]
      );

      console.log('Updated employee\'s role!');
    } else {
      await connection.end();
      runAgain = false;
    }
  }
})();
