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
  private game: Game;
  private config: GameElementConfig;
  private state: { [key: string]: any }

  constructor(game: Game, config: GameElementConfig = DEFAULT_CONFIG, state: { [key: string]: any } = {}) {
    this.game = game;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.config.collisions = new CollisionSets();
    this.state = state;
  }

  get ImageSource(): HTMLImageElement | null {
    if (!this.config.sprite) return null;
    return this.game.sprites.getSource(this.config.sprite);
  }

  get Config() { return this.config; }

  get State() { return this.state }

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

  abstract onUpdate(game: Game, timeDelta: number): void;

  abstract onDraw(game: Game, timeDelta: number): void;
}
