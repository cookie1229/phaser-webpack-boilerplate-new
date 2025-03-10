// import Phaser from "phaser";

import BaseScene from "./baseScene";

class PauseScene extends BaseScene {
  //if any new scene extends from MenuScene, it will have access to the config property (the shareConfig)
  constructor(config) {
    super("PauseScene", config);
    //inherit config some parent class(BaseScene) => in baseScene, this config = config, so no need to write the below code
    //     this.config = config;

    this.menu = [
      { scene: "PlayScene", text: "Continue" },
      { scene: "MenuScene", text: "Exit" },
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
      console.log("clicking on some option");
      if (item.scene && item.text === "Continue") {
        this.scene.stop(); // Stop the PauseScene
        this.scene.resume(item.scene); // Resume the PlayScene
      } else if (item.scene && item.text === "Exit") {
        this.scene.stop("PlayScene"); // Stop the PlayScene
        this.scene.stop(); // Stop the PauseScene
        this.scene.start(item.scene); // Start the MenuScene
      }
    });
  }

  update() {}
}
export default PauseScene;
