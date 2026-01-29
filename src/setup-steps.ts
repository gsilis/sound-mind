import { ImageSource } from "excalibur";
import { Resources } from "./resources";

export type SetupStep = {
  id: number,
  title: string,
  images: ImageSource[],
}

export const defaultSetupStep: SetupStep = {
  id: -1,
  title: 'N/A',
  images: []
}

export const setupSteps: SetupStep[] = [
  {
    id: 1,
    title: 'Ship',
    images: [
      Resources.Plane,
      Resources.PlaneFlame,
    ],
  },
  {
    id: 2,
    title: 'Move',
    images: [
      Resources.Plane,
      Resources.PlaneFlameMove,
    ]
  },
  {
    id: 3,
    title: 'Boost',
    images: [
      Resources.Plane,
      Resources.PlaneFlameBoost,
    ]
  },
  {
    id: 4,
    title: 'Shots',
    images: [
      Resources.Shots,
    ]
  },
  {
    id: 5,
    title: 'Missile',
    images: [
      Resources.Missile,
    ]
  },
  {
    id: 6,
    title: 'Explosion',
    images: [
      Resources.Explosion,
    ]
  }
]