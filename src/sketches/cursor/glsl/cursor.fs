precision highp float;

uniform float uTime;
uniform float uScaleEdge;

in vec2 vUv;

out vec4 fragColor;

void main() {
  vec2 v = normalize(vUv * 2.0 - 1.0);
  float radius = 0.9 + sin(atan(v.y, v.x) * 24.0 + uTime * 10.0) * 0.05 * uScaleEdge;
  float opacity = (1.0 - smoothstep(radius, radius + 0.02, length(vUv * 2.0 - 1.0))) * 0.2;

  fragColor = vec4(vec3(1.0), opacity);
}