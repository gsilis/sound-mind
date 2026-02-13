import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { Play } from "./scenes/play";
import { AudioSelectLevel } from "./scenes/audio-select-level";
import { StartGameLevel } from "./scenes/start-game-level";
import { AudioReport } from "./scenes/audio-report";

// Goal is to keep main.ts small and just enough to configure the engine

const transitionIn = new FadeInOut({ duration: 200, direction: 'in', color: Color.ExcaliburBlue })
const transitionOut = new FadeInOut({ duration: 200, direction: 'out', color: Color.ExcaliburBlue })
const transitions = { in: transitionIn, out: transitionOut }

const game = new Engine({
  canvasElementId: 'game-canvas',
  width: 800, // Logical width and height in game pixels
  height: 600,
  displayMode: DisplayMode.Fixed, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    start: StartGameLevel,
    audioShoot: {
      scene: AudioSelectLevel,
      transitions: { ...transitions }
    },
    audioMissile: {
      scene: AudioSelectLevel,
      transitions: { ...transitions }
    },
    audioShip: {
      scene: AudioSelectLevel,
      transitions: { ...transitions }
    },
    audioBoost: {
      scene: AudioSelectLevel,
      transitions: { ...transitions }
    },
    audioExplosion: {
      scene: AudioSelectLevel,
      transitions: { ...transitions }
    },
    audioReport: {
      scene: AudioReport,
      transitions: { ...transitions }
    },
    game:  Play,
  },
  // physics: {
  //   solver: SolverStrategy.Realistic,
  //   substep: 5 // Sub step the physics simulation for more robust simulations
  // },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

game.start('start', { // name of the start scene 'start'
  loader, // Optional loader (but needed for loading images/sounds)
  inTransition: new FadeInOut({ // Optional in transition
    duration: 300,
    direction: 'in',
    color: Color.ExcaliburBlue
  }),
}).then(() => {
  // Do something after the game starts
});
