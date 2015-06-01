var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var path = require('path');

// resize and remove EXIF profile data

module.exports = function () {
	var dir = path.join(__dirname, '/../demos/gif/');
	for(var i = 1; i <= 25; i++) {
		console.log(i, dir + i + '.gif[0]');
		gm(dir + i + '.gif[0]')
		.noProfile()
		.write((dir + i + '.png'), function (err) {
		  if (!err) console.log('done');
		});
	}
};
