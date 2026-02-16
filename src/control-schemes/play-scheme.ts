import { BoundingBox, Engine, Keys, Sound } from "excalibur";
import { ControlScheme } from "./control-scheme";
import { ControlStateMachine } from "./control-state-machine";
import { Play } from "../scenes/play";
import { GameData } from "../game-data";
import { FLY_BOOST, FLY_IDLE, FLY_STANDARD, MOVE_LEFT, MOVE_RIGHT, MOVE_STRAIGHT } from "../player";

const gameData = GameData.getInstance()

export class PlayScheme implements ControlScheme<Play> {
  update(scene: Play, stateMachine: ControlStateMachine<Play>, engine: Engine, elapsed: number): void {
    const height = engine.screen.height
    const keyboard = engine.input.keyboard
    const space = keyboard.isHeld(Keys.Space)
    const rightShift = keyboard.isHeld(Keys.ShiftRight)
    const leftShift = keyboard.isHeld(Keys.ShiftLeft)
    const up = keyboard.isHeld(Keys.W) || keyboard.isHeld(Keys.Up)
    const down = keyboard.isHeld(Keys.S) || keyboard.isHeld(Keys.Down)
    const left = keyboard.isHeld(Keys.A) || keyboard.isHeld(Keys.Left)
    const right = keyboard.isHeld(Keys.D) || keyboard.isHeld(Keys.Right)
    const isMoving = up || down || left || right
    const canBoost = gameData.boost.availableFor(elapsed)
    const isBoosting = isMoving && leftShift && canBoost
    const esc = keyboard.wasPressed(Keys.Esc)
    const shoot = space || rightShift

    if (esc) {
      stateMachine.transitionTo('pause')
      gameData.stop()
      return
    }

    if (gameData.hp === 0) {
      stateMachine.transitionTo('game-over')
      gameData.sounds.gameOver.play()
      gameData.stop()
      this.stopAllSounds()
      return
    }

    if (!scene.player) return

    if (isBoosting) {
      gameData.boost.spend(elapsed)
      scene.player.flyState = FLY_BOOST
      !gameData.sounds.boost.isPlaying() && gameData.sounds.boost.play()
      gameData.sounds.fly.stop()
      gameData.sounds.idle.stop()
    } else if (isMoving) {
      scene.player.flyState = FLY_STANDARD
      gameData.sounds.boost.stop()
      !gameData.sounds.fly.isPlaying() && gameData.sounds.fly.play()
      gameData.sounds.idle.stop()
    } else {
      scene.player.flyState = FLY_IDLE
      gameData.sounds.boost.stop()
      gameData.sounds.fly.stop()
      !gameData.sounds.idle.isPlaying() && gameData.sounds.idle.play()
    }

    if (left) {
      scene.player.moveState = MOVE_LEFT
    } else if (right) {
      scene.player.moveState = MOVE_RIGHT
    } else {
      scene.player.moveState = MOVE_STRAIGHT
    }

    const move = gameData.speed * elapsed
    const boostMove = gameData.boostSpeed * elapsed
    const moveAmount = isBoosting ? boostMove : move
    const boundingBox = scene.playerBounds || new BoundingBox()

    if (up) {
      scene.player.pos.y = Math.max(boundingBox.top, scene.player.pos.y - moveAmount)
    } else if (down) {
      scene.player.pos.y = Math.min(boundingBox.bottom, scene.player.pos.y + moveAmount)
    }

    if (left) {
      scene.player.pos.x = Math.max(boundingBox.left, scene.player.pos.x - moveAmount)
    } else if (right) {
      scene.player.pos.x = Math.min(boundingBox.right, scene.player.pos.x + moveAmount)
    }

    if (scene.boostLevel) {
      scene.boostLevel.level = gameData.boost.balance
    }

    scene.backgroundOffset += (elapsed / 10)
    scene.backgroundOffset = scene.backgroundOffset % 64
    const widthOffset = engine.screen.canvasWidth - ((scene.player?.pos.x || 0) / 3)

    scene.background.pos.y = scene.backgroundOffset
    scene.background.pos.x = widthOffset

    if (shoot && scene.wrappedCreateShot && gameData.shots > 0) {
      scene.wrappedCreateShot(scene.player?.pos.x || 0, scene.player?.pos.y || 0)
    }

    const actors = [...scene.actors]

    // Cleanup
    actors.forEach((actor) => {
      if (actor.name === 'ship') {
        if (actor.pos.y > height + 50) {
          scene.remove(actor)
        }
      } else if (actor.name === 'shot') {
        if (actor.pos.y < 0) {
          scene.remove(actor)
        }
      }
    })
  }

  private stopAllSounds() {
    [
      gameData.sounds.boost,
      gameData.sounds.explode,
      gameData.sounds.idle,
      gameData.sounds.fly,
      gameData.sounds.shoot,
      gameData.sounds.damage,
    ].forEach((sound: Sound) => {
      sound.stop()
    })
  }
}