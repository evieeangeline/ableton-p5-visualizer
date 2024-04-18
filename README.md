# ableton-p5-visualizer


## Description



## Setup

1) install [node](https://nodejs.org/)

2) 

	$ npm install

3) 
    $ node bridge.js

This runs the file called bridge.js, it runs on a server. 
It's a javascript file that creates a connection using <a href="http://socket.io">socket.io</a>. 

In simple terms, it creates a connection that I can send and recieve information between different applications, through an address running on your computer. 

4) 

In VSCODE click go live


## Evie socket notes

BRIDGE SOCKET = 8081
SEND TO = 7000

## Naming Conventions

In the connection kit - for each instrument there is a column called OSC address. 

For each instrument, the names should follow this convention: 

X_pitch
X_amplitude
X_depth

where X is the name of the instrument. 

Stephen will take instrument names starting at A (A, B, C, etc) and Evangeline will take insturment names starting at Z (Z, Y, Z, etc)

Note that you can't just "create instruments" by giving it a different name. I have to program in each blob that forms on the screen. 




