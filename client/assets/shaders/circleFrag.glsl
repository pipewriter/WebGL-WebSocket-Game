precision mediump float;

varying vec2 fragPos;

const float radius1 = 0.9;
const float radius2 = 0.95;

void main(void) {
    float dist = sqrt(fragPos.x * fragPos.x + fragPos.y * fragPos.y);
    if(dist < radius1 || dist > radius2){
        discard;
    }
    gl_FragColor = vec4(0.2, 0.8, 0.5, 1.0);
}
