import { Engine, Keys } from "excalibur";
import { ControlScheme } from "./control-scheme";
import { ControlStateMachine } from "./control-state-machine";
import { GameData } from "../game-data";

const gameData = GameData.getInstance()

export class PauseScheme<ConcreteSceneClass> implements ControlScheme<ConcreteSceneClass> {
  update(scene: ConcreteSceneClass, stateMachine: ControlStateMachine<ConcreteSceneClass>, engine: Engine, elapsed: number): void {
    const keyboard = engine.input.keyboard
    const esc = keyboard.wasPressed(Keys.Esc)

    if (esc) {
      stateMachine.transitionTo('play')
      gameData.start()
    }
  }
}