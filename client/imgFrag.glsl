precision mediump float;

varying vec3 fragColor;
varying vec2 fragTex;

uniform sampler2D uSampler;

void main(void) {
    vec4 tColor = texture2D(uSampler, fragTex);
    gl_FragColor = vec4(
        (fragColor.r + tColor.r)/2.0,
        (fragColor.g + tColor.g)/2.0,
        (fragColor.b + tColor.b)/2.0,
        0.1
    );
}