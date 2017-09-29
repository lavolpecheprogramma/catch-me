function MouseRaycaster(parent) {
	this.parent = parent;
	this.mouse = new THREE.Vector2();
	this.raycaster = new THREE.Raycaster();
	this.observed = [];
	this.onMouseMove = this.onMouseMove.bind(this);
	this.onTouch = this.onTouch.bind(this);
	this.create();
}

MouseRaycaster.prototype.create = function() {
	document.addEventListener( 'mousemove', this.onMouseMove, false );
	document.addEventListener( 'touchstart', this.onTouch, false );
	document.addEventListener( 'touchmove', this.onTouch, false );
};

MouseRaycaster.prototype.onMouseMove = function(e) {
	this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
};
MouseRaycaster.prototype.onTouch = function(e) {
	if(e.touches.length){
		this.mouse.x = ( e.touches[0].clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( e.touches[0].clientY / window.innerHeight ) * 2 + 1;
	}
};

MouseRaycaster.prototype.addElementToObserve = function(element) {
	this.observed.push(element);
};

MouseRaycaster.prototype.update = function(num) {
	this.raycaster.setFromCamera( this.mouse, this.parent.cameraManager.camera );
	var intersects = this.raycaster.intersectObjects( this.parent.scene.children );
	if ( intersects.length > 0 && this.observed.length > 0) {
		for (var i = intersects.length - 1; i >= 0; i--) {
			for (var j = this.observed.length - 1; j >= 0; j--) {
				if(intersects[i].object == this.observed[j].mesh && !this.observed[j].isAnimating){
					this.observed[j].moveRandom();
				}
			}
		}
	}
};


module.exports = MouseRaycaster;