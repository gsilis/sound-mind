import { Actor } from "excalibur";
import { Shot } from "./shot";
import { GameData } from "../game-data";

const gameData = GameData.getInstance()

export class ShotFactory {
  create(x: number, y: number): Actor {
    gameData.shots -= 1

    return new Shot({ speed: 200 / 1000, x, y, damage: gameData.shotDamage })
  }
}