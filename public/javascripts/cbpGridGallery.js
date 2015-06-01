/**
 * cbpGridGallery.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
define(['jquery', 'masonry', 'classie'], function($, Masonry, classie){
	'use strict';
	var EMPTY = '';

	var docElem = window.document.documentElement,
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		support = {
			transitions : Modernizr.csstransitions,
			support3d : Modernizr.csstransforms3d
		};

	function setTransform( el, transformStr ) {
		el.style.WebkitTransform = transformStr;
		el.style.msTransform = transformStr;
		el.style.transform = transformStr;
	}

	// from http://responsejs.com/labs/dimensions/
	function getViewportW() {
		var client = docElem['clientWidth'],
			inner = window['innerWidth'];
		
		if( client < inner )
			return inner;
		else
			return client;
	}

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function CBPGridGallery( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
  		this._init();
	}

	CBPGridGallery.prototype.options = {
	};

	CBPGridGallery.prototype._init = function() {
		// main grid
		this.grid = this.el.querySelector( 'section.grid-wrap > ul.grid' );
		// main grid items
		this.gridItems = [].slice.call( this.grid.querySelectorAll( 'li:not(.grid-sizer)' ) );
		// items total
		this.itemsCount = this.gridItems.length;
		// slideshow grid
		this.slideshow = this.el.querySelector( 'section.slideshow > .slideWrapper' );
		// slideshow grid items
		this.slideshowItems = [].slice.call( this.slideshow.children );
		// index of current slideshow item
		this.current = -1;
		// slideshow control buttons
		this.ctrlPrev = this.el.querySelector( 'section.slideshow > nav > span.nav-prev' );
		this.ctrlNext = this.el.querySelector( 'section.slideshow > nav > span.nav-next' );
		this.ctrlClose = this.el.querySelector( 'section.slideshow > nav > span.nav-close' );
		// init masonry grid
		this._initMasonry();
		// init events
		this._initEvents();
	};

	CBPGridGallery.prototype._initMasonry = function() {
		var grid = this.grid;
		new Masonry( grid, {
			itemSelector: 'li',
			columnWidth: grid.querySelector( '.grid-sizer' )
		});
	};

	function HTMLEnCode(str){       
		var s = "";     
		if(str.length == 0) return "";      
		s = str.replace(/&/g, "&amp;");      
		s = s.replace(/</g, "&lt;");      
		s = s.replace(/>/g, "&gt;");       
		//s = s.replace(/  /g, "&nbsp; ");       
		return s; 
	}

	CBPGridGallery.prototype._initEvents = function() {
		var self = this;

		// open the slideshow when clicking on the main grid items
		self.gridItems.forEach( function( item, idx ) {
			
			$(item).children('figure').on('mouseenter', function(e) {
				var current = $(e.currentTarget);
				var layer = current.find('.layer');
				var n = e.offsetX || e.clientX - $(e.target).offset().left;
				var r = current.width() - n;
				var i = current.height() / $(e.target).height() * (e.offsetY || e.clientY - $(e.target).offset().top);
				var s = current.height() - i;
				layer.removeClass("hover left-in right-in top-in bottom-in left-out right-out top-out bottom-out");
				r < n && r < i && r < s ? layer.addClass("hover right-in") : i < s && i < n && i < r ? layer.addClass("hover top-in") : s < i && s < n && s < r ? layer.addClass("hover bottom-in") : layer.addClass("hover left-in");
				$(item).find('.gifBtn').hide(300);
			});
			$(item).children('figure').on('mouseleave', function(e) {
				var current = $(e.currentTarget);
				var layer = current.find('.layer');
				var n = e.offsetX || e.clientX - $(e.target).offset().left;
				var r = current.width() - n;
				var i = current.height() / $(e.target).height() * (e.offsetY || e.clientY - $(e.target).offset().top);
				var s = current.height() - i;
				layer.removeClass("hover left-in right-in top-in bottom-in left-out right-out top-out bottom-out");
				n < r && n < i && n < s ? layer.addClass("left-out") : i < s && i < n && i < r ? layer.addClass("top-out") : s < i && s < n && s < r ? layer.addClass("bottom-out") : layer.addClass("right-out")
				$(item).find('.gifBtn').show(300);
			});

			item.addEventListener( 'click', function(e) {
				var target = $(e.target);
				var current = $(e.currentTarget);
				var src = '';
				
				//gif图的播放相关事件
				if(target.hasClass('gifBtn') || target.parent('a').hasClass('gifBtn') || target.parent('span.inner').parent('a').hasClass('gifBtn')) {
					var btn = current.find('.gifBtn');
					var img = current.find('img');
					var oldSrc = img.attr('src');

					if(btn.hasClass('play')) {
						src = oldSrc.replace(/gif$/, 'png');
					}else {
						src = oldSrc.replace(/png$/, 'gif');
						btn.addClass('loading');
											
						img.on('load', function(e) {
							btn.removeClass('loading');
							if(btn.hasClass('play')) {
								btn.removeClass('play');
							}else {
								btn.addClass('play');
							}
						});
					}
					img.attr('src', src);
					return;

				}

				//点击查看详情事件
				var slideshow = self.slideshow;
				var img = current.find('img');
				src = img.attr('src');
				if(img.attr('data-type') == 'gif') {
					// gif图片的预览
					$(slideshow).parent('.slideshow').addClass('gifshow');
					src = src.replace(/png$/, 'gif');
					var designer = src.slice( src.lastIndexOf('/') +1, src.length -4);
					var num = designer.indexOf('-');
					if(num > 0 && num < 4) {
						designer = designer.slice(0, num);
					}else {
						designer = designer.slice(0, 2);
					}
					
					$(slideshow).html('<img src="' + src + '"><p class="slideBar">设计师：' + designer + '</p>');
					self.slideshowItems = [].slice.call( slideshow.children );
					self._openSlideshow( idx );
					return;

				} else if(img.attr('data-type') == 'tmpl') {
					// 有代码的预览

					$(slideshow).html('<iframe src="' + src.replace(/png$/, 'html') + '" frameborder="0" id="J_preview"></iframe>');
					
					$(slideshow).parent('.slideshow').removeClass('gifshow');
					self.slideshowItems = [].slice.call( slideshow.children );
					self._openSlideshow( idx );
					var codePanel = $('.codePanel', slideshow.nextElementSibling);
					var slideBar = $('.slideBar', slideshow.nextElementSibling);
					
					$('#J_preview')[0].onload = function() {
						var doc = $('#J_preview').prop('contentWindow').document;
						var ctnr = doc.getElementById('container');
						var width = ctnr.offsetWidth || '200';
						var height = ctnr.offsetHeight || '200';

						$('#J_preview').css({'width': width, 'height': height, 'margin-top': -height/2}).parent('div').css('min-height', height);
						
						codePanel.find('.html').html(HTMLEnCode(ctnr.innerHTML));
						codePanel.find('.css').html(doc.getElementsByTagName('style')[0].innerHTML);
						var jsStr = EMPTY;
						var jsNode = doc.getElementsByTagName('script');
						$.each(jsNode, function(index, item) {
							jsStr += item.innerHTML;
						});

						codePanel.find('.javascript').html(jsStr);
						
						require(['ace'], function() {
						    var editor = ace.edit("J_codePanel_html");
						    editor.setTheme("ace/theme/github");
						    editor.getSession().setMode("ace/mode/html");

						    var editor = ace.edit("J_codePanel_css");
						    editor.setTheme("ace/theme/github");
						    editor.getSession().setMode("ace/mode/css");

						    var editor = ace.edit("J_codePanel_javascript");
						    editor.setTheme("ace/theme/github");
						    editor.getSession().setMode("ace/mode/javascript");
						});

						slideBar.find('.designer').html(ctnr.getAttribute('designer'));
						slideBar.find('.developer').html(ctnr.getAttribute('developer'));
						slideBar.find('.browser').html(ctnr.getAttribute('browser'));

					};

				}
				
			} );
		} );


		//代码tab切换
		$('.slideshow .tab').delegate('.tab-i', 'click', function(e) {
			$('.slideshow .tab .active').removeClass('active');
			$(this).addClass('active');
			var codeList = $('.slideshow .codePanel .code-i');
			codeList.hide();
			var index = $(this).attr('index') || 0;
			$(codeList[index]).show();

		}).delegate('.tab-oper .run', 'click', function(e) {
			var html = ace.edit("J_codePanel_html").getValue() || EMPTY;
			var css = ace.edit("J_codePanel_css").getValue() || EMPTY;
			var js = ace.edit("J_codePanel_javascript").getValue() || EMPTY;
			
			var doc = $('#J_preview').prop('contentWindow').document;
			var ctnr = doc.getElementById('container');
			ctnr.innerHTML = html;
			doc.getElementsByTagName('style')[0].innerHTML = css;
			var jsNode = doc.getElementsByTagName('script');
			$.each(jsNode, function(index, item) {
				item.innerHTML = EMPTY;
			});
			var node = doc.createElement('script');
			var textNode = doc.createTextNode(js);
			node.appendChild(textNode);
			doc.body.appendChild(node);
		});

		// slideshow controls
		//this.ctrlPrev.addEventListener( 'click', function() { self._navigate( 'prev' ); } );
		//this.ctrlNext.addEventListener( 'click', function() { self._navigate( 'next' ); } );
		this.ctrlClose.addEventListener( 'click', function() { self._closeSlideshow(); } );

		// window resize
		window.addEventListener( 'resize', function() { self._resizeHandler(); } );

		// keyboard navigation events
		document.addEventListener( 'keydown', function( ev ) {
			if ( self.isSlideshowVisible ) {
				var keyCode = ev.keyCode || ev.which;

				switch (keyCode) {
					case 37:
						self._navigate( 'prev' );
						break;
					case 39:
						self._navigate( 'next' );
						break;
					case 27:
						self._closeSlideshow();
						break;
				}
			}
		} );

		// trick to prevent scrolling when slideshow is visible
		window.addEventListener( 'scroll', function() {
			if ( self.isSlideshowVisible ) {
				window.scrollTo( self.scrollPosition ? self.scrollPosition.x : 0, self.scrollPosition ? self.scrollPosition.y : 0 );
			}
			else {
				self.scrollPosition = { x : window.pageXOffset || docElem.scrollLeft, y : window.pageYOffset || docElem.scrollTop };
			}
		});
	};

	CBPGridGallery.prototype._openSlideshow = function( pos ) {
		this.isSlideshowVisible = true;
		this.current = pos;

		classie.addClass( this.el, 'slideshow-open' );

		/* position slideshow items */

		// set viewport items (current, next and previous)
		this._setViewportItems();
		
		// add class "current" and "show" to currentItem
		classie.addClass( this.currentItem, 'current' );
		classie.addClass( this.currentItem, 'show' );

		// add class show to next and previous items
		// position previous item on the left side and the next item on the right side
		if( this.prevItem ) {
			classie.addClass( this.prevItem, 'show' );
			var translateVal = Number( -1 * ( getViewportW() / 2 + this.prevItem.offsetWidth / 2 ) );
			setTransform( this.prevItem, support.support3d ? 'translate3d(' + translateVal + 'px, 0, -150px)' : 'translate(' + translateVal + 'px)' );
		}
		if( this.nextItem ) {
			classie.addClass( this.nextItem, 'show' );
			var translateVal = Number( getViewportW() / 2 + this.nextItem.offsetWidth / 2 );
			setTransform( this.nextItem, support.support3d ? 'translate3d(' + translateVal + 'px, 0, -150px)' : 'translate(' + translateVal + 'px)' );
		}
	};

	CBPGridGallery.prototype._navigate = function( dir ) {
		if( this.isAnimating ) return;
		if( dir === 'next' && this.current === this.itemsCount - 1 ||  dir === 'prev' && this.current === 0  ) {
			this._closeSlideshow();
			return;
		}

		this.isAnimating = true;
		
		// reset viewport items
		this._setViewportItems();

		var self = this,
			itemWidth = this.currentItem.offsetWidth,
			// positions for the centered/current item, both the side items and the incoming ones
			transformLeftStr = support.support3d ? 'translate3d(-' + Number( getViewportW() / 2 + itemWidth / 2 ) + 'px, 0, -150px)' : 'translate(-' + Number( getViewportW() / 2 + itemWidth / 2 ) + 'px)',
			transformRightStr = support.support3d ? 'translate3d(' + Number( getViewportW() / 2 + itemWidth / 2 ) + 'px, 0, -150px)' : 'translate(' + Number( getViewportW() / 2 + itemWidth / 2 ) + 'px)',
			transformCenterStr = EMPTY, transformOutStr, transformIncomingStr,
			// incoming item
			incomingItem;

		if( dir === 'next' ) {
			transformOutStr = support.support3d ? 'translate3d( -' + Number( (getViewportW() * 2) / 2 + itemWidth / 2 ) + 'px, 0, -150px )' : 'translate(-' + Number( (getViewportW() * 2) / 2 + itemWidth / 2 ) + 'px)';
			transformIncomingStr = support.support3d ? 'translate3d( ' + Number( (getViewportW() * 2) / 2 + itemWidth / 2 ) + 'px, 0, -150px )' : 'translate(' + Number( (getViewportW() * 2) / 2 + itemWidth / 2 ) + 'px)';
		}
		else {
			transformOutStr = support.support3d ? 'translate3d( ' + Number( (getViewportW() * 2) / 2 + itemWidth / 2 ) + 'px, 0, -150px )' : 'translate(' + Number( (getViewportW() * 2) / 2 + itemWidth / 2 ) + 'px)';
			transformIncomingStr = support.support3d ? 'translate3d( -' + Number( (getViewportW() * 2) / 2 + itemWidth / 2 ) + 'px, 0, -150px )' : 'translate(-' + Number( (getViewportW() * 2) / 2 + itemWidth / 2 ) + 'px)';
		}

		// remove class animatable from the slideshow grid (if it has already)
		classie.removeClass( self.slideshow, 'animatable' );

		if( dir === 'next' && this.current < this.itemsCount - 2 || dir === 'prev' && this.current > 1 ) {
			// we have an incoming item!
			incomingItem = this.slideshowItems[ dir === 'next' ? this.current + 2 : this.current - 2 ];
			setTransform( incomingItem, transformIncomingStr );
			classie.addClass( incomingItem, 'show' );
		}

		var slide = function() {
			// add class animatable to the slideshow grid
			classie.addClass( self.slideshow, 'animatable' );

			// overlays:
			classie.removeClass( self.currentItem, 'current' );
			var nextCurrent = dir === 'next' ? self.nextItem : self.prevItem;
			classie.addClass( nextCurrent, 'current' );

			setTransform( self.currentItem, dir === 'next' ? transformLeftStr : transformRightStr );

			if( self.nextItem ) {
				setTransform( self.nextItem, dir === 'next' ? transformCenterStr : transformOutStr );
			}

			if( self.prevItem ) {
				setTransform( self.prevItem, dir === 'next' ? transformOutStr : transformCenterStr );
			}

			if( incomingItem ) {
				setTransform( incomingItem, dir === 'next' ? transformRightStr : transformLeftStr );
			}

			var onEndTransitionFn = function( ev ) {
				if( support.transitions ) {
					if( ev.propertyName.indexOf( 'transform' ) === -1 ) return false;
					this.removeEventListener( transEndEventName, onEndTransitionFn );
				}

				if( self.prevItem && dir === 'next' ) {
					classie.removeClass( self.prevItem, 'show' );
				}
				else if( self.nextItem && dir === 'prev' ) {
					classie.removeClass( self.nextItem, 'show' );
				}

				if( dir === 'next' ) {
					self.prevItem = self.currentItem;
					self.currentItem = self.nextItem;
					if( incomingItem ) {
						self.nextItem = incomingItem;
					}
				}
				else {
					self.nextItem = self.currentItem;
					self.currentItem = self.prevItem;
					if( incomingItem ) {
						self.prevItem = incomingItem;
					}
				}

				self.current = dir === 'next' ? self.current + 1 : self.current - 1;
				self.isAnimating = false;
			};

			if( support.transitions ) {
				self.currentItem.addEventListener( transEndEventName, onEndTransitionFn );
			}
			else {
				onEndTransitionFn();
			}
		};

		setTimeout( slide, 25 );
	}

	CBPGridGallery.prototype._closeSlideshow = function( pos ) {
		// remove class slideshow-open from the grid gallery elem
		classie.removeClass( this.el, 'slideshow-open' );
		// remove class animatable from the slideshow grid
		classie.removeClass( this.slideshow, 'animatable' );

		var self = this,
			onEndTransitionFn = function( ev ) {
				if( support.transitions ) {
					if( ev.target.tagName.toLowerCase() !== 'div' ) return;
					this.removeEventListener( transEndEventName, onEndTransitionFn );
				}
				// remove classes show and current from the slideshow items
				classie.removeClass( self.currentItem, 'current' );
				classie.removeClass( self.currentItem, 'show' );
				
				if( self.prevItem ) {
					classie.removeClass( self.prevItem, 'show' );
				}
				if( self.nextItem ) {
					classie.removeClass( self.nextItem, 'show' );
				}

				// also reset any transforms for all the items
				self.slideshowItems.forEach( function( item ) { setTransform( item, EMPTY ); } );

				self.isSlideshowVisible = false;
			};

		if( support.transitions ) {
			this.el.addEventListener( transEndEventName, onEndTransitionFn );
		}
		else {
			onEndTransitionFn();
		}
	};

	CBPGridGallery.prototype._setViewportItems = function() {
		this.currentItem = null;
		this.prevItem = null;
		this.nextItem = null;

		/*if( this.current > 0 ) {
			this.prevItem = this.slideshowItems[ this.current - 1 ];
		}
		if( this.current < this.itemsCount - 1 ) {
			this.nextItem = this.slideshowItems[ this.current + 1 ];
		}*/
		this.currentItem = this.slideshowItems[0];

	}

	// taken from https://github.com/desandro/vanilla-masonry/blob/master/masonry.js by David DeSandro
	// original debounce by John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	CBPGridGallery.prototype._resizeHandler = function() {
		var self = this;
		function delayed() {
			self._resize();
			self._resizeTimeout = null;
		}
		if ( this._resizeTimeout ) {
			clearTimeout( this._resizeTimeout );
		}
		this._resizeTimeout = setTimeout( delayed, 50 );
	}

	CBPGridGallery.prototype._resize = function() {
		if ( this.isSlideshowVisible ) {
			// update width value
			if( this.prevItem ) {
				var translateVal = Number( -1 * ( getViewportW() / 2 + this.prevItem.offsetWidth / 2 ) );
				setTransform( this.prevItem, support.support3d ? 'translate3d(' + translateVal + 'px, 0, -150px)' : 'translate(' + translateVal + 'px)' );
			}
			if( this.nextItem ) {
				var translateVal = Number( getViewportW() / 2 + this.nextItem.offsetWidth / 2 );
				setTransform( this.nextItem, support.support3d ? 'translate3d(' + translateVal + 'px, 0, -150px)' : 'translate(' + translateVal + 'px)' );
			}
		}
	}

	// add to global namespace
	window.CBPGridGallery = CBPGridGallery;

});