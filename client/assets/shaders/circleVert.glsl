precision mediump float;


const vec2 aspect = vec2(16.0, 9.0);

varying vec2 fragTex;

void main(void) {
    fragTex = textureCord;
    vec3 adjPos = vec3(((vertPos.x*aspect.y/aspect.x)*2.0-1.0), (-vertPos.y*2.0+1.0), vertPos.z);
    gl_Position = vec4(adjPos, 1.0);
}