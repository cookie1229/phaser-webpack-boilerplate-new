// import Phaser from "phaser";

import BaseScene from "./baseScene";

class ScoreScene extends BaseScene {
  //if any new scene extends from MenuScene, it will have access to the config property (the shareConfig)
  constructor(config) {
    super("ScoreScene", config);
    //inherit config some parent class(BaseScene) => in baseScene, this config = config, so no need to write the below code
    //     this.config = config;

    // this.menu = [
    //   { scene: "PlayScene", text: "Play" },
    //   { scene: "ScoreScene", text: "Score" },
    //   { scene: null, text: "Exit" },
    // ];
  }
  //   }

  create() {
    super.create();

    const bestScore = localStorage.getItem("highestScore");
    this.add
      .text(
        ...this.screenCenter,
        `Best Score: ${bestScore || 0}`,
        this.fontOptions
      )
      .setOrigin(0.5);
  }

  update() {}
}
export default ScoreScene;
