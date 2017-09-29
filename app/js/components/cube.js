function Cube(parent) {
	this.parent = parent;
	this.create();
	this.duration = 500;
	this.isAnimating = false;
}

Cube.prototype.create = function() {
	var cube = new THREE.Mesh( new THREE.CubeGeometry( 5, 5, 5 ), new THREE.MeshBasicMaterial({
	    color: 0xD83232,
	    wireframe: true
	}) );

	this.cubeWhite = new THREE.Mesh( new THREE.CubeGeometry( 4, 4, 4 ), new THREE.MeshBasicMaterial({
	   transparent: true,
	   opacity: 0,
	   color: 0xD83232,
	}) );

	var master = new THREE.Mesh( new THREE.CubeGeometry( 14, 14, 14 ), new THREE.MeshBasicMaterial({
	   transparent: true,
	   opacity: 0
	}) );
	
	master.add(this.cubeWhite);
	master.add(cube);

	this.mesh = master;
	this.mesh.position.x = 0;  
	this.mesh.position.y = 10;  
	this.mesh.position.z = 0;

	this.parent.scene.add(this.mesh);
};

Cube.prototype.update = function(num) {
	this.mesh.rotation.x += 0.01;
	this.mesh.rotation.y += 0.01;
};

Cube.prototype.randomPosition = function() {
	return new THREE.Vector3(
			Math.random() * 30 - 15,
			Math.random() * 30 - 15,
			Math.random() * 20 - 5
		);
}

Cube.prototype.newPosition = function() {
	var newPos = this.randomPosition();
	while ( Math.abs(newPos.x - this.mesh.position.x) < 10 &&
			Math.abs(newPos.y - this.mesh.position.y) < 10) {
	    newPos = this.randomPosition();
	}
	return newPos;
};

Cube.prototype.createPath = function(){
	this.along = new THREE.CatmullRomCurve3([
		this.mesh.position,
		this.newPosition()
	]);
}

Cube.prototype.moveRandom = function() {
	if( this.isAnimating ) { return; }
	
	if(this.tween){
		this.tween.stop();
		TWEEN.remove(this.tween);
	}
	
	this.isAnimating = true;
	this.createPath();

	var self = this;
	
	this.tween = new TWEEN.Tween({ tick: 0 }).to({ tick: 1 }, this.duration)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.onUpdate(function(){
		var norm;
		var pathPosition = self.along.getPointAt( this.tick );
		self.mesh.position.set( pathPosition.x, pathPosition.y, pathPosition.z );
		if(this.tick < 0.5){
			self.cubeWhite.material.opacity = this.tick;
		}else{
			self.cubeWhite.material.opacity = 1 - this.tick;
		}
	})
	.onComplete(function(){
		self.isAnimating = false;
	})
	.start();
}

module.exports = Cube;