precision mediump float;

varying vec2 fragPos;

uniform vec2 dist;
uniform float radius;

void main(void) {
    float dx = dist.x - 80.0 * fragPos.x;
    float dy = dist.y + 45.0 * fragPos.y;
    float mag = sqrt(dx * dx + dy * dy);

    if(mag < radius || mag > radius + 10.0){
        discard;
    }
    gl_FragColor = vec4(0.0, 1.0, 1.0, 0.8);
}
