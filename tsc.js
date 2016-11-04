var HexGame;
(function (HexGame) {
    var Hex = (function () {
        function Hex(x, y, inner_r, id) {
            this.x = x;
            this.y = y;
            this.inner_r = inner_r;
            this.id = id;
            this.corners = [];
            this.poly_string = "";
            this.temp_class = "";
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
            for (var _i = 0, _a = this.corners; _i < _a.length; _i++) {
                var c = _a[_i];
                this.poly_string += c[0] + "," + c[1] + " ";
            }
            this.poly_string += this.corners[0][0] + "," + this.corners[0][1];
        }
        Hex.prototype.class_name = function () {
            if (this.owner !== undefined)
                return this.owner.class_name;
            if (this.temp_class !== "")
                return this.temp_class;
            return "unowned";
        };
        return Hex;
    }());
    var Gameboard = (function () {
        function Gameboard(side_size) {
            this.side_size = side_size;
            this.hex_board = [];
            this.hexes = [];
            this.left_border_points = "";
            this.right_border_points = "";
            this.top_border_points = "";
            this.bottom_border_points = "";
            var hex_rad = 50;
            var x = hex_rad * 2;
            var y = hex_rad * 2;
            var hex_count = 0;
            for (var i = 0; i < side_size; ++i) {
                this.hex_board[i] = [];
                for (var j = 0; j < side_size; ++j) {
                    this.hex_board[i][j] = new Hex(x, y, hex_rad, hex_count);
                    this.hexes[hex_count++] = this.hex_board[i][j];
                    y += hex_rad * 2;
                }
                if (i % 2 === 0) {
                    y = hex_rad * 3;
                }
                else {
                    y = hex_rad * 2;
                }
                x += this.hexes[0].outer_r * 1.5;
            }
            for (var j = 0; j < side_size; ++j) {
                var left_hex = this.hex_board[0][j].corners;
                this.left_border_points += left_hex[1][0] + "," + left_hex[1][1] + " " + left_hex[0][0] + "," + left_hex[0][1] + " ";
                var right_hex = this.hex_board[side_size - 1][j].corners;
                this.right_border_points += right_hex[2][0] + "," + right_hex[2][1] + " " + right_hex[3][0] + "," + right_hex[3][1] + " ";
                var top_hex = this.hex_board[j][0].corners;
                var bottom_hex = this.hex_board[j][side_size - 1].corners;
                this.top_border_points += top_hex[1][0] + "," + top_hex[1][1] + " " + top_hex[2][0] + "," + top_hex[2][1] + " ";
                this.bottom_border_points += bottom_hex[5][0] + "," + bottom_hex[5][1] + " " + bottom_hex[4][0] + "," + bottom_hex[4][1] + " ";
            }
            var border_width = 5;
            this.left_border_points += this.hex_board[0][side_size - 1].corners[5][0] + "," + this.hex_board[0][side_size - 1].corners[5][1] + " ";
            this.left_border_points += this.hex_board[0][side_size - 1].corners[5][0] - border_width + "," + this.hex_board[0][side_size - 1].corners[5][1] + " ";
            this.right_border_points += this.hex_board[side_size - 1][side_size - 1].corners[4][0] + "," + this.hex_board[0][side_size - 1].corners[4][1] + " ";
            this.right_border_points += this.hex_board[side_size - 1][side_size - 1].corners[4][0] + border_width + "," + this.hex_board[0][side_size - 1].corners[4][1] + " ";
            for (var j = side_size - 1; j >= 0; --j) {
                var left_hex = this.hex_board[0][j].corners;
                this.left_border_points += left_hex[0][0] - border_width + "," + left_hex[0][1] + " " + (left_hex[1][0] - border_width) + "," + left_hex[1][1] + " ";
                var right_hex = this.hex_board[side_size - 1][j].corners;
                this.right_border_points += right_hex[3][0] + border_width + "," + right_hex[3][1] + " " + (right_hex[2][0] + border_width) + "," + right_hex[2][1] + " ";
                var top_hex = this.hex_board[j][0].corners;
                var bottom_hex = this.hex_board[j][side_size - 1].corners;
                this.bottom_border_points += bottom_hex[4][0] + "," + (bottom_hex[4][1] + border_width) + " " + bottom_hex[5][0] + "," + (bottom_hex[5][1] + border_width) + " ";
                this.top_border_points += top_hex[2][0] + "," + (top_hex[2][1] - border_width) + " " + top_hex[1][0] + "," + (top_hex[1][1] - border_width) + " ";
            }
        }
        Gameboard.prototype.valid_loc = function (i, j) {
            return i >= 0 && i < this.side_size && j >= 0 && j < this.side_size;
        };
        Gameboard.prototype.adjacent_hexes = function (hex) {
            var adjacents = [];
            var i = Math.floor(hex.id / this.side_size);
            var j = hex.id % this.side_size;
            if (this.hex_board[i][j] !== hex) {
                throw new Error("Unexpected Hex at hex_board[" + i + "][" + j + "]");
            }
            if (this.valid_loc(i, j - 1)) {
                adjacents.push(this.hex_board[i][j - 1]);
            }
            if (this.valid_loc(i, j + 1)) {
                adjacents.push(this.hex_board[i][j + 1]);
            }
            var up = 0;
            if ((i % 2) === 0) {
                up = -1;
            }
            var down = up + 1;
            if (this.valid_loc(i - 1, j + up)) {
                adjacents.push(this.hex_board[i - 1][j + up]);
            }
            if (this.valid_loc(i + 1, j + up)) {
                adjacents.push(this.hex_board[i + 1][j + up]);
            }
            if (this.valid_loc(i - 1, j + down)) {
                adjacents.push(this.hex_board[i - 1][j + down]);
            }
            if (this.valid_loc(i + 1, j + down)) {
                adjacents.push(this.hex_board[i + 1][j + down]);
            }
            return adjacents;
        };
        return Gameboard;
    }());
    var Player = (function () {
        function Player(name, class_name) {
            this.name = name;
            this.class_name = class_name;
        }
        return Player;
    }());
    var Game = (function () {
        function Game() {
            this.board = new Gameboard(11);
            this.players = [new Player("P1", "red"), new Player("P2", "blue")];
            this.current_player_id = 0;
            this.winner = undefined;
        }
        Game.prototype.click = function (id) {
            if (this.board.hexes[id].owner === undefined) {
                this.board.hexes[id].owner = this.players[this.current_player_id];
                this.current_player_id = (this.current_player_id + 1) % 2;
                this.winner = this.check_winner();
            }
        };
        Game.prototype.current_player_name = function () {
            return this.players[this.current_player_id].name;
        };
        Game.prototype.hexlist_contains = function (hex_list, hex) {
            for (var _i = 0, hex_list_1 = hex_list; _i < hex_list_1.length; _i++) {
                var h = hex_list_1[_i];
                if (h === hex) {
                    return true;
                }
            }
            return false;
        };
        Game.prototype.can_reach = function (open, destination, explored, adjacent_filter) {
            while (open.length > 0) {
                var current = open.pop();
                if (this.hexlist_contains(destination, current)) {
                    return true;
                }
                explored.push(current);
                var adjacents = this.board.adjacent_hexes(current).filter(adjacent_filter);
                for (var _i = 0, adjacents_1 = adjacents; _i < adjacents_1.length; _i++) {
                    var hex = adjacents_1[_i];
                    if (!this.hexlist_contains(explored, hex)) {
                        open.push(hex);
                    }
                }
            }
            return false;
        };
        Game.prototype.check_winner = function () {
            var start_p1 = [];
            var destination_p1 = [];
            var start_p2 = [];
            var destination_p2 = [];
            for (var i = 0; i < this.board.side_size; i++) {
                start_p1.push(this.board.hex_board[0][i]);
                destination_p1.push(this.board.hex_board[this.board.side_size - 1][i]);
                start_p2.push(this.board.hex_board[i][0]);
                destination_p2.push(this.board.hex_board[i][this.board.side_size - 1]);
            }
            var game = this;
            if (this.can_reach(start_p1, destination_p1, start_p1.slice(0), function (hex) { return hex.owner === game.players[0]; })) {
                return this.players[0];
            }
            if (this.can_reach(start_p2, destination_p2, start_p2.slice(0), function (hex) { return hex.owner === game.players[1]; })) {
                return this.players[1];
            }
            return undefined;
        };
        Game.prototype.hex_enter = function (id) {
            if (this.board.hexes[id].owner === undefined) {
                this.board.hexes[id].temp_class = "hover_" + this.players[this.current_player_id].class_name;
            }
            var adjacents = this.board.adjacent_hexes(this.board.hexes[id]);
            adjacents.forEach(function (h) {
                if (h.owner === undefined) {
                    h.temp_class = "adjacent";
                }
            });
        };
        Game.prototype.hex_leave = function (id) {
            var temp_class = this.board.hexes[id].temp_class;
            if (temp_class === "hover_red" || temp_class === "hover_blue") {
                this.board.hexes[id].temp_class = "";
            }
            var adjacents = this.board.adjacent_hexes(this.board.hexes[id]);
            adjacents.forEach(function (h) {
                if (h.temp_class === "adjacent") {
                    h.temp_class = "";
                }
            });
        };
        return Game;
    }());
    HexGame.Game = Game;
})(HexGame || (HexGame = {}));
var hexApp = angular.module("hexApp", []);
hexApp.controller("HexController", function HexController($scope) {
    $scope.viewbox = "-10 -10 2000 2000";
    $scope.hexgame = new HexGame.Game();
});
//# sourceMappingURL=tsc.js.map