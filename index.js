const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const fs = require("fs");

(async () => {
  const secrets = require("./secrets.json");

  const connection = await mysql.createConnection({
    host: "localhost",
    // Your username
    user: "root",
    // Your password
    password: secrets.password,
    database: "testdb",
  });

  await connection.query("DROP TABLE IF EXISTS Employees");
  await connection.query("DROP TABLE IF EXISTS Roles");
  await connection.query("DROP TABLE IF EXISTS Departments");

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
          "List Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
          "Done",
        ],
      },
    ]);

      // full employee list to include id, name, title, dept, salary & manager
    if (answer.choice === "List Employees") {
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

      for (let i = 0; i < rows.length; i++) {
        const employee = rows[i];
        console.log(employee.first_name + " " + employee.last_name);
      }
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
    } 
    else if (answer.choice === "Add Role") {
      const [rows] = await connection.query(
        `SELECT department_name, department_id FROM Departments;`
      );

      console.log(rows);

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
    } 
    else if (answer === "Add Employee") {
      const [rows] = await connection.query(
        `SELECT job_title, role_id FROM Roles;`
      );

      console.log(rows);

      const choices = rows.map(function (role) {
        return role.job_title;
      });
      //add new employee first name
      const newEmployeeAnswers = await inquirer.prompt([
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
          name: "LastName",
          validate: (typeInput) => {
            if (typeInput) {
              return true;
            } else {
              return "Please enter the new employee's Last name.";
            }
          },
        },
         //assign role to a specific department
         {
          type: "list",
          name: "EmployeeDepartmentName",
          message: "Which department does this work in?",
          choices: choices,
        },
      ]);

      for (let i = 0; i < rows.length; i++) {
        if (rows[i].department_name === roleAnswers.EmployeeDepartmentName) {
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
    } 
    else if (answer === "Add Employee") {
      const [rows] = await connection.query(
        `SELECT job_title, role_id FROM Roles;`
      );

      console.log(rows);

      const choices = rows.map(function (role) {
        return role.job_title;
      });
        //add new employee's role/title
        {
          type: "input",
          message: "Who is the new employee's manager?",
          name: "managerName",
          choices: choices,
          validate: (typeInput) => {
            if (typeInput) {
              return true;
            } else {
              return "Please enter the new manager's role.";
            }
          },
        },
      ]);
    } 
    
    else {
      await connection.end();
      runAgain = false;
    }
  }
})();
