/*

*/

// socket handing variables
var socket;
var isConnected;

// window size
var winW = window.innerWidth;
var winH = window.innerHeight;

// transparency
let transparency = 1 * 255; 
let max_size = 50;

// Blob A 

let A_shape; 
let A_x = winW/2; 
let A_y = winH/2; 
let A_size = 1; 
let A_color = [0, 200, 1, transparency];
let A_sides = 3; 

// Blob B

let B_shape; 
let B_x = 100; 
let B_y = 100; 
let B_size = 1; 
let B_color = [0, 200, 1, transparency];
let B_sides = 4; 




function setup() {
	fill(0, 100);
	createCanvas(winW, winH);
	setupOsc(7002, 12000);
	frameRate(30);

	// Set Up Each Shape
	//x, y, size, color, transparency, sides

	A_shape = new Shape(A_x, A_y, A_size, A_color, A_sides);
	A_shape.setup_shape(); 

	B_shape = new Shape(B_x, B_y, B_size, B_color, B_sides);
	B_shape.setup_shape();
}

function draw() {

	//fade background
	fill(0, 100);
	rect(0, 0, width, height);

	// draw shapes

	A_shape.updateParams(A_x, A_y, A_size, A_color); 
	A_shape.display();

	B_shape.updateParams(B_x, B_y, B_size, B_color)
	B_shape.display();


}

// Function deals with recieving messages
// And updating global variables which affect the shapes

function receiveOsc(address, value) {
	// console.log("received OSC: " + address + ", " + value);

	// SHAPE A

	if (address == "AFreqResponse") { 
		A_x = calc_freq_response(value[0])
	}

	else if (address == "APitch") { 
		A_y = calc_pitch_location(value[0]); 
	}

	else if (address == "AVolume") { 
		A_size = calc_volume_size(value[0]); 
	}

}

// CONVERT ABELTON VALUES TO VISUALIZER VALUES

function calc_freq_response (value) {
	// value come in a scale between 0 and 1
	// biased bewteen 20 and 70

	
	// // remove outliers
	// if (value < 0.2 ) { 
	// 	value = 0.2; 
	// } else if (value > 0.7 ) { 
	// 	value = 0.7;
	// }

	// // horizontal shift
	// value = value - 0.2; 

	// normalize
	// value = (0.5 - value)/0.5

	result = value * winW; 

	// console.log("freq response", value, result);
	return result;
}


function calc_pitch_location (value) {
	
	// convert to frequency
	// frequency = value/(5*10e-6); 

	//normalize
	min = 0; 
	max = 0.07; 
	norm = (value - min)/(max - min); 
	
	// calc window location
	result = norm * winH; 
	
	console.log("pitch", value);
	// console.log(value/(5*10e-6)); 
	return result; 
}

function calc_volume_size (value) { 
	
	// remove outliers/cap the value
	if ( value > 2 ) {
		value = 2
	}

	// normalize value
	result = (2 - value)/value; 

	// calculate size
	result = value * 50; 

	return result; 
}


// Leave alone
function sendOsc(address, value) {
	if (isConnected) {
		socket.emit('message', [address, value]);
	}
}

// Leave alone
function setupOsc(oscPortIn, oscPortOut) {
	socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('connect', function() {
		isConnected = true;
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}
