require(['jquery', 'cbpGridGallery'], function($, cbpGridGallery) {
	// 读取node返回的接口
	// $.ajax({
	// 	type: 'GET',
	// 	url: '/api/getDemoList',
	// 	success: function(res) {
	// 		if(res.info.ok) {
	// 			var gifs = res.data.gifs || [];
	// 			var tmpls = res.data.tmpls || [];
				
 //    			aniList(concatStr(gifs, 'gif') + concatStr(tmpls, 'tmpl'), gifs.length + tmpls.length);
	// 		}
	// 	},
	// 	error: function(req, msg, obj) {
	// 		console.log(req, msg, obj);
	// 	}
	// });
	$.get('./api/getDemoList.html', function(result) {
		result = JSON.parse(result);
		var gifs = result.data.gifs || [];
		var tmpls = result.data.tmpls || [];
 		aniList(concatStr(gifs, 'gif') + concatStr(tmpls, 'tmpl'), gifs.length + tmpls.length);
	});

    //菜单栏切换
	jQuery.extend(jQuery.easing, {
		easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        }
	});


	var _old;
	$('#J_menu')
	.delegate('li', 'mouseenter', function(e) {
        highlightMenuItem($(this).children('a'));
        $(this).addClass('hover');
	})
	.delegate('li', 'mouseleave', function(e) {
        $(this).removeClass('hover');
	})
	.delegate('li', 'click', function(e) {
		if(_old) {
			_old.removeClass('active');
		}else {
			$('#J_menu .active').removeClass('active');
		}
		$(this).addClass('active');
		_old = $(this);
	});


	function highlightMenuItem ($item) {
        $('.nav-pointer').stop().animate({ top: $item.position().top + 6 }, 500, 'easeOutBack');
        $('.nav-pointer').find('.pointer-left').stop().animate({left: $item.position().left - 20}, 500);
        $('.nav-pointer').find('.pointer-right').stop().animate({left: $item.position().left + $item.width() + 20}, 500);
    }

    function concatStr(list, type) {
    	var str = '';
		var len = list.length;
    	for(var i = 0; i < len; i++) {
			var item = list[i];
			// if(item.match(/.html$/)) {

			// 	str += '<li><figure style="overflow-y:auto;" id="J_grid_list' + i + '"></figure></li>';
			// 	//tmplsList.push(i);
			// }else 
			if(item.match(/.png$/)) {
				if(type == 'gif') {
					str += '<li><figure style=""><img data-type="gif" src=".' + list[i] + '"><div class="layer"><div class="detail"><p class="title">点击查看大图</p><div class="line"></div><p class="text">设计：辉达</p><p class="text">开发：麦梓</p></div></div></figure><a href="javascript:void(0);" class="gifBtn"><span class="inner"><span class="btn-bg"></span><span class="text">GIF</span><i class="gifBtn-icon"></i></span></a></li>';

				}else if(type == 'tmpl') {
					str += '<li><figure style="overflow:inherit;"><img data-type="tmpl" src=".' + list[i] + '"><div class="layer animated pulse"><div class="detail"><p class="title">点击查看大图</p><div class="line"></div><p class="text">设计：辉达</p><p class="text">开发：麦梓</p></div></div></figure></li>';

				}
				
			}
		}
		return str;
    }
		
	function aniList(str, len) {
		var node = $('#grid');
		var j = 0;
		//var tmplsList = [];
		

		node.append('<li class="grid-sizer"></li>' + str);
		
		// $.each(tmplsList, function(index, item) {
		// 	$('#J_grid_list' + item).load(pageList[item] + ' .container', function() {
			
		// 		j++;
		// 		var jsUrl = $(this).children('.container').attr('jsUrl') || '';
		// 		if(jsUrl) {
		// 			$.get('tmpl/' + jsUrl + '.js');
		// 		}
		// 		//$(this).children('.container')[0].style.cssText = '';
		// 		$(this).children('.container').attr('class', 'ctnr');

		// 		newList(j, len);
				
		// 	});
		// });
		$("img", node).on('load', function() {
	  		j++;
	  		newList(j, len);
		});

		function newList() {
			if(j == len) {
				new CBPGridGallery( document.getElementById( 'grid-gallery' ) );
			}

		}

	}

});