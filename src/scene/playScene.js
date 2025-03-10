import BaseScene from "./baseScene";
const pipeToRender = 4;
// const pipeVerticalDistanceRange = [150, 250];
// const pipeHorizontalDistanceRange = [450, 600];

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);
    // this.config = config;
    // this.initialBirdPosition = { x: 80, y: 300 };
    this.bird = null;
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [450, 600];
    this.pipeHorizontalDistance = 0;
    this.pipes = null;
    this.flapVelocity = 250;
    this.isPause = false;
    this.currentDifficulty = "hard";
    this.difficulties = {
      easy: {
        pipeHorizontalDistanceRange: [350, 400],
        pipeVerticalDistanceRange: [150, 200],
      },
      normal: {
        pipeHorizontalDistanceRange: [280, 330],
        pipeVerticalDistanceRange: [140, 190],
      },
      hard: {
        pipeHorizontalDistanceRange: [280, 320],
        pipeVerticalDistanceRange: [120, 150],
      },
    };
  }

  preload() {}

  create() {
    //extend the base scene create method to create background
    super.create();
    this.createBird();
    this.createPipes();
    this.handleInput();
    this.createCollider();
    this.checkGameStatus();
    this.createScore();
    this.createPauseBtn();
    this.listenToEvents();
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 8, end: 15 }),
      frameRate: 8, //number of frames per second
      repeat: -1, //-1 means infinite loop
    });
    this.bird.play("fly");
    // super.sayHello();
    // this.restart();
    // this.add.image(0, 0, "sky").setOrigin(0, 0);
    // //middle of the height., 1/10 of thee width
    // this.bird = this.physics.add
    //   .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
    //   .setOrigin(0, 0);
    // this.bird.body.gravity.y = 400;
    // this.pipes = this.physics.add.group();

    // for (let i = 0; i < pipeToRender; i++) {
    //   const upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
    //   const lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 0);

    //   //   placePipe(upperPipe, lowerPipe);
    // }

    // this.pipes.setVelocityX(-200);
    //set the gravity(weight) of the bird (the number is larger the faster the bird falls)
    // bird.body.gravity.y = this.physics.world.gravity.y;
    //set the speed of the bird that move on y axis(200px / second)
    // bird.body.velocity.x = velocity;

    // this.input.on("pointerdown", this.flap, this);
    // let keySpace = this.input.keyboard.addKey(
    //   Phaser.Input.Keyboard.KeyCodes.SPACE
    // );
    // this.input.keyboard.on("keydown", () => {
    //   if (keySpace.isDown) {
    //     console.log("keySpace.isDown");

    //     this.flap(), this;
    //   }
    // });
  }

  update() {
    this.recyclePipes();
    this.checkGameStatus();
  }

  listenToEvents() {
    // check if there is pauseEvent, if there is, then return, to prevent multiple pauseEvent
    if (this.pauseEvent) {
      return;
    }
    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(
          ...this.screenCenter,
          "Fly in : " + this.initialTime,
          this.fontOptions
        )
        .setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText("Fly in : " + this.initialTime);
    if (this.initialTime <= 0) {
      this.physics.resume();
      this.countDownText.setText("");
      this.timedEvent.remove();
      this.isPause = false;
    }
  }
  checkGameStatus() {
    if (
      this.bird.body.position.y <= 0 ||
      this.bird.body.position.y + this.bird.body.height >= this.config.height
    ) {
      this.restart();
    }
  }

  placePipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
    );

    //the possible position of the upperPipe on the y axis
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );

    this.pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
    );

    const rightMostX = this.getRightMostPipe();

    uPipe.x = rightMostX + this.pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = pipeVerticalPosition + pipeVerticalDistance;
  }

  recyclePipes() {
    let tempPipes = [];

    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right < 0) {
        tempPipes.push(pipe);
        //each time there are two pipes (upper and lower, they passed together) in the tempPipes array, then recycle them
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  flap() {
    //if the game is paused, then do not flap the bird (to fix flap issue when resume the game => when click continue button, the bird will flap)
    if (this.isPause) return;
    this.bird.body.velocity.y = -this.flapVelocity;
  }
  increaseDifficulty() {
    console.log(this.currentDifficulty);

    if (this.score == 5) {
      this.currentDifficulty = "normal";
    }
    if (this.score == 10) {
      this.currentDifficulty = "hard";
    }
  }
  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.score > localStorage.getItem("highestScore")) {
      localStorage.setItem("highestScore", this.score);
      this.highestScoreText.setText(`Highest Score: ${this.score}`);
    }
  }

  restart() {
    // this.bird.body.position.y = this.config.startPosition.y;
    // this.bird.body.position.x = this.config.startPosition.x;
    // this.bird.body.velocity.y = 0;

    //save highest score
    const highestScore = localStorage.getItem("highestScore");
    if (!highestScore || this.score > highestScore) {
      localStorage.setItem("highestScore", this.score);
    }

    this.physics.pause();
    this.bird.setTint(0xee4b24);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
        this.currentDifficulty = "easy";
      },
      loop: false,
    });
  }

  getRightMostPipe() {
    let rightMostX = 0;
    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }

  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setScale(2)

      .setFlipX(true)
      .setOrigin(0, 0);

    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.body.gravity.y = 400;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < pipeToRender; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe);
    }
    this.pipes.setVelocityX(-200);
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "32px",
      fill: "#2D2D2D",
      fontStyle: "BOLD",
    });

    this.highestScore = localStorage.getItem("highestScore");
    this.highestScoreText = this.add.text(
      16,
      52,
      `Highest Score: ${this.highestScore || 0}`,
      {
        fontSize: "32px",
        fontStyle: "BOLD",
      }
    );
  }

  createPauseBtn() {
    this.isPause = false;
    const pauseBtn = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setInteractive()
      .setOrigin(1, 1)
      .setScale(3);
    pauseBtn.on("pointerdown", () => {
      this.physics.pause();
      this.scene.pause();
      //open the PauseScene but keep the PlayScene running in the background
      this.scene.launch("PauseScene");
      this.isPause = true;
    });
  }

  handleInput() {
    this.input.on("pointerdown", this.flap, this);
    let keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.input.keyboard.on("keydown", () => {
      if (keySpace.isDown) {
        console.log("keySpace.isDown");
        this.flap(), this;
      }
    });
  }

  createCollider() {
    this.physics.add.collider(this.bird, this.pipes, this.restart, null, this);
  }
}

export default PlayScene;
