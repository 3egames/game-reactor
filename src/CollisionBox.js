export default class CollisionBox {
  constructor(element, config) {
    this.element = element;
    const DEFAULT_CONFIG = {
      xOffset: 0,
      yOffset: 0,
      width: 10,
      height: 10,
      color: '#0f0',
    };
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
    return this.element.XPos + this.config.xOffset;
  }

  get X2Pos() {
    return this.element.XPos + this.config.xOffset + this.config.width;
  }

  get YPos() {
    return this.element.YPos + this.config.yOffset;
  }

  get Y2Pos() {
    return this.element.YPos + this.config.yOffset + this.config.height;
  }

}