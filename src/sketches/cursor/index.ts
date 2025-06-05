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
import { Cursor } from './cursor';

const app = document.getElementById('app');
const canvas = document.createElement('canvas');
const content = document.getElementById('content');
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

const mouseMove = (e: MouseEvent) => {
  const { target, clientX, clientY } = e;

  if (!target || !(target instanceof HTMLElement)) return;

  const isHoverTrigger = target.classList.contains('hover-trigger');

  cursor.setTargetScale(isHoverTrigger ? 3 : 1);
  pointer.x = (clientX / resolution.x) * 2 - 1;
  pointer.y = -(clientY / resolution.y) * 2 + 1;
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
  cursor.update(delta, resolution, camera);
  background.update(delta);
  requestAnimationFrame(update);
};

const start = async () => {
  if (!app || !canvas || !content) return;

  app.appendChild(canvas);
  renderer.setClearColor(0x000000, 1.0);
  camera.lookAt(scene.position);

  const textures = await Promise.all([
    textureLoader.loadAsync('/threejs-experiments/img/noise.jpg'),
    textureLoader.loadAsync('/threejs-experiments/img/noise_2x1.jpg'),
  ]);

  textures[0].wrapS = RepeatWrapping;
  textures[0].wrapT = RepeatWrapping;

  background.start(textures[1]);
  cursor.start(textures[0]);
  scene.add(cursor);
  scene.add(background);
  scene.add(collisionTarget);

  resize();
  update();
  clock.start();

  window.addEventListener('resize', resize);
  toggleSketchUI();

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    content.style.display = 'none';
    return;
  }

  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('mouseout', mouseOut);
};

start();
