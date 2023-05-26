'use client';

import React, { RefObject } from 'react';
import GameElement from './GameElement';
import { GameFontConfig } from './GameFontManager';

export interface DrawPositions {
  x: number,
  y: number,
}

export interface ViewPortConfig {
  showCollisions?: boolean,
  showPerfStats?: boolean,
  fps: number,
  width: number,
  height: number,
  bgColor?: string | CanvasGradient | CanvasPattern
}

export default class GameViewport {
  // private pens: {};
  private config: ViewPortConfig;
  private canvasRef: RefObject<HTMLCanvasElement> | null;
  private _canvas2DCtx: CanvasRenderingContext2D | null;

  constructor(config: ViewPortConfig) {
    // this.pens = {
    //   default: '10px Arial',
    // }
    this.config = config;
    this.canvasRef = null;
    this._canvas2DCtx = null;
  }

  get Config() {
    return this.config;
  }

  setCanvas2DContext(canvas2DCtx: CanvasRenderingContext2D) {
    this._canvas2DCtx = canvas2DCtx;
  }

  set CanvasRef(value: RefObject<HTMLCanvasElement> | null) {
    this.canvasRef = value;
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
      this.Canvas2DContext.clearRect(0, 0, this.config.width, this.config.height);
      this.Canvas2DContext.fillStyle = this.Config.bgColor || "blue";
      this.Canvas2DContext.fillRect(0, 0, this.config.width, this.config.height);
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
      pos = pos || {
        x: element.Config.pos.x,
        y: element.Config.pos.y,
      };
      let image = element.ImageSource
      if (image) {
        this.Canvas2DContext.drawImage(image, pos.x, pos.y);
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