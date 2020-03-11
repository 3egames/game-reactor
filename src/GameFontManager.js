let fonts;

export default class GameFontManager {
  constructor(game) {
    this.game = game;
    fonts = {}; // make sure to clear always
    this.add('default', {
      family: 'Arial',
      size: '10px',
      color: 'black',
    });
  }

  add(id, config) {
    if (fonts[id]) {
      throw new Error(`Font '${id}' already set`);
    }
    const DEFAULT_CONFIG = {
      family: 'Arial',
      size: '10px',
      color: 'black',
      style: 'normal',
      variant: 'normal',
      weight: 'normal',

    };
    fonts[id] = { ...DEFAULT_CONFIG, ...config };
  }

  get(id){
    if (!fonts[id]) {
      throw new Error(`Font '${id}' not set`);
    }
    return fonts[id];
  }
}