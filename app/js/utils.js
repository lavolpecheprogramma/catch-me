var prefix = null, hiddenProp= null;
module.exports = {
	getHiddenProp: function(){
		if (hiddenProp == null) {
			var prefixes = ['webkit','moz','ms','o'];

			// if 'hidden' is natively supported just return it
			if ('hidden' in document) return 'hidden';

			// otherwise loop over all the known prefixes until we find one
			for (var i = 0; i < prefixes.length; i++){
				if ((prefixes[i] + 'Hidden') in document){
					hiddenProp = prefixes[i] + 'Hidden';
					return hiddenProp;
				}
			}
			return null;
		}
		return hiddenProp;
		// otherwise it's not supported
	},

	pageIsHidden: function() {
		var prop = this.getHiddenProp();
		if (!prop) return false;

		return document[prop];
	},

	getVendorPrefix: function() {
		if (prefix == null) {
			var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice
			.call(styles)
			.join('')
			.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
			)[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
			prefix = {
				dom: dom,
				lowercase: pre,
				css: '-' + pre + '-',
				js: pre[0].toUpperCase() + pre.substr(1)
			};
		}
		return prefix;
	},

}

