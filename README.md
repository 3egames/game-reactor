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
```
npm i game-reactor
```

## Storybook
Use storybook to preview the GameComponent in action.
```
npm run storybook
```

---

# How to use

## Abstract Game class

To start creating your own web game, create a new class that extends the Game class like so.

``` typescript
import { Game, GameLogLevels } from 'game-reactor/dist';

class DemoGame extends Game {
  constructor() {
    super({
      name: 'My demo game',
      logLevel: GameLogLevels.debug,
      viewport: {
        showCollisions: false,
        showPerfStats: false,
        fps: 24,
        width: 360,
        height: 270,
        bgColor: 'red',
      },
    }, {
      someFlag: true,
      clickCount: 0
    })
  }

  onReady() { }

  onDisengaged() { }

  onUpdate(timeDelta: number) {
    this.elements.update(this, timeDelta);
  }

  onDraw(timeDelta: number, sysPerf: any) {
    this.viewport.clear();
    this.elements.redraw(this, timeDelta)
  }

}

```

The abstract Game class provides the basis for creating a new Game object. You need to provide it with some initial information about your game thru the main constructor.

* The first value is the GameConfig
  * name - Any generic name you want to call your game
  * logLevel(info) - Controls the logs that get thrown in the user's browser console (developer mode)
    * warn - warnings to errors will be shown in the console
    * info - same as above but with additional informations on what is happening (default)
    * debug - same as above but now debuging information are also shows (use this for local debuging)
  * viewport - The viewport "canvas" configuration
    * showCollisions(false) - a flag to indicate you want to see collision boxes
    * showPerfStats(false) - a flag to indicate you want to see game preformance stats like FPS
    * fps(24) - the number of Frames per second we want the game to run in
    * width(360) - the viewport width
    * height(270) - the viewport height
    * bgColor('blue') - the base background color of the viewport
* The second argument are game state variables you need to track. Basically an object of key value pairs

You must also implement the 4 main methods
* onReady - called when the Game is loaded and ready to play
* onDisengaged - called when Game is unloading or disposing
* onUpdate - called when the game needs to compute any game updates for the next frame. In the sample above, we called all the GameElements to update their state
  * timeDelta - timeDelta is a multiplier based on the time difference between the current and previous frame. This is affected by the number of frames per second
* onDraw - called when the game needs to draw the next frame. In the sample snippet above, we stated that on every frame render *(Draw)* event, we sould like to clear the canvas back to a clean slate and start rendering our game elements. (We do not have a game element for now and we will tackle that later)
  * * timeDelta - timeDelta is a multiplier based on the time difference between the current and previous frame. This is affected by the number of frames per second
  * sysPerf - system performance data

## React GameComponent
The react GameComponent provides the HTMLCanvasElement that the Game instance will utilize. In your tsx file, you cn utilize it like so

``` tsx
import { GameComponent } from 'game-reactor/dist';

export default function MyGamePage() {
  const dg = new DemoGame();
  return (
    <div>
      <h1>My game using Game-Reactor</h1>
      <GameComponent id="demoGame" game={dg} />
    </div>
  )
}
```

The Gamecomponent props are as follows
* id - Any unique ID you want to give your canvas element
* game - the reference to a Game object instance
* className - typical react className attribute that gets applied to the canvas

## GameElement
A GameElement is an object within the Game world. Be it a playable character, NPC, house, chest, whatever you can think of.

``` typescript
class MyGameElement extends GameElement {

  constructor(game: Game) {
    super(game, {
      name: 'my-element',
      sprite: 'my-elemnt-sprite',
      pos: {
        x: 20,
        y: 20,
      },
    },{
      someState: 1
    });
  }

  onUpdate(game: Game, timeDelta: number) {
    //do nothing for now...
  }

  onDraw(game: Game, timeDelta: number) {
    game.viewport.drawElement(this);
  }
}
```
Your GameElements must extend the GameElement class and define itself in the base constructor.
* game - The game instance
* config - the GameElementConfig
  * name - The unique identifier for the GameElement
  * sprite - The id of the sprite associated to the GameElement
  * pos (0, 0) - the starting position of the element's x and y axis
* state ({}) - state object

The GameElement also has 2 abstract methods you must implement.
* onUpdate - If the GameElement is registered, this is called each time `Game.elements.update()` is triggered (mostly in the Game's onUpdate method).
  * game - The game object instance
  * timeDelta - timeDelta is a multiplier based on the time difference between the current and previous frame. This is affected by the number of frames per second
* onDraw - - If the GameElement is registered, this is called each time `Game.elements.redraw()` is triggered (mostly in the Game's onDraw method).
  * game - The game object instance
  * timeDelta - timeDelta is a multiplier based on the time difference between the current and previous frame. This is affected by the number of frames per second

---

# Sample Game

Here is a simple Hello World based on the details above. Create a react component that uses our gameComponent and Game class like so. Note: Right now it will do nothing sensible.

``` typescript
import { Game, GameComponent } from 'game-reactor/dist';

class DemoGame extends Game {
  constructor() {
    super({
      name: 'My demo game'
    }, {
      someFlag: true,
      clickCount: 0
    })
  }

  onReady() { }

  onDisengaged() { }

  onUpdate(timeDelta: number) {
    this.elements.update(this, timeDelta);
  }

  onDraw(timeDelta: number, sysPerf: any) {
    this.viewport.clear();
    this.elements.redraw(this, timeDelta)
  }

}

export default function MyGamePage() {
  const dg = new DemoGame();
  return (
    <div>
      <h1>My game using Game-Reactor</h1>
      <GameComponent id="demoGame" game={dg} />
    </div>
  )
}
``` 
This will run and provide you with the very first basic game. The blue screen of death! It does nothing but behind the scenes, redraws are being fired. try adding `console.log('ondraw')` inside the onDraw() method for example and check your browser's console. Try that for onUpdate as well.

Lets add our first GameElement
``` typescript
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
      speed: 10
    });

    this.xDirRight = true;
    this.yDirDown = true;
  }

  onUpdate(game: Game, timeDelta: number) { }

  onDraw(game: Game, timeDelta: number) {
    game.viewport.clear()
    game.viewport.drawElement(this);
  }
}
```

This will still do nothing as the GameElement is not registered to our Game. First lets add a sprite source in our project and generate a new instance of our GameElement. Inside the Game's constructor

``` typescript
 constructor() {
    super({
      name: 'My demo game'
    }, {
      someFlag: true,
      clickCount: 0
    })
    // add some stuffs like this sprite
    this.sprites.addSource('avatar', 'https://pixeljoint.com/files/icons/ladyhazy.gif');
    this.elements.add(new Avatar(this));
  }
```

Once you run it, you would seee the icon being rendered in position x20-y20 as expected. However it does nothing at all. Lets start adding updates to it. Lets make it move at 240 pixels per second. Since in the GameElement above, we said the speed will run at 10 on 24 frames that will make it move at 240 total in 24 seconds right?

inside the GameElement's onUpdate method, add the following
``` typescript
  onUpdate(game: Game, timeDelta: number) {
    if (this.yDirDown) {
      this.Config.pos!.y += this.State.speed;
      if (this.Config.pos!.y + 50 > game.viewport.Config.height!) this.yDirDown = false;
    } else {
      this.Config.pos!.y -= this.State.speed;
      if (this.Config.pos!.y < 0) this.yDirDown = true;
    }
    if (this.xDirRight) {
      this.Config.pos!.x += this.State.speed;
      if (this.Config.pos!.x + 50 > game.viewport.Config.width!) this.xDirRight = false;
    } else {
      this.Config.pos!.x -= this.State.speed;
      if (this.Config.pos!.x < 0) this.xDirRight = true;
    }
  }

```
You will now see the GameElement's sprite being re-rendered on each update in the new position causing it to appear to be bouncing around the canvas. Now here is something you will need to understand, right now the game is runing at the default fps of 24. meaning the speed of the update you might be seeing now is 24x the value of *speed* in our state (which is 10). since the height is 240, you can expect that the GameElement is colliding the canvas and changing direction exactly every 1 second. Try it with a stopwatch and you will see.

Now what if we cut our fps to lets say... 6 fps? change the Game's constructor to these
``` typescript
  constructor() {
    super({
      name: 'My demo game'
      viewport: {
        fps: 6
      }
    }, {
      someFlag: true,
      clickCount: 0
    })
  }
```

run it again and you will see that it updates more slowly at 6 updates per second. So why is it running as slow? that is because it is now updating at 60 pixel movement per second (10 movement every 6 frames). If our goal is that it consistently moves at 240 pixels per second no matter the framerate, how do we do that? That's where the timeDelta comes into play. Revise the code to the following

``` typescript
  onUpdate(game: Game, timeDelta: number) {
    if (this.yDirDown) {
      this.Config.pos!.y += (this.State.speed * timeDelta);
      if (this.Config.pos!.y + 50 > game.viewport.Config.height!) this.yDirDown = false;
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

```

 then, change the speed of the GameElement to be the actual value per second you wanted (which is 240)
 ``` typescript
    super(game, {
      name: 'my-avatar',
      sprite: 'avatar',
      pos: {
        x: 20,
        y: 20,
      },
    }, {
      speed: 240 //you should specify values like these as a "per second", ex: attacks per second
    });
 ```

Run it! Now you should be able to see a consistent motion now whether your run in 6, 12, 24, 30 or even 60 fps. timeDelta is a multiplier you will use to adjust your values.