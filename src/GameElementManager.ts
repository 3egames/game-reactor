import Game from './Game';
import GameElement from './GameElement';

export default class GameElementManager {
  private elements: { [key: string]: GameElement }
  private elementIndex: GameElement[];

  constructor() {
    this.elements = {};
    this.elementIndex = [];
  }

  add(e: GameElement) {
    this.elements[e.Config.name] = e;
    this.elementIndex.push(e);
  }

  get(name: string) {
    if (!this.elements[name]) {
      throw new Error(`Element ${name} not found`);
    }
    return this.elements[name];
  }

  update(game: Game, lapse: number) {
    for (let i = 0; i < this.elementIndex.length; i += 1) {
      if (this.elementIndex[i].onUpdate && typeof this.elementIndex[i].onUpdate === 'function') {
        this.elementIndex[i].onUpdate(game, lapse);
      }
    }
  }

  redraw(game: Game, lapse: number) {
    //this.game.viewport.clear();
    for (let i = 0; i < this.elementIndex.length; i += 1) {
      if (this.elementIndex[i].onDraw && typeof this.elementIndex[i].onDraw === 'function') {
        this.elementIndex[i].onDraw(game, lapse);
      }
    }
  }
}
