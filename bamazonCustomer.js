// dependencies
var mysql = require("mysql");
var inquire = require("inquirer");

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

// Start function, displays all items for sale and calls purchase function
function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(element => {
            console.log("\x1b[37m", "Item # " + element.item_id + " " + element.product_name + " $" + element.price + "\n");
        })
        purchase();
    })
}

// Asks user which item and how many of it they want to buy
function purchase() {
    inquire.prompt([
        {
            type: "input",
            message: "Which item number would you like to purchase?",
            name: "item",
        },
        {
            type: "input",
            message: "How many would you like to purchase?",
            name: "amt",
        },
        // then checks to see if there are enough
    ]).then(function (response) {
        connection.query("SELECT * FROM products WHERE ?", { item_id: response.item }, function (err, res) {
            // console.log(res);
            if (err) throw err;
            if (response.amt > res[0].stock_quantity) {
                console.log("\x1b[31m", "Purchase quantity exceeds stock.")
                start();
            // if there are, it updates the item, subtracting the stock sold, and adds the sales to the appropriate field
            } else {
                var quant = res[0].stock_quantity - parseInt(response.amt);
                var spend = res[0].product_sales + (res[0].price * parseInt(response.amt));
                // console.log(quant);
                connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: quant, product_sales: spend }, { item_id: response.item }],
                    function (err) {
                        if (err) throw err;
                    }
                )
                // finally, it lets the user know that their purchase was successful and restarts the app so they can buy more
                console.log("\x1b[37m", "You successfully purchased " + response.amt + " of " + res[0].product_name + ".\n");
                start();
            }
        })
    })
}

// calls the connect to the db, starting the app
connect();