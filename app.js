var gpio = require("gpio");
var colors = require("colors");

var gpio4 = gpio.export(7, {
   direction: "in",
   ready: function() {
   	console.log('*******************');
   	console.log('*  Ready to work  *');
   	console.log('*******************');
   	
   	gpio4.on("change", function(val){
   		console.log('BUTTON WAS PUSHED!'.green);
   	});
   }
});