var gpio = require("gpio");
var colors = require("colors");
var express = require('express');
var app = express();
var exec = require('child_process').exec,
child;
var port = process.env.PORT || 5000;
var gpio22;

player = exec('gpio mode 0 out',
		function(error,stdout,stderr){
			if (error) {
				console.log(error.stack);
				console.log('player: Error code: '+error.code);
			}
			console.log('player Child Process STDOUT: '+stdout);
			console.log('player Child Process STDERR: '+stderr);
		});
player = exec('gpio mode 2 out',
		function(error,stdout,stderr){
			if (error) {
				console.log(error.stack);
				console.log('player: Error code: '+error.code);
			}
			console.log('player Child Process STDOUT: '+stdout);
			console.log('player Child Process STDERR: '+stderr);
		});
player = exec('gpio mode 3 out',
		function(error,stdout,stderr){
			if (error) {
				console.log(error.stack);
				console.log('player: Error code: '+error.code);
			}
			console.log('player Child Process STDOUT: '+stdout);
			console.log('player Child Process STDERR: '+stderr);
		});


function blueOn(){
	player = exec('gpio write 0 0',
		function(error,stdout,stderr){
			if (error) {
				console.log(error.stack);
				console.log('player: Error code: '+error.code);
			}
			console.log('player Child Process STDOUT: '+stdout);
			console.log('player Child Process STDERR: '+stderr);
		});
}

function blueOff(){
	player = exec('gpio write 0 1',
		function(error,stdout,stderr){
			if (error) {
				console.log(error.stack);
				console.log('player: Error code: '+error.code);
			}
			console.log('player Child Process STDOUT: '+stdout);
			console.log('player Child Process STDERR: '+stderr);
		});
}

function greenBlink() {
	player = exec('gpio write 3 0',
		function(error,stdout,stderr){
			if (error) {
				console.log(error.stack);
				console.log('player: Error code: '+error.code);
			}
			console.log('player Child Process STDOUT: '+stdout);
			console.log('player Child Process STDERR: '+stderr);
		});

	setTimeout(function () {
		player = exec('gpio write 3 1',
			function(error,stdout,stderr){
				if (error) {
					console.log(error.stack);
					console.log('player: Error code: '+error.code);
				}
				console.log('player Child Process STDOUT: '+stdout);
				console.log('player Child Process STDERR: '+stderr);
			});
	}, 1500);
}

function redBlink() {
	player = exec('gpio write 2 0',
		function(error,stdout,stderr){
			if (error) {
				console.log(error.stack);
				console.log('player: Error code: '+error.code);
			}
			console.log('player Child Process STDOUT: '+stdout);
			console.log('player Child Process STDERR: '+stderr);
		});

	setTimeout(function () {
		player = exec('gpio write 2 1',
			function(error,stdout,stderr){
				if (error) {
					console.log(error.stack);
					console.log('player: Error code: '+error.code);
				}
				console.log('player Child Process STDOUT: '+stdout);
				console.log('player Child Process STDERR: '+stderr);
			});
	}, 1500);
}

function setOff() {
	player = exec('gpio write 0 1', function(error,stdout,stderr){});
	player = exec('gpio write 2 1', function(error,stdout,stderr){});
	player = exec('gpio write 3 1', function(error,stdout,stderr){});
}

function blinkBlue() {
	player = exec('gpio write 0 0',
		function(error,stdout,stderr){
			if (error) {
				console.log(error.stack);
				console.log('player: Error code: '+error.code);
			}
			console.log('player Child Process STDOUT: '+stdout);
			console.log('player Child Process STDERR: '+stderr);
		});

	setTimeout(function () {
		player = exec('gpio write 0 1',
			function(error,stdout,stderr){
				if (error) {
					console.log(error.stack);
					console.log('player: Error code: '+error.code);
				}
				console.log('player Child Process STDOUT: '+stdout);
				console.log('player Child Process STDERR: '+stderr);
			});
	}, 1500);
}

var gpio4 = gpio.export(4, {
	direction: "in",
	ready: function() {
		console.log('*******************');
		console.log('*  Ready to work  *');
		console.log('*******************');

		setOff();

		blinkBlue();

		gpio4.on("change", function(val){
			if (val == 1){
				console.log('BUTTON WAS PUSHED!'.green);
				var myts = new Date().getTime();
				var currentId = 'taptopaymerchant@gmail.com';
				var currentElement = { timeStamp : myts, id : currentId, amount: 2.00 };
				var currentKey = myts + currentId;
				fumpers[currentKey] = currentElement;

				var response = [];
				check(myts, currentId, response);
				console.log('respones was ' + response);
			}
		});
	}
});

app.configure(function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
});

var fumpers = new Object();

function check(currentTimeStamp, currentId, response) {
	console.log('number of fumps in comparison ' + Object.keys(fumpers).length);
	for (var key in fumpers) {
		console.log("compairing: " + Math.abs(currentTimeStamp - fumpers[key].timeStamp));
		if (Math.abs(currentTimeStamp - fumpers[key].timeStamp) < 800 && currentId != fumpers[key].id) {
			var elementResponse = {timeStamp : fumpers[key].timeStamp, id : fumpers[key].id, amount : fumpers[key].amount };
			response.push(elementResponse);
			console.log("added to reponse one match " + JSON.stringify(fumpers[key]));
		}
	}
}

app.post('/api/result', function (req, res){
	var result = req.body.result;
	blueOff();
	if (result == 'OK') {
		// gpio22.set();
		greenBlink();
		res.send(200);
	} else {
		redBlink();
		res.send(200);
	}
});

app.post('/api/fump', function (req, res){
	// gpio22.set(0);
	

	var response = [];
	var currentTimeStamp = req.body.timestamp;
	var currentId = req.body.id;

	var currentElement = { timeStamp : currentTimeStamp, id : currentId };

	var currentKey = currentTimeStamp + currentId;
	fumpers[currentKey] = currentElement;

	check(currentTimeStamp, currentId, response);

	console.log('looking for matches:');
	console.log(req.body.timestamp);

	if (response.length == 0) {
		setTimeout(function(){ 
			check(currentTimeStamp, currentId, response);
			console.log('delay check');
			console.log('number of fumps ' + fumpers.length);
			res.send({'response_delayed': response});
			setTimeout(function(){ 
				delete fumpers[currentKey];
			},2000);
		}, 1000);
	} else {
		blueOn();
		res.send({'response_ok': response});
		setTimeout(function(){
			delete fumpers[currentKey];
		},2000);
	}
});

app.listen(port);
console.log('listening on ' + port);