import * as THREE from 'three'
import { easing } from 'ts-easing'
import { MathEx } from '@/assets/js/utils'

const DURATION = 1
const DELAY = 0.5

export default class LoadingCore extends THREE.Mesh {
  time: number

  constructor() {
    const geometry = new THREE.OctahedronGeometry(20, 0)
    const material = new THREE.MeshPhongMaterial({
      flatShading: true,
      color: 0xffffff,
    })

    super(geometry, material)

    this.position.z = -25
    this.time = 0
  }

  start(map: THREE.Texture) {
    if (!(this.material instanceof THREE.MeshPhongMaterial)) return
    this.material.envMap = map
  }

  update(time: number) {
    if (!(this.material instanceof THREE.MeshPhongMaterial)) return
    this.time += time
    this.rotation.x = this.time
    this.rotation.y = this.time

    const scale =
      easing.elastic(MathEx.clamp((this.time - DELAY) / DURATION, 0, 1))
      + Math.pow(Math.sin(this.time * 4), 3) * Math.sin(this.time * 24) * 0.15

    this.scale.set(scale, scale, scale)
  }
}
