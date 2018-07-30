// Create dependencies
const mysql = require("mysql");
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Establish connection to database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Tardis1011",
    database: "bamazon"
});

// Establish connection to server
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    inquireForm();
});

//  Show Product Sales and Total Profit grouped by Department
function displayDepartments() {
    var deptArr = [];
    connection.query("SELECT  d.department_id, d.department_name, d.over_head_costs, SUM(p.sales) AS product_sales, (SUM(p.sales)-d.over_head_costs) AS total_profit FROM departments AS d INNER JOIN products AS p ON department_name = p.department GROUP BY department_id ORDER BY department_id ASC", 
    function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var tempArry =
            {
                department_id: res[i].department_id,
                department_name: res[i].department_name,
                over_head_costs: res[i].over_head_costs,
                product_sales: res[i].product_sales,
                total_profit: res[i].total_profit
            }
            deptArr.push(tempArry);
        };
        console.table('\nBamazon Departments', deptArr);
        console.log("-----------------------------------------------------\n");
        inquireForm();
    });
}

// Prompt Supervisor for new department metadata
function addDepartment() {
    inquirer.prompt([
        {
            name: "name",
            message: "Type the Department Name"
        },
        {
            name: "overhead",
            message: "Enter Current Department Overhead"
        }
    ]).then(function (answers) {
        var name = answers.name;
        var overhead = answers.overhead;
        connection.query("INSERT INTO departments SET ?",
            {
                department_name: name,
                over_head_costs: overhead
            },
            function (err, res) {
                if (err) throw err;
                inquireForm();
            });
    });
}

//  Initial customer order prompt
function inquireForm() {
    inquirer.prompt([
        {
            name: "supervisorQ",
            message: "Select an Action",
            type:  "list",
            choices:  ["View Product Sales by Department", "Create New Department","Close Application"]
        }
    ]).then(function (answers) {
        var answer = answers.supervisorQ;
        switch (answer) {

            case "View Product Sales by Department":
                displayDepartments();
                break;
    
            case "Create New Department":
                addDepartment();
                break;

            case "Close Application":
                console.log("Good bye!");
                connection.end();
                break;

            default:
                console.log("Please try again or contact your Server Administrator");
                inquireForm();
                break;
        } 
    });
}