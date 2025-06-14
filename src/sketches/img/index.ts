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
import { Image } from './image';
import { Particles } from './particles';

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
const imageElements = document.querySelectorAll('.image');
const images: Image[] = [];
const particles = new Particles(resolution);
const background = new Background();

const resize = async () => {
  renderer.setSize(0, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  resolution.set(window.innerWidth, window.innerHeight);
  renderer.setSize(resolution.x, resolution.y);
  camera.resize(resolution);
};

const update = () => {
  const delta = clock.getDelta();

  for (let i = 0; i < images.length; i++) {
    images[i].update(resolution, camera, delta);
  }
  particles.update(delta);
  background.update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(update);
};

const start = async () => {
  if (!app || !canvas) return;

  app.appendChild(canvas);
  renderer.setClearColor(0x000000, 1.0);
  camera.lookAt(scene.position);
  scene.add(particles);
  scene.add(background);

  const textures = await Promise.all([
    textureLoader.loadAsync('/threejs-experiments/img/noise.jpg'),
    textureLoader.loadAsync('/threejs-experiments/img/noise_2x1.jpg'),
  ]);

  particles.start(textures[1]);
  background.start(textures[1]);
  textures[0].wrapS = RepeatWrapping;
  textures[0].wrapT = RepeatWrapping;
  textures[1].wrapS = RepeatWrapping;
  textures[1].wrapT = RepeatWrapping;

  imageElements.forEach(async (element) => {
    const image = new Image(element);

    images.push(image);
    scene.add(image);
    image.start(textures[0]);
  });

  resize();
  update();
  clock.start();

  window.addEventListener('resize', resize);
  toggleSketchUI();

  // HACK: Avoid lag the first time an image Plane object becomes visible in the viewport.
  for (let i = 0; i < images.length; i++) {
    images[i].activate();
  }
};

start();
