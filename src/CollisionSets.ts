import CollisionBox from './CollisionBox';
import GameElement from './GameElement';

export default class CollisionSets {
  private boxes: CollisionBox[];
  private isActive: boolean;

  constructor() {
    this.boxes = [];
    this.isActive = false;
  }

  get Active() {
    return this.isActive;
  }

  set Active(val) {
    this.isActive = val;
  }

  get Boxes() {
    return this.boxes;
  }

  addBox(cbox: CollisionBox) {
    this.boxes.push(cbox);
  }

  collidesWithElement(element2: GameElement) {
    if (this.isActive && element2.Config.collisions?.Active) {
      let bx1;
      let bx2;
      for (let i = 0; i < this.Boxes.length; i++) {
        for (let j = 0; j < element2.Config.collisions.Boxes.length; j++) {
          bx1 = this.Boxes[i];
          bx2 = element2.Config.collisions.Boxes[j];
          if (bx1.XPos >= bx2.XPos && bx1.XPos <= bx2.X2Pos
            && bx1.YPos >= bx2.YPos && bx1.YPos <= bx2.Y2Pos) {
            return true;
          } else if (bx1.X2Pos >= bx2.XPos && bx1.X2Pos <= bx2.X2Pos
            && bx1.YPos >= bx2.YPos && bx1.YPos <= bx2.Y2Pos) {
            return true;
          } else if (bx1.XPos >= bx2.XPos && bx1.XPos <= bx2.X2Pos
            && bx1.Y2Pos >= bx2.YPos && bx1.Y2Pos <= bx2.Y2Pos) {
            return true;
          } else if (bx1.X2Pos >= bx2.XPos && bx1.X2Pos <= bx2.X2Pos
            && bx1.Y2Pos >= bx2.YPos && bx1.Y2Pos <= bx2.Y2Pos) {
            return true;
          }
          // reverse test
          if (bx2.XPos >= bx1.XPos && bx2.XPos <= bx1.X2Pos
            && bx2.YPos >= bx1.YPos && bx2.YPos <= bx1.Y2Pos) {
            return true;
          } else if (bx2.X2Pos >= bx1.XPos && bx2.X2Pos <= bx1.X2Pos
            && bx2.YPos >= bx1.YPos && bx2.YPos <= bx1.Y2Pos) {
            return true;
          } else if (bx2.XPos >= bx1.XPos && bx2.XPos <= bx1.X2Pos
            && bx2.Y2Pos >= bx1.YPos && bx2.Y2Pos <= bx1.Y2Pos) {
            return true;
          } else if (bx2.X2Pos >= bx1.XPos && bx2.X2Pos <= bx1.X2Pos
            && bx2.Y2Pos >= bx1.YPos && bx2.Y2Pos <= bx1.Y2Pos) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
