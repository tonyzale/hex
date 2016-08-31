namespace HexGame {

  export class Hex {
    outer_r: number;
    corners: [number, number][] = [];
    selected = false;
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

  export class Gameboard {
    hex_board: Hex[][] = [];
    hexes: Hex[] = [];
    constructor(public side_size: number) {
      let hex_rad = 50;
      let x = hex_rad * 2;
      let y = hex_rad * 2;
      let hex_count = 0;
      for (var i = 0; i < side_size; ++i) {
        this.hex_board[i] = [];
        for (var j = 0; j < side_size; ++j) {
          this.hex_board[i][j] = new Hex(x, y, hex_rad);
          this.hexes[hex_count++] = this.hex_board[i][j];
          y += hex_rad * 2;;
        }
        if (i % 2 == 0) {
          y = hex_rad * 3;
        } else {
          y = hex_rad * 2;
        }
        x += this.hexes[0].outer_r * 1.5;
      }
    }
  }
}