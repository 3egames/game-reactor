import GameViewport, { ViewPortConfig } from './GameViewport';
import SpriteManager from './SpriteManager';
import GameElementManager from './GameElementManager';
import GameFontManager from './GameFontManager';
import SoundMixer from './SoundMixer';
import GameLog, { GameLogLevels } from './GameLog';

let self: Game;
let gameLoopInterval: ReturnType<typeof setTimeout>;

export enum GameMouseButtons {
  unknown, left, right, middle, back, forward
}

export interface GameMouseEvent {
  button: GameMouseButtons,
  withCtrlKey: boolean,
  withAltKey: boolean,
  withMetaKey: boolean,
  withShiftKey: boolean,
  x: number,
  y: number,
}

interface GameConfig {
  name: string,
  viewport: ViewPortConfig,
  logLevel?: GameLogLevels,
}

const DEFAULT_CONFIG = {
  name: 'Unnamed Game',
  viewport: {
    showCollisions: false,
    showPerfStats: false,
    fps: 30,
    width: 360,
    height: 270,
  },
};

export default abstract class Game {
  elements: GameElementManager;
  config: GameConfig;
  viewport: GameViewport;
  state: any;
  fonts: GameFontManager;
  sounds: SoundMixer;
  sprites: SpriteManager;
  instanceID: number;
  logger: GameLog;

  constructor(config: GameConfig, state: any) {
    this.instanceID = Math.round(Math.random() * 1000)
    this.logger = new GameLog(this.instanceID.toString(), config.logLevel = GameLogLevels.info);
    this.logger.info('Initializing game instance...');
    this.state = state;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.viewport = new GameViewport(config.viewport);
    this.elements = new GameElementManager();
    this.fonts = new GameFontManager();
    this.sounds = new SoundMixer(this.logger);
    this.sprites = new SpriteManager();
    self = this;
  }

  abstract onReady(): void;
  abstract onDisengaged(): void;

  onComponentMounted() {
    self.logger.info('Game component mounted!')
    if (gameLoopInterval !== null) {
      clearInterval(gameLoopInterval);
    }

    this.onReady();
    this.startGameLoop();
  }

  onComponentUnmount() {
    this.logger.info('Game component unmounted!')
    if (gameLoopInterval) { // kill old interval
      clearInterval(gameLoopInterval);
    }
    this.sounds.stopAll();
    this.onDisengaged();
  }

  get ShowCollisions() { return this.config.viewport.showCollisions; }

  get Name() {
    return this.config.name;
  }

  get State() {
    return self.state;
  }

  abstract onDraw(lapse: number, sysPerf: any): void;
  abstract onUpdate(lapse: number): void;

  // My style of a basic game loop :p
  startGameLoop() {
    let frameNumber = 1;
    let nextFrame = (1000 / self.config.viewport.fps) * frameNumber;
    let secondCounter = 0;
    let prev = new Date().getTime();
    let current = prev;
    let lapse = 0;
    if (gameLoopInterval) { // kill old interval
      clearInterval(gameLoopInterval);
    }
    gameLoopInterval = setInterval(() => {
      current = new Date().getTime();
      lapse = current - prev;
      secondCounter += lapse;
      if (secondCounter > nextFrame) {
        self.onUpdate(lapse);
        self.onDraw(lapse, { frameNumber });
        frameNumber += 1;
        nextFrame = (1000 / self.config.viewport.fps) * frameNumber;
      }
      if (secondCounter > 1000) { // reset counters on 1 second mark
        secondCounter -= 1000;
        frameNumber = 1;
        nextFrame = (1000 / self.config.viewport.fps) * frameNumber;
      }
      prev = current;
    }, 10);

  }

  // User action or events
  onMouseClick?(e: GameMouseEvent) { }
  onMouseDown?(e: GameMouseEvent) { }
  onMouseUp?(e: GameMouseEvent) { }
}
