█████ █████  
▄▄▄██ ██▄▄▄  
▀▀▀██ ██▀▀▀  
█████ █████  
DEVELOPMENT  

# Game Reactor
The Game Reactor is a Game Development SDK that is used to create small sized games that run on a web browser. It utilizes ReactJS and organizes game development by abstracting developers from the inner complexities of managing assets and web component UI behaviours from them.

## Features
* Game Loop - The product handles the game loop once it is loaded and ready. On each gameloop iteration, an update and draw function call is made towards all registered Game Elements
* FPS - This app allows users to set the Frames Per Second at which it will trigger in the Game Loop. By default this is 30 but can be set higher or lower depending on the development requirement
* Image/Sprite management - This SDK allows for easy referencing of images available in the web.
* Sound/Audio management - Thsi SDK also allows easy management of sounds that need to be included in the game.

## Installation
The latest built library can be found in https://www.npmjs.com/package/game-reactor
```javascript
npm i game-reactor
```

## HelloWorld
Here is a simple Hello World. Just create a new React Component that inherits from the Game component and it will generate the canvas for you.
```javascript
import { Game } from 'game-reactor';

let self;

export default class HelloGameReactor extends Game {
  constructor() {
    super({
      name: 'hellogame',
      viewport: {
        fps: 30,
        width: 360,
        height: 270,
      },
    }, {});
    self = this;
  }

  gameDraw(lapse) {
    self.viewport.drawText('Hello World', {x: 10, y: 10 });
  }
}
``` 
