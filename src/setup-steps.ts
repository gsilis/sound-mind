import { Resources } from "./resources";

export const setupSteps = [
  {
    id: 1,
    title: 'Ship',
    image: [
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