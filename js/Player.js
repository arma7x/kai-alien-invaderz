'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
	function Player(x, y, shape, color) {
		_classCallCheck(this, Player);

		this.x = x || 0;
		this.y = y || 0;
		this.xDir = 1;
		this.s = 4;
		this.color = color || 'black';
		this.shape = shape || [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1];
		this.speed = 0.05;
		this.isMovingLeft = false;
		this.isMovingRight = false;
		this.isShooting = false;
		this.bullet = { x: this.x, y: this.y, s: 3 };
	}

	_createClass(Player, [{
		key: 'shoot',
		value: function shoot() {
			if (!this.isShooting) {
				this.bullet = { x: this.x + this.s / 2, y: this.y, s: 3 };
				this.isShooting = true;
				shootSound.play();
			}
		}
	}, {
		key: 'update',
		value: function update() {

			if (this.x > 0 && this.isMovingLeft) {
				this.x -= this.speed * dt;
			}
			if (this.x < w / 4 - this.s && this.isMovingRight) {
				this.x += this.speed * dt;
			}

			if (this.isShooting) {
				this.bullet.y -= 0.1 * dt;
				if (this.bullet.y < 0) {
					this.isShooting = false;
					this.bullet = {};
				}
			}
		}
	}, {
		key: 'show',
		value: function show() {
			c.fillStyle = this.color;
			for (var i = 0; i < this.shape.length; i++) {
				if (this.shape[i]) {
					c.fillRect((this.x + i % 4) * this.s, (this.y + (i >> 2)) * this.s, this.s, this.s);
				}
			}
			if (this.isShooting) {
				c.fillRect(this.bullet.x * this.s, this.bullet.y * this.s, this.bullet.s, this.bullet.s);
			}
			this.update();
		}
	}]);

	return Player;
}();
