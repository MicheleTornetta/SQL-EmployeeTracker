const mysql = require('mysql2/promise');
const fs = require('fs');

(async () => {
  const secrets = require('./secrets.json');

  const connection = await mysql.createConnection({
    host: "localhost",
    // Your username
    user: "root",
    // Your password
    password: secrets.password,
    database: "testdb"
  });

  console.log('a');

  await connection.query('DROP TABLE IF EXISTS Employees');
  await connection.query('DROP TABLE IF EXISTS Roles');
  await connection.query('DROP TABLE IF EXISTS Departments');
  
  const schema = fs.readFileSync('Develop/db/schema.sql').toString().split('-- END TABLE');
  for (let i = 0; i < schema.length; i++) {
    await connection.query(schema[i]);
  }

  const seed = fs.readFileSync('Develop/db/seed.sql').toString().split('\n');

  for (let i = 0; i < seed.length; i++) {
    await connection.query(seed[i]);
  }
  
  // // simple query
  // const [results, fields] = await connection.query('SELECT * FROM Employees');
  // console.log(results); // results contains rows returned by server
  // console.log(fields.map(x => x.name).join('\n')); // fields contains extra meta data about results, if available

  // // with placeholder
  // connection.query(
  //   'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
  //   ['Page', 45],
  //   function(err, results) {
  //     console.log(results);
  //   }
  // );
  
  
  await connection.end();
  
  
  // //see lesson 10 - 01 activities - 00 Ins_File...etc and will need to use switch
  
  // /*const { renderPlaceholder } = require("./src/helper");*/
  // const Employee = require("./lib/employee");
  // const fs = require("fs");
  // const inquirer = require("inquirer");
  // const Manager = require("./lib/manager");
  // const Role = require("./lib/role");
  // const createHtml = require("./src/createhtml");
  
  // // html framework - pulling in data
  
  // function writeHtmlFile(data) {
  //   const html = `<!DOCTYPE html>
  //   <html lang="en">
  //     <head>
  //       <meta charset="UTF-8" />
  //       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //       <link
  //         href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
  //         rel="stylesheet"
  //         integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
  //         crossorigin="anonymous"
  //       />
  //       <script
  //         src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
  //         integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
  //         crossorigin="anonymous"
  //         defer
  //       ></script>
  //       <link rel="stylesheet" href="../assets/css/reset.css" />
  //       <link rel="stylesheet" href="../assets/css/style.css" />
  //       <title>Output Html</title>
  //     </head>
  //     <body>
  //       <ul class="container text-center">
  //         <li class="row">
  //           <div class="col" id="topBanner">
  //             <h1>My Team</h1>
  //           </div>
  //         </li>
  //         ${data}
  //       </ul>
  //     </body>
  //   </html>`;
  
  //   fs.writeFile("./dist/index.html", html, (err) => {
  //     if (err) return console.error(err);
  //     console.log("Success!");
  //   });
  // }
  
  
  
  // let init = async () => {
  //   let employees = [];
  //   let runAgain = true;
  //   // ask general employee questions
  //   while (runAgain) {
  //     let answer = await inquirer.prompt([
  //       {
  //         type: "list",
  //         name: "choice",
  //         message: "Do you wish to add an employee?",
  //         choices: ["Yes", "No"],
  //       },
  //     ]);
  
  //     if (answer.choice === "Yes") {
  //       let answers = await inquirer.prompt([
  //         {
  //           type: "input",
  //           message: "What is your full name?",
  //           name: "name",
  //           validate: (typeInput) => {
  //             if (typeInput) {
  //               return true;
  //             } else {
  //               return "Please enter your full name to continue.";
  //             }
  //           },
  //         },
  //         {
  //           type: "input",
  //           message: "What is your work ID?",
  //           name: "id",
  //           validate: (typeInput) => {
  //             if (!isNaN(Number(typeInput))) {
  //               return true;
  //             } else {
  //               return "Please enter your ID number to continue.";
  //             }
  //           },
  //         },
  //         {
  //           type: "input",
  //           message: "What is your email address?",
  //           name: "email",
  //           validate: (typeInput) => {
  //             if (typeInput.includes("@")) {
  //               return true;
  //             } else {
  //               return "Please enter your email address to continue.";
  //             }
  //           },
  //         },
  //         {
  //           type: "list",
  //           name: "title",
  //           message: "What is your job position?",
  //           choices: ["Manager", "Engineer", "Intern"],
  //         },
  //       ]);
  
  //       // now start the manager question
  //       if (answers.title === "Manager") {
  //         // do manager stuff
  //         let managerAnswers = await inquirer
  //           .prompt([
  //             {
  //               type: "input",
  //               name: "officeNumber",
  //               message: "What is your office Phone number?",
  //             },
  //           ]);
  
  //         let manager = new Manager(
  //           answers.name,
  //           answers.id,
  //           answers.email,
  //           managerAnswers.officeNumber
  //         );
  
  //         employees.push(manager);
  //       }
      
  //       // now start the engineer question
  //       else if (answers.title === "Engineer") {
  //         // do Engineer stuff
  //         let engineerAnswers = await inquirer
  //           .prompt([
  //             {
  //               type: "input",
  //               name: "github",
  //               message: "What is your github login id?",
  //             },
  //           ]);
  
  //         let engineer = new Engineer(
  //           answers.name,
  //           answers.id,
  //           answers.email,
  //           engineerAnswers.github
  //         );
  
  //         employees.push(engineer);
  //       }
  //       // now start the intern question
  //       else if (answers.title === "Intern") {
  //         // do Intern stuff
  //         let internAnswers = await inquirer
  //           .prompt([
  //             {
  //               type: "input",
  //               name: "school",
  //               message: "What is the name of your school?",
  //             },
  //           ]);
  
  //         let intern = new Intern(
  //           answers.name,
  //           answers.id,
  //           answers.email,
  //           internAnswers.school
  //         );
  
  //         employees.push(intern);
  //       }
  //     } 
  //     else {
  //       runAgain = false;
  //     }
  //   }
    
  //   const employeeHtml = createHtml(employees);
  //   writeHtmlFile(employeeHtml);
  // };
  // // TO DO: CREATE A FUNCTION TO PUT TABLES INTO AN HTML BOX - WILL NEED A NEW HTML BOX PER TABLE
  // function createHtmlBox() {}
  
  // init();
  
})();
