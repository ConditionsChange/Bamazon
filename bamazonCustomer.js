var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Your pass goes here",
  database: "bamazon"
});

//connect to MySQL satabase
connection.connect(function(err) {
  if (err) throw err;
  afterConnection();
  console.log("Welcome to Bamazon!\n");
});

//after connection print the item catalog to the console and go through the mainloop inquirer prompt
function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    printInv(res); //prints the current catalog to the console
    mainLoop(res); //goes through the inquirer prompt
  });
}

function printInv(res){
    console.log("See our item selection below:");
    for (var i = 0; i < res.length;i++){
        console.log("Id: " + res[i].item_id + ", Product: " + res[i].product_name + ", Department: " + res[i].department_name + ", Price: $" + res[i].price+ ", Quantity: " + res[i].stock_quantity);
    };
    console.log("\n");
}


function mainLoop(res){
    //user inputs the id of the item they want to purchase and the quantity they want to purchase
    inquirer.prompt([{
	name: "id",
	type: "input",
    message: "Type the id of the product you wish to purchase:", 
    validate: function(str){
        if (parseFloat(str) >= 1 && parseFloat(str) <= res.length){
            return true;
        };
        return false;
    }
    },{
	name: "quantity",
	type: "input",
    message: "How many units would you like to purchase?", 
    validate: function(str){
        if (Number.isInteger(parseFloat(str)) && parseFloat(str) >= 1 ){
            return true;
        };
        return false;
    }
    }]).then(function(answer){

        var choice = res.find(function(res){
            return res.item_id === parseFloat(answer.id);
        });

        if (parseFloat(answer.quantity) <= choice.stock_quantity){
            updateSQL(choice, answer);
        }
        else{
            console.log("Insufficient quantity!\n")
            mainLoop(res);
        };

        })
};

//after a valid purchase update the MySql database to reflect the purchased quantity
function updateSQL(choice, answer){
    connection.query(
    "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
    [choice.stock_quantity -= parseFloat(answer.quantity),parseFloat(answer.id)],
    function(err, res) {
        console.log ("\nYou purchased (" + answer.quantity + ") " + choice.product_name.toString() + "(s) for $" + (parseFloat(answer.quantity)*choice.price).toFixed(2).toString() + "!\n");

      afterConnection();
    }
  );
}