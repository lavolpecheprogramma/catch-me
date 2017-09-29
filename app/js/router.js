function Router() {
	this.pages = {
		intro: document.getElementById('duringPlay'),
		about: document.getElementById('about'),
	}

	this.onHashChange = this.onHashChange.bind(this);
}

Router.prototype.init = function() {
	window.onhashchange = this.onHashChange;
	if(window.location.hash != ''){
		window.location.hash = ''
	}else{
		this.onHashChange();
	}
};

Router.prototype.onHashChange = function() {
	var nextPage, callback = false;

	switch(window.location.hash){
		case '#about-the-project':
			nextPage = this.pages.about;
			break;
		
		default:
			nextPage = this.pages.intro;
			break;
	}

	if(this.currentPage){
		this.prevPage = this.currentPage;
		this.currentPage = nextPage;
		this.fadeOutPage(this.prevPage, () => {
			this.fadeInPage(this.currentPage, () => {
				if( _.isFunction(callback) ){
					callback();
				}
			})
		});

	}else{
		this.currentPage = nextPage;
		this.fadeInPage(this.currentPage, () =>{
			if(_.isFunction(callback)){
				callback();
			}
		})
	}
};


Router.prototype.fadeInPage = function(element, callback){
	var startOpacity = element.style.opacity;
	element.style.pointerEvents = 'auto';
	element.style.visibility = 'visible';
	var tween = new TWEEN.Tween({ opacity : startOpacity }).to({ opacity : 1 }, 500)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.onUpdate(function(){
		element.style.opacity = this.opacity;
	})
	.onComplete(function(){
		if(_.isFunction(callback)){
			callback();
		}
	})
	.start();
}

Router.prototype.fadeOutPage = function( element, callback ){
	var startOpacity = element.style.opacity;
	element.style.pointerEvents = 'none';
	var tween = new TWEEN.Tween({ opacity: startOpacity }).to({ opacity: 0 }, 500)
	.easing(TWEEN.Easing.Quadratic.InOut)
	.onUpdate(function(){
		element.style.opacity = this.opacity;
	})
	.onComplete(function(){
		element.style.visibility = 'hidden';
		if(_.isFunction(callback)){
			callback();
		}
	})
	.start();
}

module.exports = new Router();