import Phaser, { Scene } from "phaser";
import PlayScene from "./scene/playScene";
import MenuScene from "./scene/menuScene";
import PreloadScene from "./scene/preloadScene";
import ScoreScene from "./scene/scoreScene";
import PauseScene from "./scene/pauseScene";

const width = 400;
const height = 600;
const startPosition = { x: width / 10, y: height / 2 };
const sharedConfig = {
  width,
  height,
  startPosition,
};

const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene];
//create scene based by on the share configuration
const createScene = (Scene) => new Scene(sharedConfig);

const initScenes = () => Scenes.map((Scene) => createScene(Scene));
const config = {
  type: Phaser.AUTO, //WebGL (web graphic library JS API to render 2D or 3D)
  ...sharedConfig,
  pixelArt: true,
  physics: {
    //arcade physic plugin, manage physics simulation
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: initScenes(),
};

//60 fps

//t1 = 0px/s
//t1 = 200px/s
//t2 = 400px/s
//every frame is around 16.6667ms => 16.6667ms * 60 = 1000ms = 1s
// function update(time, delta) {
//   if (totalDelta >= 1000) {
//     console.log(bird.body.position.x);

//     totalDelta = 0;
//   }

//   // console.log(totalDelta);
//   totalDelta += delta;
// }

new Phaser.Game(config);
