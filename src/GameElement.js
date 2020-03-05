export default class GameElement {
  constructor(game, config) {
    const DEFAULT_CONFIG = {
      name: 'Unnamed Element',
      state: {},
    };
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.game = game;
    this.game.elements.add(this);
  }

  get name() {
    return this.config.name;
  }

  get state() {
    return this.config.state;
  }

  get sprite() {
    if (!this.config.sprite) {
      throw new Error(`No sprite was referenced for ${this.config.name}`);
    }
    return this.game.sprites.get(this.config.sprite);
  }

  set sprite(val) {
    this.spriteRefId = val;
  }

  draw(lapse) {
    if (this.config.sprite) {
      if (!this.onDraw || typeof this.onDraw !== 'function') {
        throw new Error(`onDraw method not defined for element '${this.config.name}'`);
      }
      this.onDraw(this.game, lapse);
    }
  }

  update(lapse) {
    if (!this.onUpdate || typeof this.onUpdate !== 'function') {
      throw new Error(`onUpdate method not defined for element '${this.config.name}'`);
    }
    this.onUpdate(this.game, lapse);
  }
}