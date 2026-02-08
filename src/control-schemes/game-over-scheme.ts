import { Engine } from "excalibur";
import { ControlScheme } from "./control-scheme";
import { ControlStateMachine } from "./control-state-machine";

export class GameOverScheme<ConcreteSceneClass> implements ControlScheme<ConcreteSceneClass> {
  update(scene: ConcreteSceneClass, stateMachine: ControlStateMachine<ConcreteSceneClass>, engine: Engine, elapsed: number): void {
    
  }
}