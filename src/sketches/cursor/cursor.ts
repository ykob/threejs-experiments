import {
  GLSL3,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  RawShaderMaterial,
  Texture,
  Vector2,
} from 'three';
import { getCoordAsPixel } from '~/utils';
import { SimpleAcceleratedMotion3 } from '~/utils/';
import fragmentShader from './glsl/cursor.fs';
import vertexShader from './glsl/cursor.vs';

export class Cursor extends Mesh<PlaneGeometry, RawShaderMaterial> {
  element: Element;
  positionMotion: SimpleAcceleratedMotion3 = new SimpleAcceleratedMotion3();
  scaleMotion: SimpleAcceleratedMotion3 = new SimpleAcceleratedMotion3();

  constructor(element: Element) {
    super(
      new PlaneGeometry(1, 1, 24, 24),
      new RawShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSpread: { value: 0 },
          uNoiseTexture: { value: null },
        },
        transparent: true,
        vertexShader,
        fragmentShader,
        glslVersion: GLSL3,
      }),
    );

    this.element = element;
    this.scale.set(0, 0, 1);
  }
  start(texture: Texture) {
    this.material.uniforms.uNoiseTexture.value = texture;
  }
  updatePosition() {
    this.positionMotion.update();
    this.position.copy(this.positionMotion.velocity);
  }
  updateScale(resolution: Vector2, camera: PerspectiveCamera) {
    const coordAsPixel = getCoordAsPixel(camera, this.position);
    const rect = this.element.getBoundingClientRect();
    const width = (rect.width / resolution.x) * coordAsPixel.x;
    const height = (rect.height / resolution.y) * coordAsPixel.y;

    this.scaleMotion.update();
    this.scale.set(
      width * this.scaleMotion.velocity.x,
      height * this.scaleMotion.velocity.y,
      1,
    );
  }
  update(delta: number, resolution: Vector2, camera: PerspectiveCamera) {
    this.material.uniforms.uTime.value += delta;
    this.material.uniforms.uSpread.value = Math.min(
      this.scaleMotion.velocity.x - 1,
      1,
    );
    this.updatePosition();
    this.updateScale(resolution, camera);
  }
  setTargetPosition(x: number, y: number) {
    this.positionMotion.setTarget(x, y, 0);
  }
  setTargetScale(x: number) {
    this.scaleMotion.setTarget(x, x, 0);
  }
}
