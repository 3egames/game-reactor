import React from 'react'
import { Meta, StoryObj } from "@storybook/react";
import { GameComponent } from './GameComponent'
import { Game, GameMouseEvent } from './Game';
import { GameElement } from './GameElement';
import { GameLogLevels } from './GameLog';

class Avatar extends GameElement {
  xDirRight: boolean
  yDirDown: boolean

  constructor(game: Game) {
    super(game, {
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

  onUpdate(timeDelta: number) {
    if (this.yDirDown) {
      this.Config.pos!.y! += (this.State.speed * timeDelta);
      if (this.Config.pos!.y! + 50 > this.Game.Viewport.Config.height!) this.yDirDown = false;
    } else {
      this.Config.pos!.y -= (this.State.speed * timeDelta);
      if (this.Config.pos!.y < 0) this.yDirDown = true;
    }
    if (this.xDirRight) {
      this.Config.pos!.x += (this.State.speed * timeDelta);
      if (this.Config.pos!.x + 50 > this.Game.Viewport.Config.width!) this.xDirRight = false;
    } else {
      this.Config.pos!.x -= (this.State.speed * timeDelta);
      if (this.Config.pos!.x < 0) this.xDirRight = true;
    }
  }

  onDraw(timeDelta: number) {
    this.Game.Viewport.clear()
    this.Game.Viewport.drawElement(this);
  }

  playSound() {
  }
}

let avatar: Avatar;
class DemoGame extends Game {
  constructor() {
    super({
      name: 'hellogame',
      logLevel: GameLogLevels.debug,
      viewport: {
        //showCollisions: true,
        showPerfStats: true,
        fps: 12,
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

  onDraw(timeDelta: number, sysPerf: any) {
    this.Elements.redraw(this, timeDelta)
    if (this.Viewport.Config.showPerfStats) {
      const font = this.Fonts.get('default')
      this.Viewport.drawText("Game Reactor by: Adonis Lee Villamor", { x: 10, y: 240 }, font);
      this.Viewport.drawText(`Frame: ${sysPerf}/${this.Viewport.Config.fps}`, { x: 260, y: 240 }, font);
    }
  }

  onUpdate(timeDelta: number) {
    this.Elements.update(this, timeDelta);
  }

  onMouseDown(e: GameMouseEvent) {
    this.Sounds.play('blast');
  }
}

const dg = new DemoGame();


/** STORYBOOK */

const meta: Meta<typeof GameComponent> = {
  component: GameComponent,
  title: "GameReactor component",
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof GameComponent>;

export const Primary: Story = (args) => (
  <div style={{ width: '400px', height: '300px' }}>
    <GameComponent className='border-solid' data-testId="InputField-id" {...args} />
  </div>
);
Primary.args = {
  id: "primarytest",
  game: dg
};
