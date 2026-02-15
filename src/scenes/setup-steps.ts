import { Actor, ImageSource, Sound } from "excalibur";
import { Resources } from "../resources";
import { Explosion } from "../components/explosion";
import { GameData } from "../game-data";

const gameData = GameData.getInstance()

export type SetupStep = {
  sceneName: string,
  title: string,
  images: (ImageSource | Actor)[],
  sound?: Sound,
  onSelectAudio: (sound: Sound) => void,
}

export const defaultSetupStep: SetupStep = {
  sceneName: 'start',
  title: 'N/A',
  images: [],
  onSelectAudio(_sound) {},
}

export const setupSteps: SetupStep[] = [
  {
    sceneName: 'audioShoot',
    title: 'Shots',
    images: [
      Resources.Shots,
    ],
    sound: Resources.SoundShoot,
    onSelectAudio(sound) {
      gameData.sounds.shoot = sound
    },
  },
  {
    sceneName: 'audioIdle',
    title: 'Ship Idle',
    images: [
      Resources.Plane,
      Resources.PlaneFlame,
    ],
    sound: Resources.SoundIdle,
    onSelectAudio(sound) {
      gameData.sounds.idle = sound
    },
  },
  {
    sceneName: 'audioFly',
    title: 'Fly',
    images: [
      Resources.Plane,
      Resources.PlaneFlameMove,
    ],
    sound: Resources.SoundFly,
    onSelectAudio(sound) {
      gameData.sounds.fly = sound
    },
  },
  {
    sceneName: 'audioBoost',
    title: 'Boost',
    images: [
      Resources.Plane,
      Resources.PlaneFlameBoost,
    ],
    sound: Resources.SoundBoost,
    onSelectAudio(sound) {
      gameData.sounds.boost = sound
    },
  },
  {
    sceneName: 'audioExplosion',
    title: 'Explosion',
    images: [
      new Explosion({ loop: true }),
    ],
    sound: Resources.SoundExplode,
    onSelectAudio(sound) {
      gameData.sounds.explode = sound
    },
  },
  {
    sceneName: 'audioDamage',
    title: 'Damage Received',
    images: [],
    sound: Resources.SoundDamage,
    onSelectAudio(sound) {
      gameData.sounds.damage = sound
    },
  },
  {
    sceneName: 'audioGameOver',
    title: 'Game Over',
    images: [],
    sound: Resources.SoundGameOver,
    onSelectAudio(sound) {
      gameData.sounds.gameOver = sound
    },
  }
]