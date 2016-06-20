
var mysql = require("mysql");
var inquirer = require('inquirer');

var con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "family99",
   database: "topsongsdb"

});

con.connect(function(err) {
   if (err) {
       console.log('Error connecting to Db');
       return;
   }
   runSearch();
});

var runSearch = function() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer) {
        switch(answer.action) {
            case 'View Products for Sale':
                productsForSale();
            break;
            
            case 'View Low Inventory':
                lowInventory();
            break;
            
            case 'Add to Inventory':
                addToInventory();
            break;
            
            case 'Add New Product':
                addNewProduct();
            break;
        }
    })
};
