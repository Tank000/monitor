var conf    = require('../config').conf;
var db      = require('mongoskin').db(conf.url,conf.option);

exports.origin         = db.collection('origin');
exports.day          = db.collection('day_5s');
exports.host          = db.collection('host');
exports.month         = db.collection('month_300s');
exports.year         = db.collection('year_3600s');

exports.toId         = db.ObjectID.createFromHexString;
exports.generateId   = function (time){return new db.ObjectID(time);}

process.on('SIGINT', function() {
  console.log('Recieve SIGINT');
  db.close(function(){
     console.log('database has closed');
		process.exit()
  })
})