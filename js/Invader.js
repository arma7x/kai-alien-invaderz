'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Invader = function () {
	function Invader(x, y, shape, color, speed) {
		_classCallCheck(this, Invader);

		this.x = x || 0;
		this.y = y || 0;
		this.xDir = 1;
		this.s = 4;
		this.i = 0;
		this.speed = speed != undefined ? speed : 0.008;
		this.frame = 0;
		this.dir = Math.random() < 0.5 ? -1 : 1;
		this.maxFrame = Math.floor(Math.random() * 32) + 16;
		this.color = color || getRandomColor() || 'black';
		this.shape = shape || [0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0];
		this.isAlive = true;
		this.fit = 0;
	}

	_createClass(Invader, [{
		key: 'update',
		value: function update() {
			if (this.y >= h >> 2) {
				lives++;
				this.isAlive = false;
				return;
			}

			if (!this.shape[this.i]) {

				var value = this.dir * this.speed * dt;
				if (this.x + value > 0 && (this.x + value) * this.s < w - this.s * this.s) {
					this.x += value;
				}
			}

			this.y += this.speed * dt;

			if (this.frame == this.maxFrame) {
				this.dir = -this.dir;
				this.frame = 0;
				this.maxFrame = Math.floor(Math.random() * 32) + 16;
				this.i = ++this.i % this.shape.length;
			}

			this.frame++;
			this.fit = Math.round(this.y);

			if (Math.sqrt(Math.pow(player.bullet.y - this.y, 2) + Math.pow(player.bullet.x - (this.x + 2), 2)) < 2.5) {
				var x = player.bullet.x;
				var y = player.bullet.y;
				var area = c.getImageData(x * this.s, y * this.s, player.bullet.s + 1, player.bullet.s);
				for (var i = 0; i < area.data.length; i++) {
					if (area.data[i]) {
						this.isAlive = false;
						player.bullet = {};
						player.isShooting = false;
						break;
					}
				}
			}
		}
	}, {
		key: 'show',
		value: function show() {
			if (this.isAlive) {
				c.fillStyle = this.color;
				for (var i = 0; i < this.shape.length; i++) {
					if (this.shape[i]) {
						c.fillRect((this.x + i % 4) * this.s, (this.y + (i >> 2)) * this.s, this.s, this.s);
					}
				}
				this.update();
			}
		}
	}]);

	return Invader;
}();
