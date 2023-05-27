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
  private _elements: GameElementManager;
  private _config: GameConfig;
  private _fonts: GameFontManager;
  private _logger: GameLog;
  private _sounds: SoundMixer;
  private _sprites: SpriteManager;
  private _state: { [key: string]: any };
  private _viewport: GameViewport;
  instanceID: number;

  constructor(config: GameConfig = DEFAULT_CONFIG, state: { [key: string]: any } = {}) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this.instanceID = Math.round(Math.random() * 1000)
    this._logger = new GameLog(this.instanceID.toString(), this._config.logLevel ?? GameLogLevels.info);
    this._logger.info('Initializing game instance...');
    this._state = state;
    this._viewport = new GameViewport(this._logger, config.viewport);
    this._elements = new GameElementManager(this._logger);
    this._fonts = new GameFontManager(this._logger);
    this._sounds = new SoundMixer(this._logger);
    this._sprites = new SpriteManager(this._logger);
    self = this;
  }

  abstract onReady(): void;
  abstract onDisengaged(): void;

  onComponentMounted() {
    self._logger.info('Game component mounted!')
    if (gameLoopInterval !== null) {
      clearInterval(gameLoopInterval);
    }

    this.onReady();
    this.startGameLoop();
  }

  onComponentUnmount() {
    this._logger.info('Game component unmounted!')
    if (gameLoopInterval) { // kill old interval
      clearInterval(gameLoopInterval);
    }
    this._sounds.stopAll();
    this.onDisengaged();
  }

  get ShowCollisions() { return this._viewport.Config.showCollisions; }

  get Config() { return this._config; }

  get Elements() { return self._elements; }

  get Fonts() { return self._fonts; }

  get Logger() { return self._logger; }

  get Sounds() { return this._sounds }

  get Sprites() { return this._sprites }

  get State() { return self._state; }

  get Viewport() { return self._viewport; }

  abstract onDraw(timeDelta: number, sysPerf: SystemPerformance): void;
  abstract onUpdate(timeDelta: number): void;

  /** This starts the game loop */
  private startGameLoop() {
    let frameNumber = 1;
    let nextFrame = (1000 / this._viewport.Config.fps!) * frameNumber;
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
          frameMax: this._viewport.Config.fps!,
        });
        lastFrameElapse = timeCursor;
        frameNumber += 1;
        nextFrame = (1000 * frameNumber) / this._viewport.Config.fps!;
      }
      if (timeCursor > 1000) { // reset counters on 1 second mark
        timeCursor -= 1000;
        frameNumber = 1;
        lastFrameElapse -= 1000;
        nextFrame = (1000 * frameNumber) / this._viewport.Config.fps!;
      }
      previousTimestamp = currentTimestamp;
    }, 10);

  }

  // User action or events
  onMouseClick?(e: GameMouseEvent) { }
  onMouseDown?(e: GameMouseEvent) { }
  onMouseUp?(e: GameMouseEvent) { }
}
