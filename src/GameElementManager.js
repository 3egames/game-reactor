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
    if (this.elements[e.name]) {
      throw new Error(`Element named ${e.name} already exists. Please make sure each element name is unique`);
    }
    this.elements[e.name] = e;
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
      this.elementIndex[i].update(lapse);
    }
  }

  redraw(lapse) {
    this.game.viewport.clear();
    for (let i = 0; i < this.elementIndex.length; i += 1) {
      this.elementIndex[i].draw(lapse);
    }
  }
}