const mysql = require("mysql2");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employees_db",
});

// Connecting to database
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database.");
  promptUser();
});

function promptUser() {
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
    ])
    .then((answers) => {
      // Return tables based on user choice
      switch (answers.choice) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        default:
          console.log("Choice not recognized");
          break;
      }
    });
}

// "View all departments" response table
function viewAllDepartments() {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    console.table(results);
    // Prompt for next action
    promptUser();
  });
}

// "View all roles" response table
function viewAllRoles() {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    console.table(results);
    // Prompt for next action
    promptUser();
  });
}

// "View all employees" response table
function viewAllEmployees() {
  // Joining from employee & role tables
  const query = `
    SELECT 
      employee.id, 
      employee.first_name, 
      employee.last_name, 
      role.title, 
      department.name AS department, 
      role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;
  `;

connection.query(query, (err, results) => {
  if (err) {
    console.error("Failed to query the database:", err);
    return;
  }
  console.table(results);
  promptUser();
});
}

// "Add a department" response table
function addDepartment() {
  // Prompt user for the department name
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of the department you want to add?",
      },
    ])
    .then((answer) => {
      // Inserting new department
      const query = "INSERT INTO department (name) VALUES (?)";
      connection.query(query, [answer.departmentName], (err, results) => {
        if (err) throw err;
        console.log(`The table has been updated`);
        // Prompt for next action
        promptUser();
      });
    });
}

// "Add a role" response table
function addRole() {
  // Getting dept. id for the prompt
  connection.query("SELECT id, name FROM department", (err, departments) => {
    if (err) throw err;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    // Prompt user for role details
    inquirer
      .prompt([
        {
          type: "input",
          name: "roleTitle",
          message: "What is the title of the role you want to add?",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "What is the salary for this role?",
        },
        {
          type: "list",
          name: "roleDept",
          message: "Which department does this role belong to?",
          choices: departmentChoices,
        },
      ])
      .then((answer) => {
        // Inserting new role
        const query =
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        connection.query(
          query,
          [answer.roleTitle, answer.roleSalary, answer.roleDept],
          (err, results) => {
            if (err) throw err;
            console.log("The role table has been updated.");
            // Prompt for next action
            promptUser();
          }
        );
      });
  });
}

// "Add an employee" response table
function addEmployee() {
  // Get roles for the role choice list
  connection.query("SELECT id, title FROM role", (err, roles) => {
    if (err) throw err;
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    // Get employees for the manager choice list
    connection.query(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee",
      (err, managers) => {
        if (err) throw err;
        const managerChoices = managers.map(({ id, name }) => ({
          name: name,
          value: id,
        }));
        managerChoices.unshift({ name: "None", value: null }); // option for no manager

        // Prompt user for  employee details
        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "What is the employee's first name?",
            },
            {
              type: "input",
              name: "lastName",
              message: "What is the employee's last name?",
            },
            {
              type: "list",
              name: "roleId",
              message: "What is the employee's role?",
              choices: roleChoices,
            },
            {
              type: "list",
              name: "managerId",
              message: "Who is the employee's manager?",
              choices: managerChoices,
            },
          ])
          .then((answer) => {
            const query =
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            connection.query(
              query,
              [
                answer.firstName,
                answer.lastName,
                answer.roleId,
                answer.managerId,
              ],
              (err, results) => {
                if (err) throw err;
                console.log("Employee has been added successfully.");
                // Prompt for next action
                promptUser();
              }
            );
          });
      }
    );
  });
}