
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , partials = require('express-partials')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({'secret':'@#$%^*(DJU&DH@V#!hdda'}));
app.use(app.router);
// app.use(express.cookieSession());
app.use(logErrors);
app.use(function(req,res,next){
    return res.status(404).render('error',{ error: '404' })
}) 
app.use(clientErrorHandler);
app.use(errorHandler);

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

routes(app)



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
