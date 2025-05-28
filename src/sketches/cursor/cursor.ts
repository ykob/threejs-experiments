import {
  GLSL3,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  RawShaderMaterial,
  Vector2,
  Vector3,
} from 'three';
import { getCoordAsPixel } from '~/utils';
import fragmentShader from './glsl/cursor.fs';
import vertexShader from './glsl/cursor.vs';

export class Cursor extends Mesh<PlaneGeometry, RawShaderMaterial> {
  element: Element;
  targetPosition: Vector3 = new Vector3();
  targetScale: Vector2 = new Vector2(0, 0);
  baseScale: Vector2 = new Vector2(0, 0);

  constructor(element: Element) {
    super(
      new PlaneGeometry(1, 1, 24, 24),
      new RawShaderMaterial({
        transparent: true,
        vertexShader,
        fragmentShader,
        glslVersion: GLSL3,
      }),
    );

    this.element = element;
    this.scale.set(0, 0, 1);
  }
  update(resolution: Vector2, camera: PerspectiveCamera) {
    const coordAsPixel = getCoordAsPixel(camera, this.position);
    const rect = this.element.getBoundingClientRect();
    const width = (rect.width / resolution.x) * coordAsPixel.x;
    const height = (rect.height / resolution.y) * coordAsPixel.y;

    const direction = this.targetPosition.clone().sub(this.position);
    const distance = direction.length();
    const acceleration = 0.14;

    if (distance >= 0.01) {
      direction.normalize().multiplyScalar(distance * acceleration);
      this.position.add(direction);
    } else {
      this.position.copy(this.targetPosition);
    }

    const directionScale = this.targetScale.clone().sub(this.baseScale);
    const distanceScale = directionScale.length();

    if (distanceScale >= 0.01) {
      directionScale.normalize().multiplyScalar(distanceScale * acceleration);
      this.baseScale.add(directionScale);
    } else {
      this.baseScale.copy(this.targetScale);
    }

    this.scale.set(width * this.baseScale.x, height * this.baseScale.y, 1);
  }
  setTargetPosition(x: number, y: number) {
    this.targetPosition.set(x, y, 0);
  }
  setTargetScale(x: number) {
    this.targetScale.set(x, x);
  }
}
