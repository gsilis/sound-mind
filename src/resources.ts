import { ImageSource } from "excalibur";
import { Loader } from "./loader";

// It is convenient to put your resources in one place
export const Resources = {
  Background: new ImageSource("./images/background.png"),
  Drone: new ImageSource("./images/drone.png"),
  Explosion: new ImageSource("./images/explosion.gif"),
  Logo: new ImageSource("./images/logo.png"),
  Missile: new ImageSource("./images/missile.png"),
  Missing: new ImageSource("./images/missing.png"),
  PlaneRight: new ImageSource("./images/plane-right.png"),
  PlaneLeft: new ImageSource("./images/plane-left.png"),
  Plane: new ImageSource("./images/plane.png"),
  PlaneFlame: new ImageSource("./images/flame.png"),
  PlaneFlameMove: new ImageSource("./images/flame-moving.png"),
  PlaneFlameBoost: new ImageSource("./images/flame-boost.png"),
  Ship: new ImageSource("./images/ship.png"),
  Shots: new ImageSource("./images/shots.png"),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources. 
// So when you type Resources.Sword -> ImageSource

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
