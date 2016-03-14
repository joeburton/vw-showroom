'use strict';

var $ = require('./lib/jquery');

var bgLoaded = function(custom) {

	var self = this;

	// Default plugin settings
	var defaults = {
		afterLoaded : function() {
			return;
		},
		afterAllLoaded: function () {
			return;
		}
	};

	// Merge default and user settings
	var settings = $.extend({}, defaults, custom);
	var count = 0;

	// Loop through element
	self.each(function(){
		
		var $this = $(this),
			bgImgs = $this.css('background-image').split(', ');
		
		$this.data('loaded-count', 0);

		$.each( bgImgs, function(key, value) {
			
			var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
			
			$('<img/>').attr('src', img).on('load', function() {
				
				count++;

				$(this).remove(); // prevent memory leaks
				$this.data('loaded-count', $this.data('loaded-count') + 1 );
				
				if ($this.data('loaded-count') >= bgImgs.length) {
					settings.afterLoaded.call($this);
				}
				
				if (count === self.length) {
					settings.afterAllLoaded.call();
				}	

			}).on('error', function() { 
				count++;
				if (count === self.length) {
					settings.afterAllLoaded.call();
				}	
			});

		});

	});

};

module.exports = bgLoaded;
