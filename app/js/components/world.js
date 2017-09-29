var Utils = require('../utils.js');
var Cube = require('./cube.js');
var MouseRaycaster = require('./MouseRaycaster.js');

function World(parent) {
	this.parent = parent;
	this.create();
	return this;
}

World.prototype.create = function() {
	this.cube = new Cube(this.parent);
	this.mouseRaycaster = new MouseRaycaster(this.parent);
	this.mouseRaycaster.addElementToObserve(this.cube);
};

World.prototype.update = function(num) {
	this.cube.update(num);
	this.mouseRaycaster.update(num);
};

module.exports = World;