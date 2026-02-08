import { Engine, Scene } from "excalibur";
import { ControlScheme } from "./control-scheme";
import { ControlStateMachine } from "./control-state-machine";

export class NullControlScheme implements ControlScheme<Scene> {
  update(scene: Scene<unknown>, stateMachine: ControlStateMachine<Scene<unknown>>, engine: Engine, elapsed: number): void {}
}