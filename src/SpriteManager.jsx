import React, {Component} from 'react';

export default class SpriteManager extends Component{
  constructor(game) {
    super();
    this.game = game;
    this.sprites = {};
  }

  add(id, path) {
    if (this.sprites[id]) {
      throw new Error(`Sprite ${id} has already been set`);
    }
    this.sprites[id] = {
      path,
      ref: React.createRef(),
    };
  }

  get(id) {
    if (!this.sprites[id]) {
      throw new Error(`Sprite '${id}' does not exist.`);
    }
    return this.sprites[id].ref.current;
  }

  render() {
    const images = [];
    const entries = Object.entries(this.sprites);
    for (const [id, config] of entries) {
      images.push(<img ref={config.ref} src={config.path} hidden={true} />);
    }
    return (
      <div id={`BRAND_ID${'_SPRITES'}`}>
        { images }
      </div>
    );
  }
}