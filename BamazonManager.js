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

// Option #1
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

// Option #2
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

// Option #3
// Function which let's the manager add more items to the inventory
var addToInventory = function(){
 	inquirer.prompt([{
     type: 'input',
     message: 'what product id do you want to add more inventory?',
     name: 'productID'
  },{
  	 type: 'input',
     message: 'Quantity of product to add?',
     name: 'productQuantity'
  }]).then(function(item) {
  	 var post = { itemID: item.productID }
  	 con.query('SELECT stockQuantity from products WHERE?', post, function(err, results) {
     	if (err) throw err;
     	var quantity = (Number(results[0].stockQuantity) + Number(item.productQuantity));
        con.query('UPDATE products SET stockQuantity = ? WHERE itemID = ?', [quantity, item.productID], function(err, results) {
	        if (err) throw err;
	        console.log("The quantity was added to the product.");	  
	        runManager();       
        });         
     });
  })
}

// Option #4
// Function which let's the manager add more items to the inventory
var addNewProduct = function(){
 	inquirer.prompt([{
     type: 'input',
     message: 'Name of the product?',
     name: 'productName'
  },{
     type: 'input',
     message: 'Department Name?',
     name: 'departmentName'
  },{
     type: 'input',
     message: 'Product Price?',
     name: 'productPrice'
  },{
     type: 'input',
     message: 'Product Quantity?',
     name: 'productQuantity'
  }]).then(function(item) {
     var post = { productName: item.productName, departmentName: item.departmentName, price: item.productPrice, 
     			stockQuantity: item.productQuantity}
     con.query('INSERT INTO products SET?', post, function(err, results) {
        if (err) throw err;         
       	console.log("Product information was inserted.");           
     });
     runManager();
  })
}