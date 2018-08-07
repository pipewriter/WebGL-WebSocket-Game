precision mediump float;

attribute vec3 vertPos; 
attribute vec3 vertColor;
attribute vec2 textureCord;

varying vec3 fragColor;
varying vec2 fragTex;

void main(void) {
    fragColor = vertColor;
    fragTex = textureCord;
    gl_Position = vec4(vertPos, 1.0);
}