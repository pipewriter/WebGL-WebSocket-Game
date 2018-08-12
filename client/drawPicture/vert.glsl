precision mediump float;

attribute vec3 vertPos; 
attribute vec2 textureCord;

const vec2 aspect = vec2(16.0, 9.0);

varying vec2 fragTex;

void main(void) {
    fragTex = textureCord;
    vec3 adjPos = vec3(vertPos.x*aspect.y/aspect.x, vertPos.y, vertPos.z);
    gl_Position = vec4(adjPos, 1.0);
}