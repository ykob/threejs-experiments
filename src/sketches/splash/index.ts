import {
  Clock,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three';
import { toggleSketchUI } from '~/utils/';
import { Background } from './background';
import { Camera } from './camera';
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
const textureLoader = new TextureLoader();
const clock = new Clock(false);
const confetties = Array.from({ length: 20 }, () => new Confetti());
const background = new Background();

let index = 0;

const resize = async () => {
  renderer.setSize(0, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  resolution.set(window.innerWidth, window.innerHeight);
  renderer.setSize(resolution.x, resolution.y);
  camera.resize(resolution);
};

const update = () => {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  background.update(delta);
  for (let i = 0; i < confetties.length; i++) {
    confetties[i].update(delta);
  }
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
  scene.add(background);
  for (let i = 0; i < confetties.length; i++) {
    confetties[i].start(textures[1]);
    scene.add(confetties[i]);
  }

  resize();
  update();
  clock.start();

  window.addEventListener('resize', resize);
  window.addEventListener('click', () => {
    index = (index + 1) % confetties.length;
    confetties[index].splash();
  });
  toggleSketchUI();
};

start();
