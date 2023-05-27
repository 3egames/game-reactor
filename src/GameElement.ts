import { CollisionSets } from './CollisionSets';
import { Game } from './Game';

export interface GameElementConfig {
  name: string,
  sprite?: string,
  collisions?: CollisionSets,
  animations?: any,
  pos?: { x: number, y: number },
  size?: { width: number, height: number, scale: number },
}

const DEFAULT_CONFIG: GameElementConfig = {
  name: 'Unnamed Element',
  sprite: '',
  pos: { x: 0, y: 0 },
  size: { width: 10, height: 10, scale: 1 },
};

export function generateConfig(): GameElementConfig {
  return DEFAULT_CONFIG;
}

/**
 * This is an abstract class that must be inherited by any GameElement type
 */
export abstract class GameElement {
  private _game: Game;
  private _config: GameElementConfig;
  private state: { [key: string]: any }

  constructor(game: Game, config: GameElementConfig = DEFAULT_CONFIG, state: { [key: string]: any } = {}) {
    this._game = game;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._config.collisions = new CollisionSets();
    this.state = state;
    game.Logger.debug(`GameElement '${this.Config.name}' initialized.`)
  }

  get ImageSource(): HTMLImageElement | null {
    if (!this._config.sprite) return null;
    return this._game.Sprites.getSource(this._config.sprite);
  }

  get Config() { return this._config; }

  get State() { return this.state }

  get Game() { return this._game }

  // get Collisions() {
  //   if (!this.HasCollisions) {
  //     throw new Error(`GameElement '${this.Name}' was not set to use collisions`);
  //   }
  //   return this.config.collisions;
  // }

  // get State() { return this.config.state; }

  // get Sprite() {
  //   if (!this.config.sprite) {
  //     throw new Error(`No sprite was referenced for ${this.config.name}`);
  //   }
  //   return this.game.Sprites.getSource(this.config.sprite);
  // }

  abstract onUpdate(timeDelta: number): void;

  abstract onDraw(timeDelta: number): void;
}
