function CameraManager(parent) {
	this.parent = parent;
	this.opts = {
		cameraPosition: { x: 0, y: 25, z: 25 }
	}
	this.create();
	return this;
}

CameraManager.prototype.create = function() {
	var aspect = this.parent.w_w / this.parent.w_h;

	this.camera = new THREE.PerspectiveCamera( 75, aspect, 10, 1000 );

	this.camera.position.set(
		this.opts.cameraPosition.x,
		this.opts.cameraPosition.y,
		this.opts.cameraPosition.z
	);
	this.camera.lookAt(new THREE.Vector3(0,0,0));
};

CameraManager.prototype.onResize = function() {
	this.camera.aspect = this.parent.w_w / this.parent.w_h;
	this.camera.updateProjectionMatrix();
}

module.exports = CameraManager;