var mysql = require("mysql");
var inquire = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

function connect() {
    connection.connect(function (err) {
        if (err) throw err;
        // console.log("connected as id " + connection.threadId);
        start();
    })
}

function start(){
    inquire.prompt([
        {
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
            name: "action",
            message: "What would you like to do?"
        },
    ]).then(function (answers) {        
        if (answers.action === "View Products for Sale") {
            viewProducts();
        } else if (answers.action === "View Low Inventory") {
            viewInventory();
        } else if (answers.action === "Add to Inventory") {
            addInventory();
        } else if (answers.action === "Add New Product") {
            addProduct();
        } else {
            connection.end();
            return;
        }
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(element => {
            console.log("Item # " + element.item_id + " " + element.product_name + " $" + element.price);
            console.log("Quantity in stock: " + element.stock_quantity + "\n");
        })
        start();
    })
}

function viewInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        if (res.length === 0) {
            console.log("There is no low inventory.\n");
            start();
        } else {
            res.forEach(element => {
                console.log("Item # " + element.item_id + " " + element.product_name + " quantity: " + element.stock_quantity + "\n");
            })
            start();
        }
    })
}

function addInventory() {
    inquire.prompt([
        {
            type: "input",
            message: "Which product would you like to add inventory to?",
            name: "name",
        },
        {
            type: "input",
            message: "How many?",
            name: "qty",
        },
    ]).then(function (response) {
        connection.query("SELECT * FROM products WHERE ?", { item_id: response.name}, function(err, res) {
            console.log(res);
            if (err) throw err;
            var quant = res[0].stock_quantity + parseInt(response.qty);
            console.log("The quantity for " + res[0].product_name + " has been updated to " + quant + ".\n");
            connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: quant }, { item_id: response.name }],
            function (err) {
                if (err) throw err;
            })
            start();
        })        
    })
}

function addProduct() {
    inquire.prompt([
        {
            type: "input",
            message: "What item would you like to add to inventory?",
            name: "name",
        },
        {
            type: "input",
            message: "What category is this product?",
            name: "dept",
        },
        {
            type: "input",
            message: "What's the price of this item?",
            name: "price",
        },
        {
            type: "input",
            message: "How many will we have in stock?",
            name: "qty",
        },
    ]).then(function (response) {
        connection.query("INSERT INTO products SET ?", {
            product_name: response.name,
            department_name: response.dept,
            price: response.price,
            stock_quantity: response.qty,
        })
        console.log(response.name + " has been added to inventory at a price of $" + response.price + " and a quantity of " + response.qty + ".\n");
        start();
    })
}

connect();