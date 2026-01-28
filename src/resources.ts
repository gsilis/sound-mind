import { ImageSource, Loader } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  // Sword: new ImageSource("./images/sword.png") // Vite public/ directory serves the root images
  Background: new ImageSource("./images/background.png"),
  Drone: new ImageSource("./images/drone.png"),
  Missile: new ImageSource("./images/missile.png"),
  Plane: new ImageSource("./images/plane.png"),
  PlaneFlame: new ImageSource("./images/plane-flame.png"),
  PlaneFlameBoost: new ImageSource("./images/plane-flame-boost.png"),
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
