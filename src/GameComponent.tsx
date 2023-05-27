import React, { FC, useEffect, useRef } from 'react'
import { Game, GameMouseButtons, GameMouseEvent } from './Game'

export interface GameComponentProps {
  id: string, game: Game, className?: string
}

export const GameComponent: FC<GameComponentProps> = ({ id, game, className }) => {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    game.onComponentMounted();
    linkCanvasRefs(game);
    return () => {
      if (game.onComponentUnmount) game.onComponentUnmount();
    }
  }, []);

  /** Retrieves the reference to the 2d context of the canvas */
  function linkCanvasRefs(game: Game) {
    if (!canvasRef) {
      throw new Error('Reference to canvas is lost!')
    }
    game.Logger.debug(`connecting to canvas`)
    game.Viewport.CanvasRef = canvasRef
  }

  function generateCanvsMouseEvent(e: React.MouseEvent): GameMouseEvent {
    let button = GameMouseButtons.unknown;
    if (e.button === 0 || e.buttons === 1) {
      button = GameMouseButtons.left;
    } else if (e.button === 2 || e.buttons === 2) {
      button = GameMouseButtons.right;
    } else if (e.button === 1 || e.buttons === 4) {
      button = GameMouseButtons.middle;
    } else if (e.button === 3 || e.buttons === 8) {
      button = GameMouseButtons.back;
    } else if (e.button === 4 || e.buttons === 16) {
      button = GameMouseButtons.forward;
    }
    return {
      button,
      withCtrlKey: e.ctrlKey,
      withAltKey: e.altKey,
      withMetaKey: e.metaKey,
      withShiftKey: e.shiftKey,
      x: Math.ceil(e.clientX - game.Viewport.PagePosition.left),
      y: Math.ceil(e.clientY - game.Viewport.PagePosition.top),
    };
  }

  function handleCanvasClicked(e: React.MouseEvent) {
    e.preventDefault();
    if (game.onMouseClick) {
      game.onMouseClick(generateCanvsMouseEvent(e));
    }
  }

  function handleCanvasContextMenu(e: React.MouseEvent) {
    // this is to rid of that windows context menu appearing when we click the right mouse button.
    return e.preventDefault();
  }

  function handleCanvasDoubleClicked(e: React.MouseEvent) {
    // this is to rid of that apple double tap zoom
    return e.preventDefault();
  }

  function handleCanvasFocusLost() {
    game.State.isPlaying = false;
  }

  function handleCanvasMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    if (game.onMouseDown) {
      game.onMouseDown(generateCanvsMouseEvent(e));
    }
  }

  function handleCanvasMouseUp(e: React.MouseEvent) {
    e.preventDefault();
    if (game.onMouseUp) {
      game.onMouseUp(generateCanvsMouseEvent(e));
    }
  }

  return <>
    <canvas
      className={className}
      id={id}
      ref={canvasRef}
      height={game.Viewport.Config.height}
      width={game.Viewport.Config.width}
      onBlur={handleCanvasFocusLost}
      onClick={handleCanvasClicked}
      onContextMenu={handleCanvasContextMenu}
      onDoubleClick={handleCanvasDoubleClicked}
      onMouseDown={handleCanvasMouseDown}
      onMouseUp={handleCanvasMouseUp}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      Canvas not supported by browser
    </canvas>
    {game.Sprites.render()}
  </>
}
