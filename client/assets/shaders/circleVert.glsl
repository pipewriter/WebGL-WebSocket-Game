precision mediump float;

attribute vec3 vertPos; 
attribute vec2 textureCord;

const vec2 aspect = vec2(16.0, 9.0);

varying vec2 fragPos;

void main(void) {
    fragPos = vec2(vertPos.x, vertPos.y);
    gl_Position = vec4(vertPos, 1.0);
}