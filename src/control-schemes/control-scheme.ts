import { Engine } from "excalibur";
import { ControlStateMachine } from "./control-state-machine";

export interface ControlScheme<ConcreteSceneClass> {
  update(scene: ConcreteSceneClass, stateMachine: ControlStateMachine<ConcreteSceneClass>, engine: Engine, elapsed: number): void
}