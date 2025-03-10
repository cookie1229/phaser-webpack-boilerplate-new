import Phaser, { Scene } from "phaser";
import PlayScene from "./scene/playScene";

const config = {
  type: Phaser.AUTO, //WebGL (web graphic library JS API to render 2D or 3D)
  width: 800,
  height: 600,
  physics: {
    //arcade physic plugin, manage physics simulation
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [new PlayScene()],
};

console.log(PlayScene);

let totalDelta = null;
let lowerPipe = null;
let upperPipe = null;

let pipeVerticalDistanceRange = [150, 250];
let pipeHorizontalDistanceRange = [450, 600];

const velocity = 200;

const flapVelocity = 250;

const initialBirdPosition = { x: config.width / 10, y: config.height / 2 };

const pipeToRender = 4;

let pipes = null;

let initialPipeHorizontalDistance = 0;

function preload() {
  this.load.image("sky", "../assets/sky.png");
  this.load.image("bird", "../assets/bird.png");
  this.load.image("pipe", "../assets/pipe.png");
}

function create() {
  //add the image to the center of the screen
  // this.add.image(config.width / 2, config.height / 2, "sky");

  //or set the origin to the center of the image
  this.add.image(0, 0, "sky").setOrigin(0, 0);
  //middle of the height., 1/10 of thee width
  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0, 0);
  bird.body.gravity.y = 400;

  //pipe group
  pipes = this.physics.add.group();

  for (let i = 0; i < pipeToRender; i++) {
    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }
  pipes.setVelocityX(-200);
  //set the gravity(weight) of the bird (the number is larger the faster the bird falls)
  // bird.body.gravity.y = this.physics.world.gravity.y;
  //set the speed of the bird that move on y axis(200px / second)
  // bird.body.velocity.x = velocity;

  this.input.on("pointerdown", flap);
  let keySpace = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );
  this.input.keyboard.on("keydown", () => {
    if (keySpace.isDown) {
      flap();
    }
  });
}

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

// if bird position is greater than the width of the screen, change the direction of the bird,else reverse the direction
function update(time, delta) {
  if (
    bird.body.position.y < 0 ||
    bird.body.position.y + bird.body.height > config.height
  ) {
    restart();
  }

  recyclePipes();
}

function placePipe(uPipe, lPipe) {
  const pipeVerticalDistance = Phaser.Math.Between(
    ...pipeVerticalDistanceRange
  );

  //the possible position of the upperPipe on the y axis
  const pipeVerticalPosition = Phaser.Math.Between(
    0 + 20,
    config.height - 20 - pipeVerticalDistance
  );

  const pipeHorizontalDistance = Phaser.Math.Between(
    ...pipeHorizontalDistanceRange
  );

  const rightMostX = getRightMostPipe();

  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = pipeVerticalPosition + pipeVerticalDistance;
}

function recyclePipes() {
  let tempPipes = [];

  pipes.getChildren().forEach((pipe) => {
    if (pipe.getBounds().right < 0) {
      tempPipes.push(pipe);
      //each time there are two pipes (upper and lower, they passed together) in the tempPipes array, then recycle them
      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  });
}
function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function restart() {
  bird.body.position.y = initialBirdPosition.y;
  bird.body.position.x = initialBirdPosition.x;
  bird.body.velocity.y = 0;
}

function getRightMostPipe() {
  let rightMostX = 0;
  pipes.getChildren().forEach((pipe) => {
    rightMostX = Math.max(pipe.x, rightMostX);
  });
  return rightMostX;
}
new Phaser.Game(config);
