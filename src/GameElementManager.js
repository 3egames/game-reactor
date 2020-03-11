import GameElement from './GameElement';

export default class GameElementManager {
  constructor(game) {
    this.game = game;
    this.elements = {};
    this.elementIndex = [];
  }

  add(e) {
    if (e instanceof GameElement === false) {
      throw new Error('Value to add is not an instance of GameElement');
    }
    if (this.elements[e.Name]) {
      throw new Error(`Element named ${e.Name} already exists. Please make sure each element name is unique`);
    }
    this.elements[e.Name] = e;
    this.elementIndex.push(e);
  }

  get(name) {
    if (!this.elements[name]) {
      throw new Error(`Element ${name} not found`);
    }
    return this.elements[name];
  }

  update(lapse) {
    for (let i = 0; i < this.elementIndex.length; i += 1) {
      if (this.elementIndex[i].onUpdate && typeof this.elementIndex[i].onUpdate === 'function') {
        this.elementIndex[i].update(lapse);
      }
    }
  }

  redraw(lapse) {
    this.game.viewport.clear();
    for (let i = 0; i < this.elementIndex.length; i += 1) {
      if (this.elementIndex[i].onDraw && typeof this.elementIndex[i].onDraw === 'function') {
        this.elementIndex[i].draw(lapse);
      }
    }
  }
}