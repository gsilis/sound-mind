import { Engine, Scene, SceneActivationContext } from "excalibur";
import { setupSteps } from "./setup-steps";

export class AudioSelectLevel extends Scene {
  private _step?: number = -1;
  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
  }

  override onInitialize(engine: Engine): void {
    
  }
}