import {
  Clock,
  Raycaster,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three';
import { toggleSketchUI } from '~/utils/';
import { Background } from './background';
import { Camera } from './camera';
import { CollisionTarget } from './collision-target';
import { Confetti } from './confetti';

const app = document.getElementById('app');
const canvas = document.createElement('canvas');
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
const confetti = new Confetti();
const background = new Background();
const collisionTarget = new CollisionTarget();

let isDragging = false;

const resize = async () => {
  renderer.setSize(0, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  resolution.set(window.innerWidth, window.innerHeight);
  renderer.setSize(resolution.x, resolution.y);
  camera.resize(resolution);
  collisionTarget.resize(camera);
};

const startDragging = () => {
  isDragging = true;
  confetti.show();
};

const stopDragging = () => {
  isDragging = false;
  confetti.hide();
};

const drag = (x: number, y: number) => {
  if (!isDragging) return;
  pointer.x = (x / resolution.x) * 2 - 1;
  pointer.y = -(y / resolution.y) * 2 + 1;
};

const update = () => {
  const delta = clock.getDelta();

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObject(collisionTarget);

  if (intersects.length > 0) {
    const { x, y } = intersects[0].point;

    confetti.setTarget(x, y);
  }
  renderer.render(scene, camera);
  confetti.update(delta);
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

  textures[0].wrapS = RepeatWrapping;
  textures[0].wrapT = RepeatWrapping;

  background.start(textures[0]);
  confetti.start(textures[1]);
  scene.add(background);
  scene.add(confetti);
  scene.add(collisionTarget);

  resize();
  update();
  clock.start();

  window.addEventListener('resize', resize);
  window.addEventListener('mousedown', (e) => {
    startDragging();
    drag(e.clientX, e.clientY);
  });
  window.addEventListener('mousemove', (e) => {
    drag(e.clientX, e.clientY);
  });
  window.addEventListener('mouseup', stopDragging);
  window.addEventListener('touchstart', (e) => {
    startDragging();
    drag(e.touches[0].clientX, e.touches[0].clientY);
  });
  window.addEventListener('touchmove', (e) => {
    drag(e.touches[0].clientX, e.touches[0].clientY);
  });
  window.addEventListener('touchend', stopDragging);
  toggleSketchUI();
};

start();
