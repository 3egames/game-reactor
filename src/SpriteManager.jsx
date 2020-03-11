import React, {Component} from 'react';
let sources;
let sprites;

export default class SpriteManager extends Component{
  constructor(game) {
    super();
    sources = {};
    sprites = {};
    this.game = game;
  }

  addSource(id, path) {
    if (sources[id]) {
      throw new Error(`Sprite source '${id}' has already been set`);
    }
    sources[id] = {
      path,
      ref: React.createRef(),
    };
  }

  getSource(id) {
    if (!sources[id]) {
      throw new Error(`Sprite source '${id}' does not exist.`);
    }
    return sources[id].ref.current;
  }

  addSprite(id, source, config) {
    if (sprites[id]) {
      throw new Error(`Sprite '${id}' has already been set`);
    } else if (!sources[source]) {
      throw new Error(`Sprite source '${source}' does not exist`);
    }
    const DEFAULT_CONFIG = {
      source,
      spriteCoordinates: {
        x: 0,
        y: 0,
        width: 20,
        height: 20,
      },
      renderOffset: {
        x: 0,
        y: 0,
      },
      scale: 1,
    };

    sprites[id] = { ...DEFAULT_CONFIG, ...config };
  }

  getSprite(id) {
    if (!sprites[id]) {
      throw new Error(`Sprite '${id}' does not exist.`);
    }
    return sprites[id];
  }

  render() {
    const images = [];
    const entries = Object.entries(sources);
    for (const [id, config] of entries) {
      images.push(<img ref={config.ref} key={ `game-reactor_${config.path}`} src={config.path} hidden={true} />);
    }
    return (
      <div id={`BRAND_ID${'_SPRITES'}`}>
        { images }
      </div>
    );
  }
}