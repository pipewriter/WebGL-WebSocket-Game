precision mediump float;

attribute vec3 vertPos; 
attribute vec3 color;

varying vec3 fragColor;

void main(void) {
    fragColor = color;
    gl_Position = vec4(vertPos, 1.0);
}