var CameraManager = require('./components/cameraManager.js');
var World = require('./components/world.js');

// var backgroundColor = 0xe8e4e4;

var Scene = function(){ this.pageVisibility = true; };

Scene.prototype.init = function () {
	this.createScene = this.createScene.bind(this);
	this.addListeners = this.addListeners.bind(this);
	this.onResize = this.onResize.bind(this);
	this.onChangePageVisibility = this.onChangePageVisibility.bind(this);
	this.render = this.render.bind(this);

	this.createScene();
	this.addListeners();
	this.render();
};

Scene.prototype.createScene = function() {
	this.createRenderer();
	this.cameraManager = new CameraManager(this);
	this.world = new World(this);
};

Scene.prototype.createRenderer = function(){

	this.scene = new THREE.Scene();
	// this.scene.background = new THREE.Color( backgroundColor );

	//get the width and height
	this.w_w = window.innerWidth;
	this.w_h = window.innerHeight;

	//get the renderer
	this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
	this.renderer.setSize(this.w_w, this.w_h);

	//append the rederer to the body
	document.body.appendChild(this.renderer.domElement);
}

Scene.prototype.onResize = function() {
	this.w_w = window.innerWidth,
	this.w_h = window.innerHeight;

	this.cameraManager.onResize();
	this.renderer.setSize( this.w_w, this.w_h );
}

Scene.prototype.onChangePageVisibility = function(data){
	this.pageVisibility = App.pageVisibility;
}

Scene.prototype.addListeners =  function() {
	window.addEventListener( 'resize', this.onResize);
}

Scene.prototype.render = function(time) {
	requestAnimationFrame( this.render );
	TWEEN.update(time);
	if(!this.pageVisibility) { return;}

	this.world.update();

	this.renderer.render( this.scene, this.cameraManager.camera );	
};

module.exports = new Scene;

