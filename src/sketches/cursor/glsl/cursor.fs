precision highp float;

uniform float uTime;
uniform float uSpread;
uniform sampler2D uNoiseTexture;

in vec2 vUv;

out vec4 fragColor;

#include ../../../utils/glsl/convert-hsv-to-rgb;

void main() {
  float noiseR = texture(uNoiseTexture, vUv * 0.08 + uTime * vec2(0.0, -0.012)).r;
  float noiseG = texture(uNoiseTexture, vUv * 0.08 + uTime * vec2(-0.012, 0.012)).g;
  float noiseB = texture(uNoiseTexture, vUv * 0.08 + uTime * vec2(0.012, 0.012)).b;
  vec3 color = convertHsvToRgb(
    vec3((noiseR + noiseG + noiseB) * 0.42 + uTime * 0.2,
    0.62,
    0.56
  ));

  vec2 v = normalize(vUv * 2.0 - 1.0);
  float radius = 0.9 + sin(atan(v.y, v.x) * 24.0 + uTime * 10.0) * 0.05 * uSpread;
  float opacity = (1.0 - smoothstep(radius, radius + 0.02, length(vUv * 2.0 - 1.0))) * (0.2 + uSpread * 0.8);

  fragColor = vec4(color * uSpread + vec3(1.0) * (1.0 - uSpread), opacity);
}