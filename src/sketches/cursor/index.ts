import {
  Clock,
  Raycaster,
  Scene,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three';
import { toggleSketchUI } from '~/utils/';
import { Background } from './background';
import { Camera } from './camera';
import { CollisionTarget } from './collision-target';
import { Cursor } from './cursor';

const app = document.getElementById('app');
const canvas = document.createElement('canvas');
const cursorElement = document.getElementById('cursor');
const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
const scene = new Scene();
const camera = new Camera();
const resolution = new Vector2();
const pointer = new Vector2();
const raycaster = new Raycaster();
const textureLoader = new TextureLoader();
const clock = new Clock(false);
const cursor = new Cursor(cursorElement!);
const background = new Background();
const collisionTarget = new CollisionTarget();

const resize = async () => {
  renderer.setSize(0, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  resolution.set(window.innerWidth, window.innerHeight);
  renderer.setSize(resolution.x, resolution.y);
  camera.resize(resolution);
  collisionTarget.resize(camera);
};

const mouseMove = (x: number, y: number) => {
  pointer.x = (x / resolution.x) * 2 - 1;
  pointer.y = -(y / resolution.y) * 2 + 1;
};

const mouseEnter = () => {
  cursor.setTargetScale(1);
};
const mouseOut = () => {
  cursor.setTargetScale(0);
};

const update = () => {
  const delta = clock.getDelta();

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObject(collisionTarget);

  if (intersects.length > 0) {
    const { x, y } = intersects[0].point;

    cursor.setTargetPosition(x, y);
  }
  renderer.render(scene, camera);
  cursor.update(resolution, camera);
  background.update(delta);
  requestAnimationFrame(update);
};

const start = async () => {
  if (!app || !canvas) return;

  app.appendChild(canvas);
  renderer.setClearColor(0x000000, 1.0);
  camera.lookAt(scene.position);

  const textures = await Promise.all([
    textureLoader.loadAsync('/threejs-experiments/img/noise_2x1.jpg'),
    textureLoader.loadAsync('/threejs-experiments/img/confetti.png'),
  ]);

  background.start(textures[0]);
  scene.add(cursor);
  scene.add(background);
  scene.add(collisionTarget);

  resize();
  update();
  clock.start();

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouseMove(e.clientX, e.clientY);
  });
  window.addEventListener('mouseover', mouseEnter);
  window.addEventListener('mouseout', mouseOut);
  toggleSketchUI();
};

start();
