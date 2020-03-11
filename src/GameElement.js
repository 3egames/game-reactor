import CollisionSets from './CollisionSets';

export default class GameElement {
  constructor(game, config) {
    const DEFAULT_CONFIG = {
      name: 'Unnamed Element',
      state: {},
      hasCollisions: false,
      pos: { x: 0, y: 0 },
      size: { width: 10, height: 10, scale: 1 },
    };
    this.config = { ...DEFAULT_CONFIG, ...config };
    if (this.config.hasCollisions) {
      this.config.collisions = new CollisionSets(this);
    }
    this.game = game;
    this.game.elements.add(this);
  }

  get Name() { return this.config.name; }

  get XPos() { return this.config.pos.x; }
  set XPos(v) { this.config.pos.x = v; }

  get YPos() { return this.config.pos.y; }
  set YPos(v) { this.config.pos.y = v; }

  get Width() { return this.config.size.width; }
  set Width(v) { this.config.size.width = v; }

  get Height() { return this.config.size.height; }
  set Height(v) { this.config.size.height = v; }

  get Scale() { return this.config.size.scale; }
  set Scale(v) { this.config.size.scale = v; }

  get HasCollisions() { return this.config.hasCollisions; }

  get Collisions() {
    if (!this.HasCollisions) {
      throw new Error(`GameElement '${this.Name}' was not set to use collisions`);
    }
    return this.config.collisions;
  }

  get State() { return this.config.state; }

  get Sprite() {
    if (!this.config.sprite) {
      throw new Error(`No sprite was referenced for ${this.config.name}`);
    }
    return this.game.Sprites.getSource(this.config.sprite);
  }

  update(lapse) {
    if (!this.onUpdate || typeof this.onUpdate !== 'function') {
      throw new Error(`onUpdate method not defined for element '${this.config.name}'`);
    }
    this.onUpdate(this.game, lapse);
  }

  draw(lapse) {
    if (this.config.sprite) {
      if (!this.onDraw || typeof this.onDraw !== 'function') {
        throw new Error(`onDraw method not defined for element '${this.config.name}'`);
      }
      this.onDraw(this.game, lapse);
    }
  }
}