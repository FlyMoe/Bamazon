var mysql = require("mysql");
var inquirer = require('inquirer');

var con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "family99",
   database: "bamazon_db"
});

con.connect(function(err) {
   if (err) {
       console.log('Error connecting to Db');
       return;
   }
   runManager();
});

var runManager = function() {
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


// Function which returns all data for products
var productsForSale = function(){
 	con.query('SELECT * FROM products', function(err, results) {
		if (err) throw err;
		if (results == "") {
		  console.log("No Products in the database!");
		} else {
		  for (var i = 0; i < results.length; i++) {
		    console.log("ItemID: " + results[i].itemID + " || Product Name: " + results[i].productName + " || Price: " + results[i].price + 
		    			" || Quantity: " + results[i].stockQuantity);
		  }
		}
		runManager();
    });
}

// Function which returns inventory lower than 5
var lowInventory = function(){
 	con.query('SELECT * FROM products where stockQuantity < 5', function(err, results) {
		if (err) throw err;
		if (results == "") {
		  console.log("No Products in the database with less than 5 items in stock!");
		} else {
		  console.log("These items have less than 5 items in stock:");
		  for (var i = 0; i < results.length; i++) {
		    console.log("ItemID: " + results[i].itemID + " || Product Name: " + results[i].productName + " || Price: " + results[i].price + 
		    			" || Quantity: " + results[i].stockQuantity);
		  }
		}
		runManager();
    });
}

// Function which let's the manager add more items to the inventory
var addToInventory = function(){
 	con.query('SELECT * FROM products where stockQuantity < 5', function(err, results) {
		if (err) throw err;
		if (results == "") {
		  console.log("No Products in the database with less than 5 items in stock!");
		} else {
		  console.log("These items have less than 5 items in stock:");
		  for (var i = 0; i < results.length; i++) {
		    console.log("ItemID: " + results[i].itemID + " || Product Name: " + results[i].productName + " || Price: " + results[i].price + 
		    			" || Quantity: " + results[i].stockQuantity);
		  }
		}
		runManager();
    });
}