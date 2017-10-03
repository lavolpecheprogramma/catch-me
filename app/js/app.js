window._ = window.underscore = require('underscore');

var Utils = require('./utils.js');
var Router = require('./router.js');
var Scene = require('./scene.js');

window.App = {
	Router: Router,
	Scene: Scene
}

function init(){
	App.Router.init();
	App.Scene.init();

	addEventListeners();
}

function addEventListeners(){
	var visProp = Utils.getHiddenProp();
	if (visProp) {
		var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
		document.addEventListener(evtname, onChangePageVisibility);
	}
}

function onChangePageVisibility(){
	App.pageVisibility = !Utils.pageIsHidden();
	App.Scene.onChangePageVisibility();
}

init();