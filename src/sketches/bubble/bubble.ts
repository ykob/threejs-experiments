import {
  GLSL3,
  IcosahedronGeometry,
  Mesh,
  RawShaderMaterial,
  Texture,
} from 'three';
import { radians } from '~/utils';
import fragmentShader from './glsl/bubble.fs';
import vertexShader from './glsl/bubble.vs';

export class Bubble extends Mesh<IcosahedronGeometry, RawShaderMaterial> {
  time: number;
  diff: number;

  constructor(diff: number) {
    super(
      new IcosahedronGeometry(1, 8),
      new RawShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDiff: { value: diff },
          uNoiseTexture: { value: null },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        glslVersion: GLSL3,
      }),
    );

    this.diff = diff;
    this.time = 0;
  }
  start(texture: Texture) {
    this.material.uniforms.uNoiseTexture.value = texture;
  }
  update(time: number) {
    this.time += time;
    this.scale.setScalar(
      1 + Math.sin(radians(this.time * 90 + this.diff * 180)) * 0.1,
    );
    this.material.uniforms.uTime.value = this.time;
  }
}
