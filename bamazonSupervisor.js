// dependencies
var mysql = require("mysql");
var inquire = require("inquirer");
var Table = require("cli-table");

// Create new table instance to use for displaying info in viewSales
var table = new Table({
    head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
    colWidths: [15, 30, 17, 15, 15]
});

// Connection object
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

// Connects to db and then starts app
function connect() {
    connection.connect(function (err) {
        if (err) throw err;
        // console.log("connected as id " + connection.threadId);
        start();
    })
}

// start function, gives supervisor their options and calls appropriate function
function start(){
    inquire.prompt([
        {
            type: "list",
            choices: ["View Products Sales by Department", "Create New Department", "Quit"],
            name: "action",
            message: "What would you like to do?"
        },
    ]).then(function (answers) {        
        if (answers.action === "View Products Sales by Department") {
            viewSales();
        } else if (answers.action === "Create New Department") {
            createDept();
        } else {
            connection.end();
            return;
        }
    });
}

// displays a table of sales by department using a join between departments and products tables
function viewSales() {
    connection.query("SELECT department_id, departments.department_name, over_head_costs, products.product_sales, products.product_sales - over_head_costs AS total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY department_name;", function (err, res) {
        if (err) throw err;
        res.forEach(element => {
            table.push(
                [element.department_id, element.department_name, element.over_head_costs, element.product_sales, element.total_profit]
            );
        })
        console.log(table.toString());
        start();
    })
}

// gathers info from supervisor and creates new department in departments table
function createDept() {
    inquire.prompt([
        {
            type: "input",
            message: "What new department do you want to create?",
            name: "dept",
        },
        {
            type: "input",
            message: "What are the overhead costs of this product?",
            name: "cost",
        },
    ]).then(function (response) {
        connection.query("INSERT INTO departments SET ?", {
            department_name: response.dept,
            over_head_costs: response.cost,
        })
        console.log(response.dept + " has been added with an overhead cost of $" + response.cost + ".\n");
        start();
    })
}

// calls the connect to the db, starting the app
connect();