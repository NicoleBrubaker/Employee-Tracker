const inquirer = require("inquirer");

inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
    },
    {
      type: "input",
      message: "What is your user name?",
      name: "username",
    },
  ])
//   .then((response) =>
//     response.confirm === response.password
//       ? console.log("Success!")
//       : console.log("You forgot your password already?!")
//   );
