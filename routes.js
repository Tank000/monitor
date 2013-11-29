var main = require('./routes/main');
var index = require('./routes/index');

exports = module.exports = function(app) {
  // app.all('*', index.check);
  app.get('/', main.list);
  app.get('/monitor/now' ,  main.now);
  app.get('/monitor/data' ,  main.data);
  app.get('/monitor/:time' ,  main.one);
  // app.get('/monitor/year' ,  main.year);
};