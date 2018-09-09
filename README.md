# bamazon

bamazon is a command line node application with a mysql backend. It uses two tables, products and departments. There are 3 applications:
  - Customer (bamazonCustomer.js) - this application automatically presents a list of items for sale and prompts the user to purchase one.
    If there is less inventory than what you try to purchase, you will be told that you can't purchase it.

  - Manager (bamazonManager.js) - As a manager, you're presented with a list of possible actions:
    - View inventory - lists all the products and stock
    - View low inventory - shows a list of items with less than 5 in stock, or tells if there is no low inventory
    - Add inventory - allows the manager to replenish stock on items
    - Add product - allows the manager to add a new product to sell

  - Supervisor (bamazonSupervisor.js) - The Supervisor is also given a menu:
    - View sales by department - shows the sales in a nice table format, including calculating profit by subtracting overhead from sales
    - Add department - manager can add products, but supervisors can't track sales unless there are departments for all the products

This app utilizes 3 npm packages: mysql, inquirer, and cli-list.