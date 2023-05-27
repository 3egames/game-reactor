import { GameViewport, ViewPortConfig } from './GameViewport';
import { SpriteManager } from './SpriteManager';
import { GameElementManager } from './GameElementManager';
import { GameFontManager } from './GameFontManager';
import { SoundMixer } from './SoundMixer';
import { GameLog, GameLogLevels } from './GameLog';

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

export interface GameConfig {
  name: string,
  viewport?: ViewPortConfig,
  logLevel?: GameLogLevels,
}

export interface SystemPerformance {
  frameCurrent: number,
  frameMax: number
}

const DEFAULT_CONFIG = {
  name: 'Unnamed Game',
  logLevel: GameLogLevels.info
};

export abstract class Game {
  elements: GameElementManager;
  config: GameConfig;
  viewport: GameViewport;
  state: { [key: string]: any };
  fonts: GameFontManager;
  sounds: SoundMixer;
  sprites: SpriteManager;
  instanceID: number;
  logger: GameLog;

  constructor(config: GameConfig = DEFAULT_CONFIG, state: { [key: string]: any } = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.instanceID = Math.round(Math.random() * 1000)
    this.logger = new GameLog(this.instanceID.toString(), this.config.logLevel ?? GameLogLevels.info);
    this.logger.info('Initializing game instance...');
    this.state = state;
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

  get ShowCollisions() { return this.viewport.Config.showCollisions; }

  get Name() {
    return this.config.name;
  }

  get State() {
    return self.state;
  }

  abstract onDraw(timeDelta: number, sysPerf: SystemPerformance): void;
  abstract onUpdate(timeDelta: number): void;

  /** This starts the game loop */
  private startGameLoop() {
    let frameNumber = 1;
    let nextFrame = (1000 / this.viewport.Config.fps!) * frameNumber;
    let timeCursor = 0;
    let lastFrameElapse = 0;
    let previousTimestamp = new Date().getTime();
    let currentTimestamp = previousTimestamp;
    if (gameLoopInterval) { // kill any old interval
      clearInterval(gameLoopInterval);
    }
    gameLoopInterval = setInterval(() => {
      currentTimestamp = new Date().getTime();
      timeCursor += currentTimestamp - previousTimestamp;
      if (timeCursor > nextFrame) {
        const timeDelta = (timeCursor - lastFrameElapse) / 1000;
        self.onUpdate(timeDelta);
        self.onDraw(timeDelta, {
          frameCurrent: frameNumber,
          frameMax: this.viewport.Config.fps!,
        });
        lastFrameElapse = timeCursor;
        frameNumber += 1;
        nextFrame = (1000 * frameNumber) / this.viewport.Config.fps!;
      }
      if (timeCursor > 1000) { // reset counters on 1 second mark
        timeCursor -= 1000;
        frameNumber = 1;
        lastFrameElapse -= 1000;
        nextFrame = (1000 * frameNumber) / this.viewport.Config.fps!;
      }
      previousTimestamp = currentTimestamp;
    }, 10);

  }

  // User action or events
  onMouseClick?(e: GameMouseEvent) { }
  onMouseDown?(e: GameMouseEvent) { }
  onMouseUp?(e: GameMouseEvent) { }
}
