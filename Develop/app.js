const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = [];
const managerQuery = [
    {
        type: "input",
        name: "name",
        message: "Enter the manager's name."
    },
    {
        type: "input",
        name: "email",
        message: "Enter the manager's email."
    },
    {
        type: "input",
        name: "id",
        message: "Enter the manager's ID number."
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Enter the office number."
    },
    {
        type: "list",
        name: "additionalMembers",
        message: "Are there any members on your team?",
        choices: ["Yes","No"]
    }
]
const employeeQuery = [
    {
        type: "input",
        name: "name",
        message: "Enter the employee's name."
    },
    {
        type: "input",
        name: "email",
        message: "Enter the employee's email."
    },
    {
        type: "input",
        name: "id",
        message: "Enter the employee's ID number."
    },
    {
        type: "list",
        name: "role",
        message: "What is the role of the employee?",
        choices: ["engineer","intern"]
    },
    {
        when: input => {
            return input.role === "intern"
        },
        type: "input",
        name: "school",
        message: "Please enter the name of your school, intern." 

    },
    {
        when: input => {
            return input.role === "engineer"
        },
        type: "input",
        name: "github",
        message: "Please enter your github username, engineer."
    },
    {
        type: "list",
        name: "additionalMembers",
        message: "Are there any more employees?",
        choices: ["Yes","No"]   
    }
]

function makeList() {
    inquirer.prompt(employeeQuery).then(response => {
        if (response.role === "Engineer") {
            var newEmployee = new Engineer(response.name, teamMembers.length +1, response.email, response.github)
        } else {
            var newEmployee = new Intern(response.name, teamMembers.length +1, response.email, response.school)
        }
        teamMembers.push(newEmployee);
        if (response.additionalMembers === "Yes") {
            console.log(" ");
            makeList();
        } else {
             if (!fs.existsSync(OUTPUT_DIR)) {
                fs.mkdirSync(OUTPUT_DIR)
              }
            fs.writeFile(outputPath, render(teamMembers), function (err){
                if(err) {
                    throw err;
                }
            })
        }
    })
}

function init() {
    inquirer.prompt(managerQuery).then(response => {
        let teamManager = new Manager(response.name, response.id, response.email, response.officeNumber);
        teamMembers.push(teamManager);
        console.log(" ");
        if(response.additionalMembers === "Yes") {
            makeList()
        } else {
            if (!fs.existsSync(OUTPUT_DIR)) {
                fs.mkdirSync(OUTPUT_DIR)
              }
            fs.writeFile(outputPath, render(teamMembers), function (err) {
                if(err) {
                    throw err
                }

            })
        }
    })
}
init();
