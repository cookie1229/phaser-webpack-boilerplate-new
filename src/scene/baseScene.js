import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
  // Constructor method (called when a new object is created)

  constructor(key, config) {
    super(key);

    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontSize = 34;
    this.lineHeight = 42;
    this.fontOptions = {
      fontSize: `${this.fontSize}px`,
      fill: "#fff",
      fontStyle: "bold",
    };
  }
  //   sayHello() {
  //     alert("Hello");
  //   }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }

  createMenu(menu, callback) {
    // menu.forEach((menuItem) => {
    //   const menuPosition = menu.map((menuItem) => menuItem.scene);
    //   const menuText = this.add.text(0, 0, menuItem.text, {
    //     fontSize: "32px",
    //     fill: "#fff",
    //   });
    //   menuText.setOrigin(0.5, 0.5);
    //   menuText.setPosition(
    //     this.config.width / 2,
    //     this.config.height / 2 + menuPosition.indexOf(menuItem.scene) * 40
    //   );
    // });

    let lastMenuPositionY = 0;
    menu.forEach((menuItem) => {
      const menuPosition = [
        this.screenCenter[0],
        this.screenCenter[1] - this.lineHeight / 2 + lastMenuPositionY,
      ];
      menuItem.textGameObject = this.add
        .text(...menuPosition, menuItem.text, this.fontOptions)
        .setOrigin(0.5, 1);
      callback(menuItem);

      lastMenuPositionY += this.lineHeight;
    });
  }
}

export default BaseScene;
