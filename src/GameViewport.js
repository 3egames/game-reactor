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
      self.canvasRefCtx = self.canvasRef.current.getContext('2d');
    }
    if (!self.canvasRefCtx) throw new Error('Canvas context being accessed but is not available.');
    return self.canvasRefCtx;
  }

  get PagePosition() {
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

  drawElement(element, override) {
    if (self.CanvasRefCtx) {
      const o = override || {
        pos: {
          x: element.XPos,
          y: element.YPos,
        },
      };
      self.CanvasRefCtx.drawImage(element.Sprite, o.pos.x, o.pos.y);
      if (self.game.ShowCollisions) {
        if (element.HasCollisions && element.Collisions.Active) {
          self.CanvasRefCtx.beginPath();
          let bx;
          for (let i = 0; i < element.Collisions.Boxes.length; i += 1) {
            bx = element.Collisions.Boxes[i];
            self.CanvasRefCtx.strokeStyle = bx.Color;
            self.CanvasRefCtx.rect(bx.XPos, bx.YPos, bx.Width, bx.Height);
          }
          self.CanvasRefCtx.stroke();
        }
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
