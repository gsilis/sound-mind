import { Engine } from "excalibur";
import { ControlScheme } from "./control-scheme";
import { NullControlScheme } from "./null-scheme";

export class ControlStateMachine<ConcreteSceneClass> {
  private nullScheme = new NullControlScheme()
  private states: Record<string, ControlScheme<ConcreteSceneClass>> = {}
  private transitionable: Record<string, string[]> = {}
  private state: string = ''

  addState(name: string, scheme: ControlScheme<ConcreteSceneClass>, allowStates: string[]) {
    this.states[name] = scheme
    this.transitionable[name] = allowStates
  }

  transitionTo(newState: string) {
    const allowed = this.transitionable[this.state] || []
    const nullState = this.state === ''
    const canTransition = allowed.includes(newState)

    if (nullState || canTransition) {
      this.state = newState
    } else {
      console.error(`ControlStateMachine cant go from '${this.state}' to '${newState}'. Allowed states are [${allowed.join(', ')}]`)
    }
  }

  update(scene: ConcreteSceneClass, engine: Engine, elapsed: number) {
    this.currentScheme().update(scene, this, engine, elapsed)
  }

  isCurrent(state: string) {
    return state === this.state
  }

  private currentScheme(): ControlScheme<ConcreteSceneClass> {
    return this.states[this.state] || this.nullScheme
  }
}