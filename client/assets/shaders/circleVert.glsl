precision mediump float;

attribute vec3 vertPos; 
attribute vec2 textureCord;

const vec2 aspect = vec2(16.0, 9.0);

void main(void) {
    gl_Position = vec4(vertPos, 1.0);
}