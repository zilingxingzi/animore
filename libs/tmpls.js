var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var path = require('path');

// resize and remove EXIF profile data

module.exports = function () {
	console.log('-----------------开始扫描-----------------')
	var tmpls = scanFolder(path.join(__dirname, '/../demos/tmpls'), '.html') || [];
	var gifs = scanFolder(path.join(__dirname, '/../demos/gifs'), '.png') || [];
	if(tmpls || gifs) {

		fs.writeFileSync(path.join(__dirname, '/../api/getDemoList.html'),JSON.stringify({
			info: {
				ok: true,
				msg: null
			},
			data: {
				'tmpls': tmpls,
				'gifs': gifs
			}
		}), 'utf-8');
		console.log('-----------------扫描成功-----------------')
	}else {
		console.log('-----------------待扫描目录不存在或为空-----------------')
	}

	function scanFolder(src, filter){
	    var fileList = [];
	    var folderList = [];
	    var walk = function(src, fileList, folderList){
            files = fs.readdirSync(src);
            files.forEach(function(item) {  
                var tmpPath = src + '/' + item,
                    stats = fs.statSync(tmpPath);
                var dirname = path.dirname(__dirname);

                if (stats.isDirectory()) {  
                    walk(tmpPath, fileList, folderList); 
                    folderList.push(tmpPath.replace(dirname, '')); 
                } else {  
                    fileList.push(tmpPath.replace(dirname, '')); 
                }  
            });  
        };  

	    walk(src, fileList, folderList);

	    console.log('扫描' + src +'成功');
	    if(filter) {
		    var reg = new RegExp(filter);
		    var list = [];
		    fileList.forEach(function(item) {
		    	if(reg.test(item)) {
		    		if(filter == '.html') {
		    			var previewPng = item.replace(filter, '.png');
		    			var previewGif = item.replace(filter, '.png');
		    			if(fs.existsSync(path.join(__dirname, '..', previewPng))) {
		    				list.push(previewPng);
		    			}else if(fs.existsSync(path.join(__dirname, '..', previewGif))) {
		    				list.push(previewGif);
		    			}
		    		}else {
		    			list.push(item);
		    		}
		    	}
		    		
		    });
		    return list;
	    }
	    return fileList;
	}
};