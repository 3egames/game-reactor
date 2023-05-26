import React from 'react'
import { Meta, StoryObj } from "@storybook/react";
import GameComponent from './GameComponent'
import Game, { GameMouseEvent } from './Game';
import GameElement from './GameElement';
import { GameLogLevels } from './GameLog';

class Avatar extends GameElement {
  xDirRight: boolean
  yDirDown: boolean

  constructor(game: Game) {
    super(game, {
      name: 'my-avatar',
      sprite: 'avatar',
      state: {},
      pos: {
        x: 20,
        y: 20,
      },
    });

    this.xDirRight = true;
    this.yDirDown = true;
  }

  onUpdate(game: Game, lapse: number) {
    if (this.yDirDown) {
      this.Config.pos.y += 5
      if (this.Config.pos.y + 50 > game.viewport.Config.height) this.yDirDown = false;
    } else {
      this.Config.pos.y -= 5
      if (this.Config.pos.y < 0) this.yDirDown = true;
    }
    if (this.xDirRight) {
      this.Config.pos.x += 5
      if (this.Config.pos.x + 50 > game.viewport.Config.width) this.xDirRight = false;
    } else {
      this.Config.pos.x -= 5
      if (this.Config.pos.x < 0) this.xDirRight = true;
    }
  }

  onDraw(game: Game, lapse: number) {
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
        fps: 30,
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
    this.startGameLoop()
  }

  onDisengaged() {

  }

  onDraw(lapse: number, sysPerf: any) {
    this.elements.redraw(this, lapse)
    if (this.config.viewport.showPerfStats) {
      const font = this.fonts.get('default')
      this.viewport.drawText("Game Reactor by: Adonis Lee Villamor", { x: 10, y: 240 }, font);
      this.viewport.drawText(`Frame: ${sysPerf.frameNumber}/${this.config.viewport.fps}`, { x: 260, y: 240 }, font);
    }
  }

  onUpdate(lapse: number) {
    this.elements.update(this, lapse);
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
  <GameComponent className='border-solid' data-testId="InputField-id" {...args} />
);
Primary.args = {
  id: "primarytest",
  game: dg
};
