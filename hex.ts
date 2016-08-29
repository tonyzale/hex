class Hex {
  outer_r: number;
  corners: [number, number][] = [];
  poly_string = "";
  constructor(public x: number, public y: number, public inner_r: number) {
    // outer r is a side-length of the triangles forming the hex
    this.outer_r = inner_r / Math.sqrt(3) * 2;
    var top = y - inner_r;
    var bottom = y + inner_r;
    var left = x - this.outer_r;
    var right = x + this.outer_r;
    var inner_left = x - (this.outer_r * 0.5);
    var inner_right = x + (this.outer_r * 0.5);
    this.corners[0] = [left, y];
    this.corners[1] = [inner_left, top];
    this.corners[2] = [inner_right, top];
    this.corners[3] = [right, y];
    this.corners[4] = [inner_right, bottom];
    this.corners[5] = [inner_left, bottom];
    for (var c of this.corners) {
      this.poly_string += `${c[0]},${c[1]} `;
    }
    this.poly_string += `${this.corners[0][0]},${this.corners[0][1]}`;
  }
}
