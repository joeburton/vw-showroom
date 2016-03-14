'use strict';

var $ = require('./lib/jquery');
$.fn.bgLoaded = require('./load-images');

var showRoom = {

	init: function () {
		this.panels = this.randomise();
		this.bindEvents();
		this.getDimensions();
		this.getImages(); 
	},

	selectors: {
		grid: '[data-grid-container]',
		row: '[data-row]',
		item: '[data-item]',
		split: '[data-split-item]'
	},

	CONST: {
		NUMBER_DISPLAY_IMAGES: 18
	},

	bindEvents: function () {
		$(window).on('resize', this.getDimensions.bind(this));
	},

	getImages: function () {
	    	
    	var self = this;
		
		$.ajax({
            dataType: 'jsonp',
            jsonp: 'callback',
            url: 'http://localhost:8080/images?callback=?',                     
            success: function(data) {
	            if (data.images && data.images.length > 0) {
		    		self.renderImages(data);
		    	} else {
		    		alert('Error with API.');
		    	}
            }
        });
        
	},

	renderImages: function (data) {
		
		var $gridContainer = $(this.selectors.grid),
			self = this;

		this.images = $.extend({}, data.images);
		
		$.each(this.images, function(i, item) {
			
			if (i < self.CONST.NUMBER_DISPLAY_IMAGES) {
				$(self.panels[i]).css("background-image","url(" + item + ")");
				$(self.panels[i]).attr('id', i);
			} else {
				return;
			}

		});

		this.initBackgroundImageLoadedCheck();

	},

	initBackgroundImageLoadedCheck: function () {
		
		var startTime = new Date().getTime();
		var self = this;
		var count = 0;

		// uses basic image preloder plugin
		$('.split-level').bgLoaded({
			afterAllLoaded: function () {
				self.transitionImagesIn();
			}
		});

	},

	transitionImagesIn: function () {

		var count = -1,
			self = this;

		var revealImages = setInterval(function () {

			count++;

			if (count < self.CONST.NUMBER_DISPLAY_IMAGES) {
			
				$(self.panels[count]).addClass('bg-loaded');
				console.log(count);

			} else if (count == self.CONST.NUMBER_DISPLAY_IMAGES) {
				
				console.log('clearInterval:', count);
				clearInterval(revealImages);

			}

			if (count === self.CONST.NUMBER_DISPLAY_IMAGES) {
				console.log('start transitioning in other images');
				self.startImageTransitions();
			}

		}, 150);

	},	

	transitionImagesOut: function () {

		var count = -1,
			self = this;

		$('body').removeClass('loaded');

		var revealImages = setInterval(function () {

			count++;

			if (count < self.CONST.NUMBER_DISPLAY_IMAGES) {
			
				$(self.panels[count]).removeClass('bg-loaded');
				console.log(count);

			} else if (count == self.CONST.NUMBER_DISPLAY_IMAGES) {
				
				console.log('clearInterval:', count);
				clearInterval(revealImages);

			}

			if (count === self.CONST.NUMBER_DISPLAY_IMAGES) {
				console.log('start transitioning in other images');
				self.getImages(); 
			}

		}, 150);

	},		

	startImageTransitions: function () {
		
		var numberOfImages = Object.keys(this.images).length,
			imageCollectionPosition = this.CONST.NUMBER_DISPLAY_IMAGES-1,
			parseImages,
			self = this,
			domPos;

		$('body').addClass('loaded');

		parseImages = setInterval(function () {
			
			if (numberOfImages > self.CONST.NUMBER_DISPLAY_IMAGES && imageCollectionPosition < numberOfImages) {
				
				imageCollectionPosition++;

				domPos = Math.floor(Math.random() * self.CONST.NUMBER_DISPLAY_IMAGES) + 0;

				$(self.panels[domPos]).removeClass('bg-loaded');
				
				setTimeout(function() {
					$(self.panels[domPos]).css("background-image", "url(" + self.images[imageCollectionPosition-1] + ")").addClass('bg-loaded');
				}, 2000);
	
			} else if (imageCollectionPosition === numberOfImages) {
				// once all images have been displayed get a fresh set of image data
				clearInterval(parseImages);
				self.transitionImagesOut();
			}

		}, 5000);
		
		// if the number of images retrieved is less than the base display 
		// amount of 18 poll for new images after 30 seconds
		setTimeout(function () {
			if (numberOfImages <= self.CONST.NUMBER_DISPLAY_IMAGES) {
				clearInterval(parseImages);
				self.transitionImagesOut();
			}
		}, 5000);
		
	},

	getFreshImagesSet: function () {

	},

	randomise: function () {
		
		var $elements = $('.split-level');

		// get all DOM elements in temporary array
		var temp = $elements.get();

		// randomize that array
		temp = temp.sort(function() {
		    return Math.round( Math.random() ) - 0.5;
		});

		// iterate the randomized array
		// while "$elements" and "temp" have the same length
		// each index of "$elements" will be overridden
		temp.forEach(function( element, index ) {
		    // and update the jQuery object
		    $elements[ index ] = element;
		});

		return $elements;

	},

	getDimensions: function () {

		var docEle = document.documentElement;

		var dimensions = {
			rowWidth: docEle.clientWidth,
			rowHeight: docEle.clientHeight / 3,
			itemWidth: docEle.clientWidth / 3,
			itemHeight: docEle.clientHeight / 3,
			splitWidth: (docEle.clientWidth / 3) / 2,
			splitHeight: docEle.clientHeight / 3
		};

		this.setDimensions(dimensions);

	},

	setDimensions: function (dimensions) {

		var $gridContainer = $(this.selectors.grid),
			$rows = $gridContainer.find(this.selectors.row),
			$items = $gridContainer.find(this.selectors.item),
			$splits = $gridContainer.find(this.selectors.split);

		$rows.css({
			width: dimensions.rowWidth,
			height: dimensions.rowHeight
		});
		
		$items.css({
			width: dimensions.itemWidth,
			height: dimensions.itemHeight
		});
		
		$splits.css({
			width: dimensions.splitWidth,
			height: dimensions.splitHeight
		});

	}

};

module.exports = showRoom;