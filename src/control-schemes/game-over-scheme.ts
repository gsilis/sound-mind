import { Engine, Keys } from "excalibur";
import { ControlScheme } from "./control-scheme";
import { ControlStateMachine } from "./control-state-machine";
import { GameData } from "../game-data";

const gameData = GameData.getInstance()

export class GameOverScheme<Play> implements ControlScheme<Play> {
  update(scene: Play, stateMachine: ControlStateMachine<Play>, engine: Engine, elapsed: number): void {
    const keyboard = engine.input.keyboard
    const enter = keyboard.wasPressed(Keys.Enter)

    if (enter) {
      gameData.reset()
      engine.goToScene('start')
    }
  }
}