import { ImageSource } from "excalibur";
import { Resources } from "../resources";

export type SetupStep = {
  sceneName: string,
  title: string,
  images: ImageSource[],
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
    ]
  },
  {
    sceneName: 'audioMissile',
    title: 'Missile',
    images: [
      Resources.Missile,
    ]
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
    ]
  },
  {
    sceneName: 'audioBoost',
    title: 'Boost',
    images: [
      Resources.Plane,
      Resources.PlaneFlameBoost,
    ]
  },
  {
    sceneName: 'audioExplosion',
    title: 'Explosion',
    images: [
      Resources.Explosion,
    ]
  }
]