precision mediump float;

attribute vec3 vertPos; 
attribute vec2 textureCord;

varying vec2 fragTex;

void main(void) {
    fragTex = textureCord;
    gl_Position = vec4(vertPos, 1.0);
}