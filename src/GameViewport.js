import React  from 'react';
let self;

export default class GameViewport {
  constructor(game) {
    self = this;
    self.pens = {
      default: '10px Arial',
    }
    self.game = game;
    self.config = game.config.viewport;
    self.canvasRef = React.createRef();
  }

  get CanvasRef() {
    return self.canvasRef;
  }

  get CanvasRefCtx() {
    if (!self.canvasRefCtx && self.canvasRef.current) {
      self.canvasRefCtx = self.canvasRef.current.getContext('2d')
    }
    if (!self.canvasRefCtx) throw new Error('Canvas context being accessed but is not available.');
    return self.canvasRefCtx;
  }

  get pagePosition() {
    const rect = self.canvasRef.current.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
    };
  }

  clear() {
    if (self.canvasRefCtx) {
      self.canvasRefCtx.clearRect(0, 0, self.canvasRef.width, self.canvasRef.height);
    }
  }

  drawElement(element, config) {
    if (self.CanvasRefCtx) {
      const DEFAULT_CONFIG = {
        pos: { x: 0, y: 0 },
      };
      const c = { ...DEFAULT_CONFIG, ...config };
      self.CanvasRefCtx.drawImage(element.sprite, c.pos.x, c.pos.y);
      if (element.state.size) {
        self.CanvasRefCtx.beginPath();
        self.CanvasRefCtx.strokeStyle = '#0f0';
        self.CanvasRefCtx.rect(c.pos.x, c.pos.y, element.state.size.width, element.state.size.height);
        self.CanvasRefCtx.stroke();
      }
    }
  }

  drawText(text, config, pen = 'default') {
    if (self.CanvasRefCtx) {
      const DEFAULT_CONFIG = {
        pos: { x: 0, y: 0 },
      };
      const c = { ...DEFAULT_CONFIG, ...config };
      self.CanvasRefCtx.font = self.pens[pen];
      self.CanvasRefCtx.fillText(text, c.x, c.y);
    }
  }

}
