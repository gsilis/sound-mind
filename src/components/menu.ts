import { ElementFactory } from "./element-factory"

export interface Menu {
  setup(setupCallback: (factory: ElementFactory) => HTMLElement[]): void
  teardown(): void
}