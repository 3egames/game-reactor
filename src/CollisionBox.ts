import GameElement from "./GameElement";

export interface CollisionBoxConfig {
  xOffset: number,
  yOffset: number,
  width: number,
  height: number,
  color: string,
}

const DEFAULT_CONFIG: CollisionBoxConfig = {
  xOffset: 0,
  yOffset: 0,
  width: 10,
  height: 10,
  color: '#0f0',
};

export default class CollisionBox {
  config: CollisionBoxConfig;
  element: GameElement;

  constructor(element: GameElement, config: CollisionBoxConfig) {
    this.element = element;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  get XOffset() {
    return this.config.xOffset;
  }

  get Color() {
    return this.config.color;
  }

  get YOffset() {
    return this.config.yOffset;
  }

  get Height() {
    return this.config.height;
  }

  get Width() {
    return this.config.width;
  }

  get XPos() {
    return this.element.Config.pos.x + this.config.xOffset;
  }

  get X2Pos() {
    return this.element.Config.pos.x + this.config.xOffset + this.config.width;
  }

  get YPos() {
    return this.element.Config.pos.y + this.config.yOffset;
  }

  get Y2Pos() {
    return this.element.Config.pos.y + this.config.yOffset + this.config.height;
  }
}
