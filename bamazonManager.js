var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "your pass here",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Welcome to Bamazon Manager Portal!\n")
  afterConnection();
});

function afterConnection() {
    //shows a menu of actions accessible to the manager
    inquirer.prompt([{
	name: "menu",
	type: "list",
    message: "Select an option:", 
    choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
    }]).then(function(answer){
        switch(answer.menu){
            case "View Products for Sale":
                viewInventory();
                break;
            case "View Low Inventory":
                viewLow();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
        }
    })
}

//prints the current inventory to the screen using the printInv() function
function viewInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("\nItem Catalog:");
    printInv(res);
    afterConnection();
  });
}

//prints to the console catalog items with 5 or less quantity
function viewLow(){
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
    if (err) throw err;      
    console.log("\nItem Catalog (Filter: Quantity <= 5):");
    printInv(res);
    afterConnection();
    })
}

//replenishes inventory to a selected item in the catalog
function addInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("\nItem Catalog:");
    printInv(res)
    inquirer.prompt([{
	name: "id",
	type: "prompt",
    message: "\nSelect the id of the item that you with to repelenish inventory:", 
    validate: function(str){
        if (parseFloat(str) >= 1 && parseFloat(str) <= res.length){
            return true
        }
        return false
    }    
    },{
    name: "quantity",
	type: "prompt",
    message: "How much should be added?:",   
    validate: function(str){
        if (parseFloat(str) >= 1 && Number.isInteger(parseFloat(str))){
            return true;
        }
        return false;
    }
    }]).then(function(answer){

        var choice = res.find(function(res){
            return res.item_id === parseFloat(answer.id)
        });

        connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
        [choice.stock_quantity += parseFloat(answer.quantity),parseFloat(answer.id)],
        function(err, res) {
        console.log ("\nYou added (" + answer.quantity + ") units to " + choice.product_name + "!\n");

      afterConnection();
    });
  });
});
};

//adds a new product to the catalog
function addProduct(){
    inquirer.prompt([{
	name: "name",
	type: "prompt",
    message: "Name of product:"
    },{
    name: "department",
    type: "prompt",
    message: "Department name:"
    },{
    name: "price",
    type: "prompt",
    message: "Price:",
    validate: function(str){
        if (Number.isNaN(parseFloat(str)) === false && str.split(".").length <= 2){
            return true;
        };
        return false;
    }
    },{
    name: "quantity",
    type: "prompt",
    message: "Quantity:",
    validate: function(str){
        if (Number.isInteger(parseFloat(str)) && parseFloat(str) > -1){
            return true;
        };
        return false;
    }
    }]).then(function(answer){
        connection.query(
         "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)",
        [answer.name,answer.department,parseFloat(answer.price).toFixed(2),parseFloat(answer.quantity)],
         function(err, res) {
        console.log("\nAdded new item --> Product: " + answer.name + ", Department: " + answer.department + ", Price: $" + answer.price + ", Quantity: " + answer.quantity + "\n");
      afterConnection();
    });
  });
};

//prints the current inventory to the console
function printInv(res){
    for (var i = 0; i < res.length;i++){
        console.log("Id: " + res[i].item_id + ", Product: " + res[i].product_name + ", Department: " + res[i].department_name + ", Price: $" + res[i].price+ ", Quantity: " + res[i].stock_quantity);
    }
    console.log("\n");
}