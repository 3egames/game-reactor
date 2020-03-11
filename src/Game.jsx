import React, { Component } from 'react';
import Viewport from './GameViewport';
import SpriteManager from './SpriteManager.jsx';
import GameElementManager from './GameElementManager';
import GameFontManager from './GameFontManager';
import SoundMixer from './SoundMixer';

const BRAND_ID = 'ALV-GAME-REACTOR';
let self;
let sprites;
let sounds;
let gameLoopInterval;

function generateCanvsMouseEvent(e) {
  let button = 'none';
  if (e.button === 0 || e.buttons === 1) {
    button = 'left';
  } else if (e.button === 2 || e.buttons === 2) {
    button = 'right';
  } else if (e.button === 1 || e.buttons === 4) {
    button = 'middle';
  } else if (e.button === 3 || e.buttons === 8) {
    button = 'browser_back';
  } else if (e.button === 4 || e.buttons === 16) {
    button = 'browser_forward';
  }
  return {
    button,
    withCtrlKey: e.ctrlKey,
    withAltKey: e.altKey,
    withMetaKey: e.metaKey,
    withShiftKey: e.shiftKey,
    x: Math.ceil(e.clientX - self.viewport.PagePosition.left),
    y: Math.ceil(e.clientY - self.viewport.PagePosition.top),
  };
}

function canvasClicked(e) {e.preventDefault();
  if (self.onMouseClick) {
    if (typeof self.onMouseClick !== 'function') {
      throw new Error('Game.onMouseClick method is not a valid function');
    }
    self.onMouseClick(generateCanvsMouseEvent(e));
  }
}

function canvasMouseDown(e) {
  e.preventDefault();
  if (self.onMouseDown) {
    if (typeof self.onMouseDown !== 'function') {
      throw new Error('Game.onMouseDown method is not a valid function');
    }
    self.onMouseDown(generateCanvsMouseEvent(e));
  }
}

function canvasMouseUp(e) {
  e.preventDefault();
  if (self.onMouseUp) {
    if (typeof self.onMouseUp !== 'function') {
      throw new Error('Game.onMouseUp method is not a valid function');
    }
    self.onMouseUp(generateCanvsMouseEvent(e));
  }
}

function canvasContextMenu(e) {
  // this is to rid of that windows context menu appearing when we click the right mouse button.
  return e.preventDefault();
}

function canvasFocusLost() {
  self.isPlaying = false;
}

function canvasDoubleClicked(e) {
  // this is to rid of that apple double tap zoom
  return e.preventDefault();
}

export default class Game extends Component {
  constructor(config, state) {
    super();
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
    self = this;
    self.config = { ...DEFAULT_CONFIG, ...config };
    self.state = state;
    self.viewport = new Viewport(self);
    self.elements = new GameElementManager(self);
    self.fonts = new GameFontManager(self);
    sounds = new SoundMixer(self);
    sprites = new SpriteManager(self);
  }

  componentDidMount() {
    if (gameLoopInterval !== null) {
      clearInterval(gameLoopInterval);
    }

    if (self.onReady && typeof self.onReady === 'function') {
      self.onReady();
    }
    self.forceUpdate();
    self.startGameLoop();
  }

  componentWillUnmount() {
    if (gameLoopInterval) { // kill old interval
      clearInterval(gameLoopInterval);
    }

    if (self.onDisengaged && typeof self.onDisengaged === 'function') {
      self.onDisengaged();
    }
  }

  get ShowCollisions() { return this.config.viewport.showCollisions; }

  get Name() {
    return this.config.name;
  }

  get State() {
    return self.state;
  }

  get Sprites() {
    return sprites;
  }

  get Sounds() {
    return sounds;
  }

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
        if (self.gameUpdate) { self.gameUpdate(lapse); }
        if (self.gameDraw) { self.gameDraw(lapse, { frameNumber }); }
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

  render() {
    return (
      <div>
        <canvas
          id={`${BRAND_ID}_viewport`}
          ref={self.viewport.CanvasRef}
          height={self.config.viewport.height}
          width={self.config.viewport.width}
          onContextMenu={canvasContextMenu}
          onMouseDown={canvasMouseDown}
          onMouseUp={canvasMouseUp}
          onClick={canvasClicked}
          onBlur={canvasFocusLost}
          onDoubleClick={canvasDoubleClicked}
        >
          Canvas not supported by browser
        </canvas>
        {self.Sprites.render()}
      </div>
    );
  }
}
