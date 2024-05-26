



class Shape {

    constructor(x, y, size, color, sides) {

        // my parameters
        this.x = x; 
        this.y = y; 
        this.size = size; 
        this.color = color; 
        this.sides = sides; //done


        // their parameters
        this.centerX = 0.0; 
        this.centerY = 0.0; 
        this.rotAngle = -90; 
        this.accelX = 0.0; 
        this.accelY = 0.0; 
        this.deltaX = 0.0; 
        this.deltaY = 0.0; 
        this.nodeStartX = []; 
        this.nodeStartY = []; 
        this.nodeX = []; 
        this.nodeY = []; 
        this.angle = []; 
        this.frequency = []; 
        this.organicConstant = 1.0; 
        this.springing = 0.01; 
        this.damping = 0.9; 


    }

    setup_shape() { 

        for (let i = 0; i < this.sides; i++){
            this.nodeStartX[i] = 0;
            this.nodeStartY[i] = 0;
            this.nodeY[i] = 0;
            this.nodeY[i] = 0;
            this.angle[i] = 0;
          }
        // iniitalize frequencies for corner nodes
        for (let i = 0; i < this.sides; i++){
            this.frequency[i] = random(5, 12);
        }
        noStroke();
    }

    // draw the shape
    display() {
        
        this.drawShape();
        this.moveShape();  

    }

    // manually update parameters from abelton
    updateParams(x, y, size, color) {
        this.x = x; 
        this.y = y; 
        this.size = size; 
        this.color = color; 
    }

    // draw the shape
    drawShape() { 
        
        // calculate size of shape
        this.poly_size = int(max_size * this.size); 

        //  calculate node  starting locations
        for (let i = 0; i < this.sides; i++){
            this.nodeStartX[i] = this.centerX + cos(radians(this.rotAngle)) * this.poly_size;
            this.nodeStartY[i] = this.centerY + sin(radians(this.rotAngle)) * this.poly_size;
            this.rotAngle += 360.0 / this.sides;
        }

        // draw polygon
        curveTightness(this.organicConstant);
        
        // this.color = (200,200,200); 
        try {
            fill(this.color);
        } 
        catch(err) {}
        
        beginShape();
        for (let i = 0; i < this.sides; i++){
            curveVertex(this.nodeX[i], this.nodeY[i]);
        }
        for (let i = 0; i < this.sides-1; i++){
            curveVertex(this.nodeX[i], this.nodeY[i]);
        }
        endShape(CLOSE);
    }

    moveShape() { 

        //move center point
        this.deltaX = this.x - this.centerX;
        this.deltaY = this.y - this.centerY;

        // create springing effect
        this.deltaX *= this.springing;
        this.deltaY *= this.springing;
        this.accelX += this.deltaX;
        this.accelY += this.deltaY;

        // move predator's center
        this.centerX += this.accelX;
        this.centerY += this.accelY;

        // slow down springing
        this.accelX *= this.damping;
        this.accelY *= this.damping;

        // change curve tightness
        this.organicConstant = 1 - ((abs(this.accelX) + abs(this.accelY)) * 0.1);

        //move nodes
        for (let i = 0; i < this.sides; i++){
            this.nodeX[i] = this.nodeStartX[i] + sin(radians(this.angle[i])) * (this.accelX * 2);
            this.nodeY[i] = this.nodeStartY[i] + sin(radians(this.angle[i])) * (this.accelY * 2);
            this.angle[i] += this.frequency[i];
        }    
        }

}