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

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(element => {
            console.log("Item # " + element.item_id + " " + element.product_name + " $" + element.price + "\n");
        })
        purchase();
    })
}

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
    ]).then(function (response) {
        connection.query("SELECT * FROM products WHERE ?", { item_id: response.item }, function (err, res) {
            console.log(res);
            if (err) throw err;
            if (response.amt > res[0].stock_quantity) {
                console.log("Purchase quantity exceeds stock.")
                start();
            } else {
                var quant = res[0].stock_quantity - parseInt(response.amt);
                var spend = res[0].price * parseInt(response.amt);
                console.log(quant);
                connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: quant, product_sales: spend }, { item_id: response.item }],
                    function (err) {
                        if (err) throw err;
                    }
                )
                console.log("You successfully purchased " + response.amt + " of " + res[0].product_name + ".\n");
                start();
            }
        })
    })
}

connect();