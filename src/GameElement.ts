import CollisionSets from './CollisionSets';
import Game from './Game';

export interface GameElementConfig {
  name: string,
  sprite: string,
  state: any,
  collisions?: CollisionSets,
  animations?: any,
  pos: { x: number, y: number },
  size?: { width: number, height: number, scale: number },
}

const DEFAULT_CONFIG: GameElementConfig = {
  name: 'Unnamed Element',
  sprite: '',
  state: {
    enabled: false,
  },
  pos: { x: 0, y: 0 },
  size: { width: 10, height: 10, scale: 1 },
};

export function generateConfig(): GameElementConfig {
  return DEFAULT_CONFIG;
}

/**
 * This is an abstract class that must be inherited by any GameElement type
 */
export default abstract class GameElement {
  private game: Game;
  private config: GameElementConfig;

  constructor(game: Game, config: GameElementConfig) {
    this.game = game;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.config.collisions = new CollisionSets();
  }

  get ImageSource(): HTMLImageElement | null {
    return this.game.sprites.getSource(this.config.sprite);
  }

  get Config() { return this.config; }
  // get Name() { return this.config.name; }

  // get XPos() { return this.config.pos.x; }
  // set XPos(v) { this.config.pos.x = v; }

  // get YPos() { return this.config.pos.y; }
  // set YPos(v) { this.config.pos.y = v; }

  // get Width() { return this.config.size.width; }
  // set Width(v) { this.config.size.width = v; }

  // get Height() { return this.config.size.height; }
  // set Height(v) { this.config.size.height = v; }

  // get Scale() { return this.config.size.scale; }
  // set Scale(v) { this.config.size.scale = v; }

  // get HasCollisions() { return this.config.hasCollisions; }

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

  abstract onUpdate(game: Game, lapse: number): void;

  abstract onDraw(game: Game, lapse: number): void;
}
