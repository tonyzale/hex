/// <reference path='../../DefinitelyTyped/angularjs/angular.d.ts' />
/// <reference path='../../DefinitelyTyped/angularjs/angular-route.d.ts' />

namespace HexGame {

  class Hex {
    outer_r: number;
    corners: [number, number][] = [];
    owner: Player;
    poly_string = "";
    temp_class = "";
    constructor(public x: number, public y: number, public inner_r: number, public id: number) {
      // outer r is a side-length of the triangles forming the hex
      this.outer_r = inner_r / Math.sqrt(3) * 2;
      const top = y - inner_r;
      const bottom = y + inner_r;
      const left = x - this.outer_r;
      const right = x + this.outer_r;
      const inner_left = x - (this.outer_r * 0.5);
      const inner_right = x + (this.outer_r * 0.5);
      this.corners[0] = [left, y];
      this.corners[1] = [inner_left, top];
      this.corners[2] = [inner_right, top];
      this.corners[3] = [right, y];
      this.corners[4] = [inner_right, bottom];
      this.corners[5] = [inner_left, bottom];
      for (const c of this.corners) {
        this.poly_string += `${c[0]},${c[1]} `;
      }
      this.poly_string += `${this.corners[0][0]},${this.corners[0][1]}`;
    }
    class_name(): string {
      if (this.owner !== undefined) return this.owner.class_name;
      if (this.temp_class !== "") return this.temp_class;
      return "unowned";
    }
  }

  class Gameboard {
    hex_board: Hex[][] = [];
    hexes: Hex[] = [];
    left_border_points: string = "";
    right_border_points: string = "";
    top_border_points: string = "";
    bottom_border_points: string = "";
    constructor(public side_size: number) {
      let hex_rad = 50;
      let x = hex_rad * 2;
      let y = hex_rad * 2;
      let hex_count = 0;
      for (let i = 0; i < side_size; ++i) {
        this.hex_board[i] = [];
        for (let j = 0; j < side_size; ++j) {
          this.hex_board[i][j] = new Hex(x, y, hex_rad, hex_count);
          this.hexes[hex_count++] = this.hex_board[i][j];
          y += hex_rad * 2;
        }
        if (i % 2 === 0) {
          y = hex_rad * 3;
        } else {
          y = hex_rad * 2;
        }
        x += this.hexes[0].outer_r * 1.5;
      }
      for (let j = 0; j < side_size; ++j) {
        const left_hex = this.hex_board[0][j].corners;
        this.left_border_points += `${left_hex[1][0]},${left_hex[1][1]} ${left_hex[0][0]},${left_hex[0][1]} `;
        const right_hex = this.hex_board[side_size - 1][j].corners;
        this.right_border_points += `${right_hex[2][0]},${right_hex[2][1]} ${right_hex[3][0]},${right_hex[3][1]} `;

        const top_hex = this.hex_board[j][0].corners;
        const bottom_hex = this.hex_board[j][side_size - 1].corners;
        this.top_border_points += `${top_hex[1][0]},${top_hex[1][1]} ${top_hex[2][0]},${top_hex[2][1]} `;
        this.bottom_border_points += `${bottom_hex[5][0]},${bottom_hex[5][1]} ${bottom_hex[4][0]},${bottom_hex[4][1]} `;
      }
      const border_width = 5;
      this.left_border_points += `${this.hex_board[0][side_size - 1].corners[5][0]},${this.hex_board[0][side_size - 1].corners[5][1]} `;
      this.left_border_points += `${this.hex_board[0][side_size - 1].corners[5][0] - border_width},${this.hex_board[0][side_size - 1].corners[5][1]} `;
      this.right_border_points += `${this.hex_board[side_size - 1][side_size - 1].corners[4][0]},${this.hex_board[0][side_size - 1].corners[4][1]} `;
      this.right_border_points += `${this.hex_board[side_size - 1][side_size - 1].corners[4][0] + border_width},${this.hex_board[0][side_size - 1].corners[4][1]} `;
      for (let j = side_size - 1; j >= 0; --j) {
        const left_hex = this.hex_board[0][j].corners;
        this.left_border_points += `${left_hex[0][0] - border_width},${left_hex[0][1]} ${left_hex[1][0] - border_width},${left_hex[1][1]} `;
        const right_hex = this.hex_board[side_size - 1][j].corners;
        this.right_border_points += `${right_hex[3][0] + border_width},${right_hex[3][1]} ${right_hex[2][0] + border_width},${right_hex[2][1]} `;

        const top_hex = this.hex_board[j][0].corners;
        const bottom_hex = this.hex_board[j][side_size - 1].corners;
        this.bottom_border_points += `${bottom_hex[4][0]},${bottom_hex[4][1] + border_width} ${bottom_hex[5][0]},${bottom_hex[5][1] + border_width} `;
        this.top_border_points += `${top_hex[2][0]},${top_hex[2][1] - border_width} ${top_hex[1][0]},${top_hex[1][1] - border_width} `;
      }
    }

    valid_loc(i: number, j: number): boolean {
      return i >= 0 && i < this.side_size && j >= 0 && j < this.side_size;
    }

    adjacent_hexes(hex: Hex): Hex[] {
      let adjacents: Hex[] = [];
      let i = Math.floor(hex.id / this.side_size);
      let j = hex.id % this.side_size;
      if (this.hex_board[i][j] !== hex) {
        throw new Error("Unexpected Hex at hex_board[" + i + "][" + j + "]");
      }
      // above
      if (this.valid_loc(i, j - 1)) {
        adjacents.push(this.hex_board[i][j - 1]);
      }
      // below
      if (this.valid_loc(i, j + 1)) {
        adjacents.push(this.hex_board[i][j + 1]);
      }
      let up = 0;
      if ((i % 2) === 0) {
        up = -1;
      }
      let down = up + 1;
      // up left
      if (this.valid_loc(i - 1, j + up)) {
        adjacents.push(this.hex_board[i - 1][j + up]);
      }
      // up right
      if (this.valid_loc(i + 1, j + up)) {
        adjacents.push(this.hex_board[i + 1][j + up]);
      }
      // down left
      if (this.valid_loc(i - 1, j + down)) {
        adjacents.push(this.hex_board[i - 1][j + down]);
      }
      // down right
      if (this.valid_loc(i + 1, j + down)) {
        adjacents.push(this.hex_board[i + 1][j + down]);
      }
      return adjacents;
    }
  }

  class Player {
    constructor(public name: string, public class_name: string) {}
  }

  export class Game {
    board: Gameboard = new Gameboard(11);
    players = [new Player("P1", "red"), new Player("P2", "blue")];
    current_player_id = 0;
    winner: Player = undefined;
    click(id: number) {
      if (this.board.hexes[id].owner === undefined) {
        this.board.hexes[id].owner = this.players[this.current_player_id];
        this.current_player_id = (this.current_player_id + 1) % 2;
        this.winner = this.check_winner();
      }
    }
    current_player_name(): string {
      return this.players[this.current_player_id].name;
    }

    hexlist_contains(hex_list: Hex[], hex: Hex): boolean {
      for (let h of hex_list) {
        if (h === hex) {
          return true;
        }
      }
      return false;
    }

    can_reach(open: Hex[], destination: Hex[], explored: Hex[], adjacent_filter: (hex: Hex) => boolean): boolean {
      while (open.length > 0) {
        let current = open.pop();
        if (this.hexlist_contains(destination, current)) {
          return true;
        }
        explored.push(current);
        let adjacents = this.board.adjacent_hexes(current).filter(adjacent_filter);
        for (let hex of adjacents) {
          if (!this.hexlist_contains(explored, hex)) {
            open.push(hex);
          }
        }
      }
      return false;
    }

    check_winner(): Player {
      let start_p1: Hex[] = [];
      let destination_p1: Hex[] = [];
      let start_p2: Hex[] = [];
      let destination_p2: Hex[] = [];
      for (let i = 0; i < this.board.side_size; i++) {
        start_p1.push(this.board.hex_board[0][i]);
        destination_p1.push(this.board.hex_board[this.board.side_size - 1][i]);
        start_p2.push(this.board.hex_board[i][0]);
        destination_p2.push(this.board.hex_board[i][this.board.side_size - 1]);
      }
      let game = this;
      if (this.can_reach(start_p1, destination_p1, start_p1.slice(0), function(hex: Hex){ return hex.owner === game.players[0]; })) {
        return this.players[0];
      }
      if (this.can_reach(start_p2, destination_p2, start_p2.slice(0), function(hex: Hex){ return hex.owner === game.players[1]; })) {
        return this.players[1];
      }
      return undefined;
    }

    hex_enter(id: number) {
      if (this.board.hexes[id].owner === undefined) {
        this.board.hexes[id].temp_class = "hover_" + this.players[this.current_player_id].class_name;
      }
      let adjacents = this.board.adjacent_hexes(this.board.hexes[id]);
      adjacents.forEach(function(h) {
        if (h.owner === undefined) {
          h.temp_class = "adjacent";
        }
      });
    }

    hex_leave(id: number) {
      const temp_class = this.board.hexes[id].temp_class;
      if (temp_class === "hover_red" || temp_class === "hover_blue") {
        this.board.hexes[id].temp_class = "";
      }
      let adjacents = this.board.adjacent_hexes(this.board.hexes[id]);
      adjacents.forEach(function(h) {
        if (h.temp_class === "adjacent") {
          h.temp_class = "";
        }
      });
    }
  }
}

let hexApp: angular.IModule = angular.module("hexApp", ["ngRoute"]);

hexApp.service("gameManager", function(){
  class GameManager {
    getGames(): HexGame.Game[] {
      return [];
    }
  }
});

hexApp.controller('MainController', function MainController($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
 })

hexApp.controller("GameController", function GameController($scope) {
  // setup scope here.
  $scope.viewbox = "-10 -10 2000 2000";
  $scope.hexgame = new HexGame.Game();
});

hexApp.controller("GameListController", function GameListController($scope) {

});

hexApp.config(function($routeProvider: angular.route.IRouteProvider) {
  $routeProvider
   .when('/Game', {
    templateUrl: 'game.html',
    controller: 'GameController'
  })
  .when('/', {
    templateUrl: 'gamelist.html',
    controller: 'GameListController'
  });
});