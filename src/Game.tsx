import { GameViewport, ViewPortConfig } from './GameViewport';
import { SpriteManager } from './SpriteManager';
import { GameElementManager } from './GameElementManager';
import { GameFontManager } from './GameFontManager';
import { SoundMixer } from './SoundMixer';
import { GameLog, GameLogLevels } from './GameLog';

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

/** An abstract Game class */
export abstract class Game {
  private _elements: GameElementManager;
  private _config: GameConfig;
  private _fonts: GameFontManager;
  private _logger: GameLog;
  private _sounds: SoundMixer;
  private _sprites: SpriteManager;
  private _state: { [key: string]: any };
  private _viewport: GameViewport;
  private _isPaused: boolean;
  gameLoopInterval: ReturnType<typeof setTimeout> | null;
  instanceID: number;

  /**
   * Creates a new instance of the game
   * @param config - Game configurations
   * @param state - State object to be used in the entire game
   */
  constructor(config: GameConfig = DEFAULT_CONFIG, state: { [key: string]: any } = {}) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this.instanceID = Math.round(Math.random() * 1000)
    this._logger = new GameLog(this.instanceID.toString(), this._config.logLevel ?? GameLogLevels.info);
    this._logger.info('Initializing game instance...');
    this._state = state;
    this._sprites = new SpriteManager(this._logger);
    this._viewport = new GameViewport(this._sprites, this._logger, config.viewport);
    this._elements = new GameElementManager(this._logger);
    this._fonts = new GameFontManager(this._logger);
    this._sounds = new SoundMixer(this._logger);
    this._isPaused = true;
    this.gameLoopInterval = null;

    document.addEventListener("visibilitychange", () => {
      if (!this._isPaused && document.hidden) {
        this._isPaused = true;
        this.Logger.info('Game is paused as it is not in focus');
      }
    })
  }

  /** Event that fires when the GameComponent is mounted and game loop is about to start */
  abstract onReady(): void;

  /** Event that fires once the component unmounts. Use this to disconnect from services and dispose game resources */
  abstract onDisengaged(): void;

  /** Automatically called by the game component once it is mounted */
  start() {
    this._logger.info('Game is starting...')
    if (this.gameLoopInterval !== null) {
      clearInterval(this.gameLoopInterval);
    }
    this.onReady();
    this._isPaused = false;
    this.startGameLoop();
    this._logger.info('Game has started!')
  }

  /** Call this to pause or unpause the game */
  pause() {
    this._isPaused = !this._isPaused;
    this._logger.info(`Game is ${this._isPaused ? 'paused' : 'unpaused'}.`)
  }

  /** Terminate the game. Automatically called when component unmounts */
  terminate() {
    this._isPaused = true;
    this._logger.info('Game is terminating...')
    if (this.gameLoopInterval) { // kill old interval
      clearInterval(this.gameLoopInterval);
    }
    this._sounds.stopAll();
    this.onDisengaged();
    this._logger.info('Game is terminated!')
  }

  /** The Game configurations */
  get Config() { return this._config; }

  /** The Game Element Manager */
  get Elements() { return this._elements; }

  /** The GameFont manager */
  get Fonts() { return this._fonts; }

  /** The Game log utility */
  get Logger() { return this._logger; }

  /** The Sound manager */
  get Sounds() { return this._sounds }

  /** The Sprite manager */
  get Sprites() { return this._sprites }

  /** The Game States */
  get State() { return this._state; }

  get Viewport() { return this._viewport; }

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
    if (this.gameLoopInterval) { // kill any old interval
      clearInterval(this.gameLoopInterval);
    }
    this.gameLoopInterval = setInterval(() => {
      currentTimestamp = new Date().getTime();
      if (!this._isPaused) {
        timeCursor += currentTimestamp - previousTimestamp;
        if (timeCursor > nextFrame) {
          const timeDelta = (timeCursor - lastFrameElapse) / 1000;
          this.onUpdate(timeDelta);
          this.onDraw(timeDelta, {
            frameCurrent: frameNumber,
            frameMax: this._viewport.Config.fps!,
          });
          lastFrameElapse = timeCursor;
          frameNumber += 1;
          nextFrame = (1000 * frameNumber) / this._viewport.Config.fps!;
        }
        if (timeCursor > 1000) { // reset counters on 1 second mark
          frameNumber = 1;
          timeCursor %= 1000;
          lastFrameElapse %= 1000;
          nextFrame = (1000 * frameNumber) / this._viewport.Config.fps!;
        }
      }
      previousTimestamp = currentTimestamp;
    }, 10);

  }

  // User action or events
  onMouseClick?(e: GameMouseEvent) { }
  onMouseDown?(e: GameMouseEvent) { }
  onMouseUp?(e: GameMouseEvent) { }
}
