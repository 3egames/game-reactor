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

let fonts: { [key: string]: GameFontConfig };

export default class GameFontManager {

  constructor() {
    fonts = {}; // make sure to clear always
    this.add('default');
  }

  add(id: string, config: GameFontConfig = {}) {
    if (fonts[id]) {
      throw new Error(`Font '${id}' already set`);
    }
    fonts[id] = { ...DEFAULT_CONFIG, ...config };
  }

  get(id: string) {
    if (!fonts[id]) {
      throw new Error(`Font '${id}' not set`);
    }
    return fonts[id];
  }
}
