precision mediump float;

uniform vec2 mousePos;    

varying vec3 fragmentColor;
varying vec2 fragmentPosition;
varying float is_white_bool;

varying float fragmentTime;

void main(void) {
    if(is_white_bool > 0.5){
        //is white true
        vec3 newColor = vec3(0.0, 0.0, 0.0);
        //distance is between 0 and sqrt(2)
        float d1 = fragmentPosition.x - mousePos.x*2.0+1.0;
        float d2 = fragmentPosition.y - (-mousePos.y*2.0)-1.0;
        float angle = atan(d2, d1);
        float distance = sqrt(d1*d1 + d2*d2) + angle*2.0;
        float col = mod(distance*10.0-fragmentTime*150.0, 10.0);

        gl_FragColor = vec4(col/5.0, col/10.0, col/20.0, 1.0);
    }else{
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}