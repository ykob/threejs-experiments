import { Vector3 } from 'three';

export class SimpleAcceleratedMotion3 {
  private accelerationScalar: number = 0.14;
  private target: Vector3 = new Vector3();
  public velocity: Vector3 = new Vector3();

  constructor(accelerationScalar: number = 0.14) {
    this.accelerationScalar = accelerationScalar;
  }

  setTarget(x: number, y: number, z: number): void {
    this.target.set(x, y, z);
  }
  update(): void {
    const direction = this.target.clone().sub(this.velocity);
    const distance = direction.length();

    if (distance < 0.01) {
      this.velocity.copy(this.target);
      return;
    }

    direction.normalize().multiplyScalar(distance * this.accelerationScalar);
    this.velocity.add(direction);
  }
}
