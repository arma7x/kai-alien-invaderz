"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Genetics = function () {
	function Genetics() {
		_classCallCheck(this, Genetics);

		this.population = [];
		this.populationTmp = [];
		this.populationSize = 6;
		this.populationFeaturesSize = 16;
		this.bestOfGeneration;
	}

	_createClass(Genetics, [{
		key: "selectParent",
		value: function selectParent() {
			var total = 0;
			for (var i = 0; i < this.populationTmp.length; i++) {
				total += this.populationTmp[i].fit;
			}
			var prob = Math.random() * total;
			for (var _i = 0; _i < this.populationTmp.length; _i++) {
				if (prob < this.populationTmp[_i].fit) {
					return this.populationTmp.splice(_i, 1)[0];
				}
				prob -= this.populationTmp[_i].fit;
			}
		}
	}, {
		key: "createPopulation",
		value: function createPopulation() {
			this.population = [];
			for (var i = 0; i < this.populationSize; i++) {
				var shape = [];
				for (var j = 0; j < this.populationFeaturesSize; j++) {
					shape.push(Math.random() < 0.5 ? 1 : 0);
				}
				this.population.push(new Invader(w / 4 / 2, Math.random() * -20, shape));
			}
		}
	}, {
		key: "crossOver",
		value: function crossOver(_a, _b) {
			var a = void 0,
			    b = void 0,
			    x = void 0;
			if (Math.random() < 0.5) {
				a = _a;
				b = _b;
				x = w / 4 / 2;
			} else {
				a = _b;
				b = _a;
				x = a.x;
			}
			var child = new Invader(x, Math.random() * -20, a.shape.slice());
			var rand = Math.random();
			if (rand < 0.33) {
				for (var i = 0; i < a.shape.length; i += 4) {
					child.shape[i] = b.shape[i];
					child.shape[i + 1] = b.shape[i + 1];
				}
			} else if (rand < 0.66) {
				for (var _i2 = 0; _i2 < a.shape.length / 2; _i2++) {
					child.shape[_i2] = b.shape[_i2];
				}
			} else {
				for (var _i3 = 0; _i3 < a.shape.length; _i3++) {
					var value = void 0;
					if (_i3 % 2) {
						value = a.shape[_i3];
					} else {
						value = b.shape[_i3];
					}
					child.shape[_i3] = value;
				}
			}
			return child;
		}
	}, {
		key: "mutate",
		value: function mutate(child) {
			var spot = Math.floor(Math.random() * child.shape.length);
			if (child.shape[spot]) {
				child.shape[spot] = 0;
			} else {
				child.shape[spot] = 1;
			}
			return child;
		}
	}, {
		key: "evolve",
		value: function evolve() {
			var newPopulation = [];
			for (var x = 0; x < this.populationSize; x++) {
				this.populationTmp = this.population.slice();
				var a = this.selectParent();
				var b = this.selectParent();
				var child = this.crossOver(a, b);
				if (Math.random() < 0.1) {
					child = this.mutate(child);
				}
				newPopulation.push(child);
			}
			this.population = newPopulation;
		}
	}, {
		key: "elitism",
		value: function elitism() {
			this.createPopulation();
			var rand = Math.floor(Math.random() * this.population.length);
			var invader = new Invader(w / 4 / 2, Math.random() * -20, this.bestOfGeneration.shape.slice());
			this.population[rand] = invader;
		}
	}]);

	return Genetics;
}();
