import { createRenderer } from "../../lib/zwd-mini-vue.esm.js";
import { App } from "./App.js";

const app_PIXI = new PIXI.Application({
  width: 500,
  height: 500,
  background: "#1099bb",
});
document.body.appendChild(app_PIXI.view);

const renderer = createRenderer({
  createElement(type) {
    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 36,
      fontStyle: "italic",
      fontWeight: "bold",
      fill: ["#ffffff", "#00ff99"], // gradient
      stroke: "#4a1850",
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });

    const richText = new PIXI.Text(
      "Rich text with a lot of options and across multiple lines",
      style
    );
    return richText;
  },

  patchProp(el, key, value) {
    el[key] = value;
  },

  insert(el, parent) {
    parent.addChild(el);
  },
});

renderer.createApp(App).mount(app_PIXI.stage);
