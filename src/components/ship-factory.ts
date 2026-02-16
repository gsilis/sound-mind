import { Ship } from "./ship";

export class ShipFactory {
  create(x: number, y: number, animationType: string) {
    const speed = 30 / 1000
    const ship = new Ship({ speed, name: 'ship', hp: 15 })
    ship.pos.x = x
    ship.pos.y = y

    return ship
  }
}