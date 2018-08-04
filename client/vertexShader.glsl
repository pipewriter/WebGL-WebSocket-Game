precision mediump float;

uniform vec2 mousePos;
uniform float elapsed; //between 0 and 1

attribute vec3 vertexPosition; //tiny triangle around the center of the screen
attribute float triangleNumber; //used to place the triangle correctly

varying vec3 fragmentColor;
varying vec2 fragmentPosition;
varying float fragmentTime;

varying float is_white_bool;    

void main(void) {
    const float PI = 3.1415926535897932384626433832795;

    float temp = vertexPosition.x - 1.0 + 2.0 * triangleNumber / 100.0;
    float tempy = elapsed;

    fragmentTime = elapsed;

    float x = vertexPosition.x;
    float y = vertexPosition.y;
    //scale first
    fragmentColor = vec3(0.0,0.0,0.0);  
    bool isWhite = false;
    is_white_bool = 0.0;  
    if(mod(triangleNumber, 2.0) == 1.0){

        //white triangle
        isWhite = false;
        y*=1.2;
        x*=1.2;
        fragmentColor = vec3(0.0,0.25,0.25);
        is_white_bool = 1.0; //true
        //fragmentColor = vec3(1.0,0.41,0.706);
    }
    int columnCount = 50;
    int rowCount = 10;
    float yStep = 2.0/float(rowCount+1);
    int trueN = int(triangleNumber/2.0);
    int row = trueN/50;
    int column = trueN-row*50;
    float angle = 0.0;
    float magnitude = sqrt(y*y + x*x);
    if(x == 0.0){
        if(y > 0.0){
            angle = PI/2.0;
        }else{
            angle = -PI/2.0;
        }
    }else{
        angle = atan(y, x);
    }
    angle +=  (elapsed*PI*2.0*(mod(float(row*column),3.0)+1.0) + float(row) + float(column));
    float originx = magnitude * cos(angle);
    float originy = magnitude  *sin(angle);
    x = 0.0;
    y = 0.0;
    x -= 1.0;
    y -= 1.0 - yStep;
    x += float(column)/50.0*2.0 + elapsed*2.0 +float(row)/3.0;
    x = mod(x, 2.0) -1.0;
    y += 0.182*float(row) + sin(float(column) + elapsed*PI*2.0)/3.0;
    // float yDiff = (1.0-mousePos.y*2.0) - y;
    // float xDiff = (mousePos.x*2.0 - 1.0) - x;
    // float dist = sqrt(yDiff*yDiff + xDiff * xDiff);
    
    x += originx;
    y += originy;
    fragmentPosition = vec2(x, y); //used in coloration

    if(isWhite){
        gl_Position = vec4(x, y, 0, 1.0);
    }else{
        gl_Position = vec4(x, y, 0.1, 1.0);
    }
    
}