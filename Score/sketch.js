/*

*/

// socket handing variables
var socket;
var isConnected;

// window size
var w = window.innerWidth;
var h = window.innerHeight;

// play
let play = 1; 
let track_loc=0; 

// speed
let total_time = 5 * 60; // seconds
let framerate = 60; 
let total_frames = total_time * framerate; 
let speed = w/total_frames; 

function setup() {
	fill(0, 1);
	createCanvas(w, h);
	setupOsc(3813, 12001);
	frameRate(framerate);

}

let offset = 0.05; 

let e = 0.45; 
let x0 = 0; 

let a = 0.4; 
let x1 = 0.2; 

let b = 0.48; 
let x2 = 0.5;

let c = 0.1; 
let x3 = 0.6; 

let d = 0.4; 
let x4 = 0.8; 



function draw() {

	// fade background
	fill(0,200); 
	rect(0,0,width,height); 

	fill("black"); 
	stroke('white'); 

	// top line
	
	line(0, h/2, w*x0, h/2); 

	beginShape();
        curveVertex(w*x0, h * e); //extra start
		curveVertex(w*x0, h * e); 
		curveVertex(w * x1, h * a); 
        curveVertex(w * x2, h * b);
        curveVertex(w * x3, h * c);
        curveVertex(w * x4, h * d);
        curveVertex(w-w*offset,h/2);
		curveVertex(w-w*offset,h/2); //extra end
	endShape();

	line(w-w*offset, h/2, w, h/2); 

	// bottom line
	
	line(0, h/2, w*x0, h/2); 

	beginShape();
        curveVertex(w*x0, h * (1-e)); //extra start
		curveVertex(w*x0, h * (1-e)); 
		curveVertex(w * x1, h * (1-a)); 
        curveVertex(w * x2, h * (1-b));
        curveVertex(w * x3, h * (1-c));
        curveVertex(w * x4, h * (1-d));
        curveVertex(w-w*offset,h/2);
		curveVertex(w-w*offset,h/2); //extra end
	endShape();

	line(w-w*offset, h/2, w, h/2); 

	// track bar


	if (play == 1) {	
		stroke("black");
		fill(200, 0, 0);
		track_loc += speed; 
		rect(track_loc, 0, 5, height);
	}
	else {
		stroke("black");
		fill(200, 0, 0);
		rect(track_loc, 0, 5, height);
	}
	
}


// Function deals with recieving messages
// And updating global variables which affect the shapes

function receiveOsc(address, value) {

	console.log(address, value); 

	// check size first
	if (address == "start") { 
		console.log("received OSC: " + address + ", " + value);
		play = 1; 
	}

	if (address == "stop") {
		console.log("received OSC: " + address + ", " + value);
		play = 0;  
		track_loc = value * w; 
	}

}



// Leave alone
function sendOsc(address, value) {
	if (isConnected) {
		socket.emit('message', [address, value]);
	}
}

// Leave alone
function setupOsc(oscPortIn, oscPortOut) {
	
	// socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	// socket.on('connect', function() {
	// 	socket.emit('config', {
	// 		server: { port: oscPortIn,  host: '127.0.0.1'},
	// 		client: { port: oscPortOut, host: '127.0.0.1'}
	// 	});
	// });

	socket = io.connect('http://0.0.0.0:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {
			server: { port: oscPortIn,  host: '0.0.0.0'},
			client: { port: oscPortOut, host: '0.0.0.0'}
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
