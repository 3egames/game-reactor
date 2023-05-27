import { Game } from './Game';
import { GameElement } from './GameElement';
import { GameLog } from './GameLog';

export class GameElementManager {
  private _elements: { [key: string]: GameElement }
  private _elementIndex: GameElement[];
  private _logger: GameLog;

  constructor(logger: GameLog) {
    this._elements = {};
    this._elementIndex = [];
    this._logger = logger;
  }

  add(e: GameElement) {
    this._elements[e.Config.name] = e;
    this._elementIndex.push(e);
    this._logger.debug(`Added GameElement '${e.Config.name}' to manager.`)
  }

  get(name: string) {
    if (!this._elements[name]) {
      throw new Error(`Element ${name} not found`);
    }
    return this._elements[name];
  }

  update(game: Game, timeDelta: number) {
    for (let i = 0; i < this._elementIndex.length; i += 1) {
      if (this._elementIndex[i].onUpdate && typeof this._elementIndex[i].onUpdate === 'function') {
        this._elementIndex[i].onUpdate(timeDelta);
      }
    }
  }

  redraw(game: Game, timeDelta: number) {
    //this.game.viewport.clear();
    for (let i = 0; i < this._elementIndex.length; i += 1) {
      if (this._elementIndex[i].onDraw && typeof this._elementIndex[i].onDraw === 'function') {
        this._elementIndex[i].onDraw(timeDelta);
      }
    }
  }
}
