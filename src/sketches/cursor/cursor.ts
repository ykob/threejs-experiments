import {
  GLSL3,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  RawShaderMaterial,
  Vector2,
} from 'three';
import { getCoordAsPixel } from '~/utils';
import { SimpleAcceleratedMotion3 } from '~/utils/';
import fragmentShader from './glsl/cursor.fs';
import vertexShader from './glsl/cursor.vs';

export class Cursor extends Mesh<PlaneGeometry, RawShaderMaterial> {
  element: Element;
  positionMotion: SimpleAcceleratedMotion3 = new SimpleAcceleratedMotion3();
  targetScale: Vector2 = new Vector2(0, 0);
  baseScale: Vector2 = new Vector2(0, 0);

  constructor(element: Element) {
    super(
      new PlaneGeometry(1, 1, 24, 24),
      new RawShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uScaleEdge: { value: 0 },
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
  updatePosition() {
    this.positionMotion.update();
    this.position.copy(this.positionMotion.velocity);
  }
  updateScale(resolution: Vector2, camera: PerspectiveCamera) {
    const coordAsPixel = getCoordAsPixel(camera, this.position);
    const rect = this.element.getBoundingClientRect();
    const width = (rect.width / resolution.x) * coordAsPixel.x;
    const height = (rect.height / resolution.y) * coordAsPixel.y;
    const direction = this.targetScale.clone().sub(this.baseScale);
    const distance = direction.length();
    const acceleration = 0.32;

    if (distance >= 0.01) {
      direction.normalize().multiplyScalar(distance * acceleration);
      this.baseScale.add(direction);
      this.scale.set(width * this.baseScale.x, height * this.baseScale.y, 1);
      return;
    }
    this.baseScale.copy(this.targetScale);
    this.scale.set(width * this.baseScale.x, height * this.baseScale.y, 1);
  }
  update(delta: number, resolution: Vector2, camera: PerspectiveCamera) {
    this.material.uniforms.uTime.value += delta;
    this.material.uniforms.uScaleEdge.value = Math.min(this.baseScale.x - 1, 1);
    this.updatePosition();
    this.updateScale(resolution, camera);
  }
  setTargetPosition(x: number, y: number) {
    this.positionMotion.setTarget(x, y, 0);
  }
  setTargetScale(x: number) {
    this.targetScale.set(x, x);
  }
}
