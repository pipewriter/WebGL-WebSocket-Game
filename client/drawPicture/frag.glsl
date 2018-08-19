precision mediump float;

varying vec2 fragTex;

uniform sampler2D uSampler;

void main(void) {
    vec4 tColor = texture2D(uSampler, fragTex);
    gl_FragColor = tColor;
}