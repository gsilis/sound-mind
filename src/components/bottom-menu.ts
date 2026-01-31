import { Actor } from "excalibur";
import { Menu } from "./menu";
import { ElementFactory } from "./element-factory";

export class BottomMenu extends Actor implements Menu {
  setup(setupCallback: (factory: ElementFactory) => HTMLElement[]): void {
    
  }
  teardown(): void {}
}