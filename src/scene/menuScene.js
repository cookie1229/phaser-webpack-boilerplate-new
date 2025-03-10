// import Phaser from "phaser";

import BaseScene from "./baseScene";

class MenuScene extends BaseScene {
  //if any new scene extends from MenuScene, it will have access to the config property (the shareConfig)
  constructor(config) {
    super("MenuScene", config);
    //inherit config some parent class(BaseScene) => in baseScene, this config = config, so no need to write the below code
    //     this.config = config;

    this.menu = [
      { scene: "PlayScene", text: "Play" },
      { scene: "ScoreScene", text: "Score" },
      { scene: null, text: "Exit" },
    ];
  }
  //   }

  create() {
    super.create();

    super.createMenu(this.menu, this.setupMenuEvent.bind(this));
  }

  setupMenuEvent(item) {
    const textGameObject = item.textGameObject;
    textGameObject.setInteractive();
    // textGameObject.on(
    //   "pointerover",
    //   function () {
    //     textGameObject.setStyle({ fill: "#ff0" });
    //   }.bind(this)
    // );
    // textGameObject.on(
    //   "pointerout",
    //   function () {
    //     textGameObject.setStyle({ fill: "#fff" });
    //   }.bind(this)
    // );
    textGameObject.on("pointerover", () => {
      textGameObject.setStyle({ fill: "#ff0" });
    });
    textGameObject.on("pointerout", () => {
      textGameObject.setStyle({ fill: "#fff" });
    });

    textGameObject.on("pointerup", () => {
      console.log(item);

      item.scene && this.scene.start(item.scene);

      if (item.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }

  update() {}
}
export default MenuScene;
