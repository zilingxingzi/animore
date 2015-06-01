var path = require('path');
var fs = require('fs');

module.exports = function(app) {
	app.get('/', function(req, res) {
	  res.render('index');
	});

	// app.get('/api/getDemoList', function(req, res) {
	// 	var tmpls = scanFolder(path.join(__dirname, '/../demos/tmpls'), '.html') || [];
	// 	var gifs = scanFolder(path.join(__dirname, '/../demos/gifs'), '.png') || [];
	// 	if(tmpls || gifs) {
	// 		return res.json({
	// 			info: {
	// 				ok: true,
	// 				msg: null
	// 			},
	// 			data: {
	// 				'tmpls': tmpls,
	// 				'gifs': gifs
	// 			}
	// 		});
	// 	}else {
	// 		return res.json({
	// 			info: {
	// 				ok: true
	// 			}
	// 		});
	// 	}

	// 	 function scanFolder(src, filter){
	// 	    var fileList = [];
	// 	    var folderList = [];
	// 	    var walk = function(src, fileList, folderList){
	//             files = fs.readdirSync(src);
	//             files.forEach(function(item) {  
	//                 var tmpPath = src + '/' + item,
	//                     stats = fs.statSync(tmpPath);
	//                 var dirname = path.dirname(__dirname);

	//                 if (stats.isDirectory()) {  
	//                     walk(tmpPath, fileList, folderList); 
	//                     folderList.push(tmpPath.replace(dirname, '')); 
	//                 } else {  
	//                     fileList.push(tmpPath.replace(dirname, '')); 
	//                 }  
	//             });  
	//         };  

	// 	    walk(src, fileList, folderList);

	// 	    console.log('扫描' + src +'成功');
	// 	    if(filter) {
	// 		    var reg = new RegExp(filter);
	// 		    var list = [];
	// 		    fileList.forEach(function(item) {
	// 		    	if(reg.test(item)) {
	// 		    		if(filter == '.html') {
	// 		    			var previewPng = item.replace(filter, '.png');
	// 		    			var previewGif = item.replace(filter, '.png');
	// 		    			if(fs.existsSync(path.join(__dirname, '..', previewPng))) {
	// 		    				list.push(previewPng);
	// 		    			}else if(fs.existsSync(path.join(__dirname, '..', previewGif))) {
	// 		    				list.push(previewGif);
	// 		    			}
	// 		    		}else {
	// 		    			list.push(item);
	// 		    		}
	// 		    	}
			    		
	// 		    });
	// 		    return list;
	// 	    }
	// 	    return fileList;
	// 	}

	// });

};