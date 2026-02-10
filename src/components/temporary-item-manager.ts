import { Actor, ActorArgs, Engine, Gif, Scene } from "excalibur";
import { TemporaryActor } from "../interfaces/temporary-actor";

export class TemporaryItemManager<T extends Actor> {
  private _scene: Scene
  private _name: string
  private _itemClass: { new(args?: ActorArgs): T }

  constructor(scene: Scene, itemClass: { new(args?: ActorArgs): T }, name: string) {
    this._scene = scene
    this._name = name
    this._itemClass = itemClass
  }

  createAt(referenceActor: Actor) {
    const { x, y } = referenceActor.pos
    let instance = new this._itemClass({ x, y })

    this._scene.add(instance)
  }

  update(engine: Engine) {
    const actors = [ ...this._scene.actors ]

    actors.filter((actor) => {
      return actor.name === this._name
    }).forEach((actor) => {
      const castItem = actor as unknown as TemporaryActor
      const isComlete = castItem?.complete

      if (isComlete) this._scene.remove(actor)
    })
  }
}