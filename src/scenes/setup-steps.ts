import { Actor, ImageSource, Resource, Sound } from "excalibur";
import { Resources } from "../resources";
import { Explosion } from "../components/explosion";

export type SetupStep = {
  sceneName: string,
  title: string,
  images: (ImageSource | Actor)[],
  sound?: Sound,
}

export const defaultSetupStep: SetupStep = {
  sceneName: 'start',
  title: 'N/A',
  images: []
}

export const setupSteps: SetupStep[] = [
  {
    sceneName: 'audioShoot',
    title: 'Shots',
    images: [
      Resources.Shots,
    ],
    sound: Resources.SoundShoot,
  },
  {
    sceneName: 'audioMissile',
    title: 'Missile',
    images: [
      Resources.Missile,
    ],
  },
  {
    sceneName: 'audioShip',
    title: 'Ship',
    images: [
      Resources.Plane,
      Resources.PlaneFlame,
    ],
  },
  {
    sceneName: 'audioMove',
    title: 'Move',
    images: [
      Resources.Plane,
      Resources.PlaneFlameMove,
    ],
    sound: Resources.SoundFly,
  },
  {
    sceneName: 'audioBoost',
    title: 'Boost',
    images: [
      Resources.Plane,
      Resources.PlaneFlameBoost,
    ],
    sound: Resources.SoundBoost,
  },
  {
    sceneName: 'audioExplosion',
    title: 'Explosion',
    images: [
      new Explosion({ loop: true }),
    ],
    sound: Resources.SoundExplode,
  }
]