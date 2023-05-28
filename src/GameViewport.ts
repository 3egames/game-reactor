import React, { RefObject } from 'react';
import { GameElement } from './GameElement';
import { GameFontConfig } from './GameFontManager';
import { GameLog } from './GameLog';
import { SpriteManager } from './SpriteManager';

export interface DrawPositions {
  x: number,
  y: number,
}

export interface ViewPortConfig {
  showCollisions?: boolean,
  showPerfStats?: boolean,
  fps?: number,
  width?: number,
  height?: number,
  bgColor?: string | CanvasGradient | CanvasPattern
}

const DEFAULT_CONFIG = {
  showCollisions: false,
  showPerfStats: false,
  fps: 24,
  width: 360,
  height: 270,
};

export class GameViewport {
  // private pens: {};
  private _config: ViewPortConfig;
  public canvasRef: RefObject<HTMLCanvasElement> | null;
  private _canvas2DCtx: CanvasRenderingContext2D | null;
  private _logger: GameLog;
  private _id: number;
  private _sprites: SpriteManager;

  constructor(sprites: SpriteManager, logger: GameLog, config: ViewPortConfig = DEFAULT_CONFIG) {
    // this.pens = {
    //   default: '10px Arial',
    // }
    this._id = Math.round(Math.random() * 1000);
    this._config = { ...DEFAULT_CONFIG, ...config };
    this.canvasRef = null;
    this._canvas2DCtx = null;
    this._logger = logger;
    this._logger.debug(`GameViewport id#${this._id} created`);
    this._sprites = sprites;
  }

  get Config() {
    return this._config;
  }

  set CanvasRef(value: RefObject<HTMLCanvasElement> | null) {
    this.canvasRef = value;
    this._logger.debug(`Reference for GameViewport id#${this._id} to canvas set to '${value}'`);
    console.log(value)
  }

  get Canvas2DContext() {
    if (this.canvasRef && this.canvasRef.current instanceof HTMLCanvasElement) {
      this._canvas2DCtx = this.canvasRef.current.getContext('2d');
    }
    if (!this._canvas2DCtx) throw new Error('Canvas context being accessed but is not available.');
    return this._canvas2DCtx;
  }

  clear() {
    if (this.Canvas2DContext) {
      this.Canvas2DContext.clearRect(0, 0, this.Config.width || 0, this.Config.height || 0);
      this.Canvas2DContext.fillStyle = this.Config.bgColor || "blue";
      this.Canvas2DContext.fillRect(0, 0, this.Config.width || 0, this.Config.height || 0);
    }
  }

  get PagePosition() {
    const rect = this.canvasRef?.current?.getBoundingClientRect();
    return {
      left: rect?.left || 0,
      top: rect?.top || 0,
    };
  }

  drawElement(element: GameElement, pos?: DrawPositions) {
    if (this.Canvas2DContext) {
      pos = pos ?? {
        x: element.Config.pos!.x,
        y: element.Config.pos!.y,
      };
      if (element.Config.sprite) {
        let image = this._sprites.getSource(element.Config.sprite)
        if (image) {
          this.Canvas2DContext.drawImage(image, pos.x, pos.y);
        }
      }
      // if (self.game.ShowCollisions) {
      //   if (element.Config.collisions?.Active) {
      //     self.Canvas2DContext.beginPath();
      //     let bx;
      //     for (let i = 0; i < element.Config.collisions.Boxes.length; i += 1) {
      //       bx = element.Config.collisions.Boxes[i];
      //       self.Canvas2DContext.strokeStyle = bx.Color;
      //       self.Canvas2DContext.rect(bx.XPos, bx.YPos, bx.Width, bx.Height);
      //     }
      //     self.Canvas2DContext.stroke();
      //   }
      // }
    }
  }

  drawText(text: string, pos: DrawPositions, font: GameFontConfig) {
    if (this.Canvas2DContext) {
      //clean previous font changes
      this.Canvas2DContext.font = 'Arial';
      this.Canvas2DContext.fillStyle = 'black';
      this.Canvas2DContext.strokeStyle = '';
      pos = pos || { x: 0, y: 0, };

      const size = font.size || '10px';
      const family = font.family || 'Arial';
      const color = font.color || '#000';
      this.Canvas2DContext.font = `${size} ${family}`;
      this.Canvas2DContext.fillStyle = color;
      this.Canvas2DContext.fillText(text, pos.x, pos.y);
      this.Canvas2DContext.textBaseline = 'top';
      if (font.stroke_width) {
        this.Canvas2DContext.strokeStyle = font.stroke_color || '#fff';
        this.Canvas2DContext.lineWidth = font.stroke_width;
        this.Canvas2DContext.strokeText(text, pos.x, pos.y);
      }
    }
  }
}
