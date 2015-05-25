var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

var _img = require('./libs/img');
var _tmpls = require('./libs/img');


// view engine setup
//app.set('port', process.env.PORT || 3000);
app.set("views", path.join(__dirname, "/views"));
app.engine('html', require('hbs').__express);
app.set('view engine', 'html');


// var hbs = require('hbs');
// hbs.registerPartials(path.join(__dirname + '/views/partials'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev')); //加载日志中间件
app.use(bodyParser.json()); //加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: false })); //加载解析urlencoded请求体的中间件
app.use(cookieParser()); //加载解析cookie的中间件
app.use(express.static(path.join(__dirname, 'public'))); //设置public文件夹为存放静态文件的目录
app.use('/demos',express.static(path.join(__dirname, 'demos')));

routes(app);

app.listen(app.get('port'), function() {
  console.log('The server listening on port' + app.get('port'));
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

_img();
_tmpls();

module.exports = app; //导出app实例供其他模块调用。
