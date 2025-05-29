precision highp float;

in vec2 vUv;

out vec4 fragColor;

void main() {
  float opacity = (1.0 - smoothstep(0.97, 1.0, length(vUv * 2.0 - 1.0))) * 0.2;

  fragColor = vec4(vec3(1.0), opacity);
}