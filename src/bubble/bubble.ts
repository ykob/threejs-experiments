import {
  IcosahedronGeometry,
  Mesh,
  RawShaderMaterial,
  RepeatWrapping,
  Texture,
} from 'three';
import { radians } from '../utils';
import fragmentShader from './glsl/bubble.fs?raw';
import vertexShader from './glsl/bubble.vs?raw';

export class Bubble extends Mesh<IcosahedronGeometry, RawShaderMaterial> {
  time: number;
  diff: number;

  constructor(diff: number) {
    super(
      new IcosahedronGeometry(1, 5),
      new RawShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uNoiseTexture: { value: null },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      }),
    );

    this.diff = diff;
    this.time = 0;
  }
  start(texture: Texture) {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
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
