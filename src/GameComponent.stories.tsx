import { GameComponent } from './GameComponent'
import { Game, GameMouseEvent, SystemPerformance } from './Game';
import { GameElement } from './GameElement';
import { GameLogLevels } from './GameLog';
import React from 'react';

class Avatar extends GameElement {
  xDirRight: boolean
  yDirDown: boolean

  constructor(game: Game) {
    super(game.Logger, {
      name: 'my-avatar',
      sprite: 'avatar',
      pos: {
        x: 20,
        y: 20,
      },
    }, {
      speed: 240
    });

    this.xDirRight = true;
    this.yDirDown = true;
  }

  onUpdate(game: Game, timeDelta: number) {
    const yDelta = (this.State.speed * timeDelta);
    const xDelta = (this.State.speed * timeDelta);
    if (this.yDirDown) {
      this.Config.pos!.y! += yDelta;
      if (this.Config.pos!.y! + 50 >= game.Viewport.Config.height!) {
        this.Config.pos!.y! = 2 * (game.Viewport.Config.height! - 50) - this.Config.pos!.y!;
        this.yDirDown = false;
      }
    } else {
      this.Config.pos!.y -= yDelta;
      if (this.Config.pos!.y <= 0) {
        this.Config.pos!.y! = this.Config.pos!.y! * -1;
        this.yDirDown = true;
      }
    }
    if (this.xDirRight) {
      this.Config.pos!.x += xDelta;
      if (this.Config.pos!.x + 50 >= game.Viewport.Config.width!) {
        this.Config.pos!.x! = 2 * (game.Viewport.Config.width! - 50) - this.Config.pos!.x!;
        this.xDirRight = false;
      }
    } else {
      this.Config.pos!.x -= xDelta;
      if (this.Config.pos!.x <= 0) {
        this.Config.pos!.x! = this.Config.pos!.x! * -1;
        this.xDirRight = true;
      }
    }
  }

  onDraw(game: Game, timeDelta: number) {
    game.Viewport.clear()
    game.Viewport.drawElement(this);
  }

  playSound() {
  }
}

class DemoGame extends Game {
  constructor(fps: number) {
    super({
      name: 'hellogame',
      logLevel: GameLogLevels.debug,
      viewport: {
        //showCollisions: true,
        showPerfStats: true,
        fps: fps,
        width: 360,
        height: 270,
        bgColor: 'red',
      },
    }, {
      someFlag: true,
      clickCount: 0
    })
    this.Sounds.addSource('blast', 'https://soundbible.com/mp3/Laser_Cannon-Mike_Koenig-797224747.mp3');
    this.Sprites.addSource('avatar', 'https://pixeljoint.com/files/icons/ladyhazy.gif');
  }

  onReady() {
    this.Elements.add(new Avatar(this));
  }

  onDisengaged() {

  }

  onDraw(timeDelta: number, sysPerf: SystemPerformance) {
    this.Elements.redraw(this, timeDelta)
    if (this.Viewport.Config.showPerfStats) {
      const font = this.Fonts.get('default')
      this.Viewport.drawText("Game Reactor by: Adonis Lee Villamor", { x: 10, y: 240 }, font);
      this.Viewport.drawText(`Frame: ${sysPerf.frameCurrent}/${this.Viewport.Config.fps}`, { x: 260, y: 240 }, font);
    }
  }

  onUpdate(timeDelta: number) {
    this.Elements.update(this, timeDelta);
  }

  onMouseDown(e: GameMouseEvent) {
    this.Sounds.play('blast');
    this.pause()
  }
}

const dg12 = new DemoGame(12);
const dg24 = new DemoGame(24);
const dg30 = new DemoGame(30);
const dg60 = new DemoGame(60);


function DemoGameComponent({ id, game }) {
  return <div style={{ width: '300px' }}>
    <GameComponent id={id} game={game} />
  </div>
}

export default {
  component: DemoGameComponent,
  title: 'GameComponent',
  tags: ['autodocs'],
};

export const At12FPS = {
  args: {
    id: "12 FPS Game",
    game: dg12
  },
};

export const Default = {
  args: {
    id: "24 FPS Game",
    game: dg24
  },
};

export const At30FPS = {
  args: {
    id: "30 FPS Game",
    game: dg30
  },
};

export const At60FPS = {
  args: {
    id: "60 FPS Game",
    game: dg60
  },
};