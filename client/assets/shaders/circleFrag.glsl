precision mediump float;

varying vec2 fragPos;

uniform vec2 dist;
uniform float radius;

void main(void) {
    float dx = dist.x - 88.88 * fragPos.x;
    float dy = dist.y + 50.0 * fragPos.y;
    float mag = sqrt(dx * dx + dy * dy);

    if(mag < radius || mag > radius + 1.5){
        discard;
    }
    gl_FragColor = vec4(0.0, 1.0, 1.0, 0.8);
}
