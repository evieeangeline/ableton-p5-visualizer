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
let max_size = 30e3;

// Blob A 

let A_shape; 
let A_x = winW/2; 
let A_y = winH/2; 
let A_size = 0; 
let A_color = [0, 200, 1, transparency];
let A_sides = 3; 

// Blob B

let B_shape; 
let B_x = 100; 
let B_y = 100; 
let B_size = 0; 
let B_color = [0, 200, 1, transparency];
let B_sides = 4; 


// Note colorus
const noteColors = {
    'C': [255, 0, 0],         // Red
    'C#': [255, 69, 0],       // Red-Orange
    'D': [255, 165, 0],       // Orange
    'D#': [255, 215, 0],      // Gold
    'E': [154, 205, 50],      // Yellow-Green
    'F': [0, 128, 0],         // Green
    'F#': [0, 191, 255],      // Deep Sky Blue
    'G': [0, 0, 255],         // Blue
    'G#': [75, 0, 130],       // Indigo
    'A': [138, 43, 226],      // Blue Violet
    'A#': [238, 130, 238],    // Violet
    'B': [255, 192, 203],     // Pink
};

function setup() {
	
	createCanvas(winW, winH);
	setupOsc(7003, 12000);
	frameRate(60);


	//make dark background
	fill(0, 255); 
	rect(0, 0, width, height);

	// Set Up Each Shape
	//x, y, size, color, transparency, sides

	A_shape = new Shape(A_x, A_y, A_size, A_color, A_sides);
	A_shape.setup_shape(); 

	B_shape = new Shape(B_x, B_y, B_size, B_color, B_sides);
	B_shape.setup_shape();
}

function draw() {

	//fade background
	fill(0, 2); ////////////////////////// FADE HERE
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
	console.log("received OSC: " + address + ", " + value);

	// check size first
	if (address == "AVolume") { 
		A_size = calc_volume_size(value[0]); 
	}

	else if (address == "BVolume") { 
		B_size = calc_volume_size(value[0]); 
	}

	// then, if volume is big enough 
	// this keeps shapes in the same place

	// SHAPE A

	if (A_size > 0.0016) {

		if (address == "AFreqResponse") { 
			A_x = calc_freq_response(value[0])
		}

		else if (address == "APitch") { 
			A_y = calc_pitch_location(value[0]); 
			A_color = calc_color(value[0]); 
		}
	}

	// SHAPE B

	if (address == "BFreqResponse") { 
		B_x = calc_freq_response(value[0])
	}

	else if (address == "BPitch") { 
		B_y = calc_pitch_location(value[0]); 
		B_color = calc_color(value[0]); 
	}

	// exit

	else if (address == "stop") {
		//make dark background
		fill(0, 255); 
		rect(0, 0, width, height);
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
	frequency = value/(5*10e-6); 

	//max and min
	min = 20; 
	max = 5000; 

	//make a cap 
	if (frequency < min) {
		frequency = min; 
	} else if (frequency > max ) { 
		frequency = max; 
	}

	// convert to midi
	midi = 69 + 12 * Math.log2(frequency / 440); 

	// get max and min of midi notes
	midi_max = 69 + 12 * Math.log2(max / 440); 
	midi_min = 69 + 12 * Math.log2(min / 440); 

	//normalize
	norm = (midi - midi_min)/(midi_max - midi_min); 
	
	// calc window location
	result = winH - (norm * winH) ; 
	
	// console.log("input", value, "freq", frequency, "norm", norm);
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
	result = value; 

	return result; 
}

function calc_color (value) {
	
	// convert into frequency 
	frequency = value/(5*10e-6); 
    
	const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octaveOffset = 4; // Starting octave, adjust as needed
    const notesInOctave = 12;

    const noteIndex = Math.round(12 * Math.log2(frequency / 440) + (notesInOctave * octaveOffset));
    const noteName = noteNames[noteIndex % notesInOctave];
    const octave = Math.floor(noteIndex / notesInOctave);

	// console.log(noteName); 
	// console.log(noteColors[noteName]); 

    return noteColors[noteName]; 
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
