//Dependencies
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
require("console.table");
require("dotenv").config();

//MySQL
const db = mysql2.createConnection(
{
    host: "localhost",
    port: 3306,
    user: 'root',
    password: process.env.password,
    database: 'company_db'
});

//App Start
db.connect(function(err){
    if (err) throw err;
    console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝`)
    selectOption();
});

//Function that prompts user to choose an action from the list of options
const selectOption = () => {
    inquirer.prompt({
        type:'list',
        name:'option',
        message:'Choose from the list of options.',
        choices:[
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add Deparment",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Delete Role",
            "Delete Employee",
            "Delete Department",
            "Exit"
        ]
    })

    //Case Options
    .then((option) => {
        switch(option.option){
            case "Add Deparment":
            addDept();
            break;
            case "Add Role":
            addRole();
             break;
            case "Add Employee":
            addEmployee();
            break;
            case "Delete Department":
            deleteDept();
            break;
            case "Delete Employee":
            deleteEmployee();
            break;
            case "Delete Role":
            deleteRole();
            break;
            case "Exit":
            db.end();
            break;
            case "Update Employee Role":
            updateEmployeeRole();
            break;
            case "View All Departments":
            viewDepartments();
            break;
            case "View All Employees":
            viewEmployees();
            break;
            case "View All Roles":
            viewRoles();
            break;
        }
    });
}

//Add Department
addDept = () => {    
    inquirer.prompt([
        {
            name: 'deptName',
            type: 'input',
            message: 'What is the name of your new department?'
        },
    ])
    .then((answer) => {
        console.log(answer);
        db.query(`INSERT INTO department SET ?`,
        {
            name: answer.deptName
        }, 
        (err, res) => {
            if (err) throw err;
            console.table(res)
            console.log(`${answer.deptName} added successfully to Departments.\n`)
            selectOption();
        });
    });
}

//Add Employee
addEmployee = () => {
    db.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err;
        let roleChoices = res.map(({id,title}) => ({name: `${title}`, value: id }));
        db.query(`SELECT * FROM employees;`, (err, res) => {
            if (err) throw err;
            let managerChoices = res.map(({id,first_name,last_name}) => ({name: `${first_name} ${last_name}`, value: id}));
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'Enter First Name: '
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Enter Last Name: '
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'Enter Title: ',
                    choices: roleChoices
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Select Manager Manager:',
                    choices: managerChoices
                }
            ]).then((answer) => {
                db.query(`INSERT INTO employees SET ?`,{
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role,
                    manager_id: answer.manager,
                }, 
                (err, res) => {
                    if (err) throw err;
                    console.table(res)
                    console.log(`\n ${answer.firstName} ${answer.lastName} successfully added to Employees! \n`);
                    selectOption();
                })
            })
        })
    })
};

//Add Role
addRole = () => { 
    db.query(`SELECT * FROM department;`, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map(({id,name}) => ({
            value: id, name: `${id} ${name}`
        }));
        promptAddRole(departmentChoices)
    });
}
promptAddRole = (departmentChoices) =>{
    inquirer.prompt([
        {
            type: 'input',
            name:'roleTitle',
            message: 'Enter Role Title: '
        },
        {
            type: 'input',
            name:'roleSalary',
            message: 'Enter Role Salary: ' 
        },
        {
            type: 'list',
            name:'departmentID',
            message: 'Select Role Department: ',
            choices: departmentChoices
        },
    ])
    .then((answer) => {
        let query = `INSERT INTO roles SET ?`
        db.query(query,{
            title: answer.roleTitle,
            salary: answer.roleSalary,
            department_id: answer.departmentID
        },
        (err, res) => {
            if (err) throw err;
            console.table(res)
            console.log(`${answer.roleTitle} Added New Role!\n`)
            selectOption();
        });
    });
}

//Update Employee Role
updateEmployeeRole = () => {
    db.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err;
        let roleChoices = res.map(({id,title}) => ({name: `${title}`, value: id }));
        db.query(`SELECT * FROM employees;`, (err, res) => {
            if (err) throw err;
            let employeeChoices = res.map(({id,first_name,last_name}) => ({name: `${first_name} ${last_name}`, value: id}));
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Select Employee.',
                    choices: employeeChoices
                },
                {
                    name: 'newRole',
                    type: 'list',
                    message: 'Select Employee Title.',
                    choices: roleChoices
                }
            ]).then((answer) => {
                db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, 
                [
                    answer.newRole, 
                    answer.employee
                ],
                (err, res) => {
                    if (err) throw err;

                    console.table(res)
                    console.log(`Successfully updated Employee's Role! \n`);
                    selectOption();
                })
            })
        })
    })
};

//View All Departments
viewDepartments = () => {
    let query =
    `SELECT d.id, d.name
    FROM department d`
    db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
  
      selectOption();
    });
}

//View All Employees
viewEmployees = () => {
    let query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employees e
    LEFT JOIN roles r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employees m
    ON m.id = e.manager_id`
    db.query(query,(err, res) => {
      if (err) throw err;
      console.table(res);
      selectOption();
    });
}

// View All Roles
 viewRoles = () => { 
    let query =
    `SELECT r.id, r.title, r.salary, d.name AS department
    FROM roles r
    LEFT JOIN department d
    ON d.id = r.department_id`
    db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      selectOption();
    });
}

//Delete Department
deleteDept = () => {
    db.query( `SELECT * FROM department ORDER BY id ASC;`, (err,res) =>{
        if(err) throw err;
        let departments = res.map(({id,name}) => ({value:id, name:`${name}`}));
        inquirer.prompt([
            {
                name: 'deptID',
                type:'list',
                message: 'Select a department to delete.',
                choices: departments
            },
        ]) .then((answer) => {
            db.query(`DELETE FROM department WHERE ?`,
            [
                {
                    id: answer.deptID,
                },
            ],
            (err,res) => {
                if(err) throw err;
                console.log(res.affectedRows + `\n  Department Deleted!`)
                selectOption();
            })
        })
    })
}

//Delete Employee
deleteEmployee = () => {
    db.query( `SELECT * FROM employees ORDER BY id ASC;`, (err,res) =>{
          if(err) throw err;
          let employees = res.map(({id,first_name,last_name}) => ({value:id, name:`${first_name} ${last_name}`}));
          inquirer.prompt([
            {
                name: 'employeeID',
                type:'list',
                message: 'Select a employee to delete.',
                choices: employees
            },
        ]) .then((answer) => {
            db.query(`DELETE FROM employees WHERE ?`,
            [
                {
                    id: answer.employeeID,
                },
            ],
            (err,res) => {
                if(err) throw err;
                console.log(res.affectedRows + `\n Employee Deleted!`)
                selectOption();
            })
        })
    })
}

  //Delete Role
deleteRole = () => {
    db.query( `SELECT * FROM roles ORDER BY id ASC;`, (err,res) =>{
        if(err) throw err;
        let roles = res.map(({id,title}) => ({value:id, name:`${title}`}));
        inquirer.prompt([
            {
                name: 'title',
                type:'list',
                message: 'Select a role to delete.',
                choices: roles
            },
        ]) .then((answer) => {
            db.query(`DELETE FROM roles WHERE ?`,
            [
                {
                    id: answer.title,
                },
            ],
            (err,res) => {
                if(err) throw err;
                console.log(res.affectedRows + `\n Role Deleted!`)
                selectOption();
            })
        })
    })
}