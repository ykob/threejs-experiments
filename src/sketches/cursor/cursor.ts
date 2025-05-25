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

    this.scale.set(width, height, 1);

    const direction = this.targetPosition.clone().sub(this.position);
    const distance = direction.length();
    const acceleration = 0.14;

    if (distance >= 0.01) {
      direction.normalize().multiplyScalar(distance * acceleration);
      this.position.add(direction);
      return;
    }
    this.position.copy(this.targetPosition);
  }
  setTarget(x: number, y: number) {
    this.targetPosition.set(x, y, 0);
  }
}
