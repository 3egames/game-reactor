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

  onUpdate(game: Game, timeDelta: number) {
    if (this.yDirDown) {
      this.Config.pos!.y! += (this.State.speed * timeDelta);
      if (this.Config.pos!.y! + 50 > game.viewport.Config.height!) this.yDirDown = false;
    } else {
      this.Config.pos!.y -= (this.State.speed * timeDelta);
      if (this.Config.pos!.y < 0) this.yDirDown = true;
    }
    if (this.xDirRight) {
      this.Config.pos!.x += (this.State.speed * timeDelta);
      if (this.Config.pos!.x + 50 > game.viewport.Config.width!) this.xDirRight = false;
    } else {
      this.Config.pos!.x -= (this.State.speed * timeDelta);
      if (this.Config.pos!.x < 0) this.xDirRight = true;
    }
  }

  onDraw(game: Game, timeDelta: number) {
    game.viewport.clear()
    game.viewport.drawElement(this);
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
    this.sounds.addSource('blast', 'https://soundbible.com/mp3/Laser_Cannon-Mike_Koenig-797224747.mp3');
    this.sprites.addSource('avatar', 'https://pixeljoint.com/files/icons/ladyhazy.gif');
  }

  onReady() {
    this.elements.add(new Avatar(this));
  }

  onDisengaged() {

  }

  onDraw(timeDelta: number, sysPerf: any) {
    this.elements.redraw(this, timeDelta)
    if (this.viewport.Config.showPerfStats) {
      const font = this.fonts.get('default')
      this.viewport.drawText("Game Reactor by: Adonis Lee Villamor", { x: 10, y: 240 }, font);
      this.viewport.drawText(`Frame: ${sysPerf}/${this.viewport.Config.fps}`, { x: 260, y: 240 }, font);
    }
  }

  onUpdate(timeDelta: number) {
    this.elements.update(this, timeDelta);
  }

  onMouseDown(e: GameMouseEvent) {
    this.sounds.play('blast');
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
