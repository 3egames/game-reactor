import { GameLog } from "./GameLog";

export interface GameFontConfig {
  family?: string,
  size?: string,
  color?: string,
  style?: string,
  variant?: string,
  weight?: string,
  stroke_width?: number,
  stroke_color?: string,
}

const DEFAULT_CONFIG = {
  family: 'Arial',
  size: '10px',
  color: 'black',
  style: 'normal',
  variant: 'normal',
  weight: 'normal',
};


export class GameFontManager {
  private _logger: GameLog;
  private _fonts: { [key: string]: GameFontConfig };

  constructor(logger: GameLog) {
    this._logger = logger;
    this._fonts = {}; // make sure to clear always
    this.add('default');
  }

  add(id: string, config: GameFontConfig = {}) {
    if (this._fonts[id]) {
      throw new Error(`Font '${id}' already set`);
    }
    this._fonts[id] = { ...DEFAULT_CONFIG, ...config };
    this._logger.debug(`Added font '${id}'`)
  }

  get(id: string) {
    if (!this._fonts[id]) {
      throw new Error(`Font '${id}' not set`);
    }
    return this._fonts[id];
  }
}
