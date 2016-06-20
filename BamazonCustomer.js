var mysql = require("mysql");
var inquirer = require('inquirer');

var con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "family99",
   database: "bamazon_db"
});

con.query('SELECT ItemID, ProductName, Price FROM products', function(err, result) {
  if (err) throw err;
  if (result == "") {
      console.log("No Results!");
   } else {
      console.log("=================================");
      console.log("======== Products For Sale ======");
      console.log("=================================");     
      for (var i = 0; i < result.length; i++) {
        console.log("ItemID: " + result[i].ItemID + " || Product Name: " + result[i].ProductName + " || Price: " + result[i].Price);
      }
   }
   buyProduct();
  //amountProduct(itemID);
});

var buyProduct = function(){
  inquirer.prompt([{
     type: 'input',
     message: 'Which product ID do you want to buy?',
     name: 'productID'
  }]).then(function(item) {
     var post = { itemID: item.productID }
     con.query('SELECT * FROM products WHERE?', post, function(err, results) {
         if (err) throw err;
         if (results == "") {
            console.log("The product you choose doesn't exist. Please try again.");
            buyProduct();
         } 
         amountProduct(item.productID);       
     });
  })
}

var amountProduct = function(itemID){
  console.log("itemID:"+itemID);
  inquirer.prompt([{
      type: "input",
      message: "How many of the products do you wish to buy?",
      name: "amount",
   }]).then(function(item) {
     var post = { itemID: itemID }
     con.query('SELECT * FROM products WHERE?', post, function(err, results) {

         if (err) throw err;

         // If no results then there are no products with that ID. 
         if (results == "") {

            console.log("There are no products with that ID. Try again.");
            amountProduct();

         } else {

            for (var i = 0; i < results.length; i++) {

              //
              if (item.amount < results[i].stockQuantity) {
                // Set Variables
                var totalCost = results[i].price * item.amount;
                var subtract = results[i].stockQuantity - item.amount;

                // Console log the total cost
                console.log("Your order was placed. The total cost is $" + totalCost);

                // Update the products table with the new stocQuentity
                con.query('UPDATE products SET stockQuantity = ? WHERE itemID = ?', [subtract, itemID], function(err, result) {
                   if (err) throw err;
                   if (result == "") {
                      console.log("The product you choose doesn't exist. Please try again.");
                      buyProduct();
                   } 

                   return item.itemID;         
                });

              } else {
                  // There isn't enough items for the order
                  console.log("Insufficient quantity");
              } // End if statement

            } // End for loop

         } // End if statement        
     });
  })
}
