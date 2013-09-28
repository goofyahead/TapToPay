var gpio = require("gpio");
var colors = require("colors");

var gpio4 = gpio.export(4, {
   direction: "in",
   ready: function() {
   	console.log('BUTTON WAS PUSHED!'.green);
   }
});