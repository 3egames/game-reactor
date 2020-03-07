import CollisionBox from './CollisionBox';

export default class CollisionSets {
  constructor(element) {
    this.boxes = [];
    this.element = element;
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

  addBox (cbox) {
    if (cbox instanceof CollisionBox !== true) {
      throw new Error('parameter not an instance of CollisionBox');
    }
    this.boxes.push(cbox);
  }

  collidesWithElement(element2) {
    if (this.isActive && element2.HasCollisions && element2.Collisions.Active) {
      let bx1;
      let bx2;
      for (let i = 0; i < this.Boxes.length; i++) {
        for (let j = 0; j < element2.Collisions.Boxes.length; j++) {
          bx1 = this.Boxes[i];
          bx2 = element2.Collisions.Boxes[j];
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
      // element2.collisions.forEach((cgrp2) => {
      //   if (cgrp2.Active) {
      //     this.boxes.forEach((cbx1) => {
      //       cgrp2.Boxes.forEach((cbx2) => {
      //         if (cbx1)
      //       });
      //     });
      //   }
      // });
    }
    return false;
  }
}
