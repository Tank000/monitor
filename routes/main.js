var toId        = require('../libs/mongodb').toId;
var db_day      = require('../libs/mongodb').day;
var db_month    = require('../libs/mongodb').month;
var db_year     = require('../libs/mongodb').year;
var db_host     = require('../libs/mongodb').host;
var dataConvert = require('../libs/utils').dataConvert;
var INFO        = require('../config').INFO;
var MetricMap   = require('../config').MetricMap;

exports.list = function(req, res,next){
  db_host.find().toArray(function (err,results) {
    if (err) return next(err);
    for (var i in results) {
      var cpu = results[i]['cpu'];
      results[i].host.machine_type =  INFO.machine_type[results[i].host.machine_type];
      results[i].host.os_name =  INFO.os_name[results[i].host.os_name];
      cpu['cpu_speed'] = dataConvert(1000, 2, cpu['cpu_speed']);
      var memory = results[i]['memory'];
      var disk = results[i]['disk'];
      if (disk['disk_total'] <= 0) {
        disk['disk_free'] = 0.00;
      } else {
        disk['disk_free'] = (disk['disk_free']/disk['disk_total']*100).toFixed(2);
      }
      disk.disk_total = dataConvert(1024, 0, disk.disk_total);
      if (disk['swap_total'] <= 0) {
        disk['swap_free'] = 0.00;
      } else {
        disk['swap_free'] = (disk['swap_free']/disk['swap_total']*100).toFixed(2);
      }
      var nio = results[i]['network'];
      nio['nio_bytes_in'] = dataConvert(1024, 0, nio['nio_bytes_in']);
      nio['nio_bytes_out'] = dataConvert(1024, 0, nio['nio_bytes_out']);
    }
    res.render('index', {hostArr:results,dataConvert:dataConvert});
  });
};


exports.one = function(req,res,next){
  var ip = req.query.ip;
  var time = req.params.time;
  var type = req.query.t;
  if(!ip) return next();
  var coll = null;
  var doc = {'agent':ip}
  if(time=='hour'){
    var now = parseInt(Date.now()/1000);
    doc['unixSecondsUTC'] = {'$gte': now - 3600}
    coll = db_day;
  }else if(time=='day'){
    var now = parseInt(Date.now()/1000);
    doc['unixSecondsUTC'] = {'$gte': now - 3600*24}
    coll = db_month;
  }else if(time=='month'){
    var now = parseInt(Date.now()/1000);
    doc['unixSecondsUTC'] = {'$gte': now - 3600*24*30}
    coll = db_year;
  }
  else return next();
  var need = {'unixSecondsUTC':1,'agent':1};
  if(type){
    if(type=='all') need = {'unixSecondsUTC':1,'disk':1,'memory':1,'cpu':1,'network':1,'agent':1};
    else if(type=='cpu'||type=='memory'||type=='disk'||type=='network') need[type] = 1; 
  }else{
    need = {'unixSecondsUTC':1,'disk':1,'memory':1,'cpu':1,'network':1,'agent':1};
  }
  
  coll.find(doc,need).toArray(function (err,results){
    if(err) return next(err);
    var dataHash = MetricMap();
    var timeArr = [];
    for(var x in results){
      for(var k in dataHash){
        group = dataHash[k]['group'];
        if(need[group]){
          if(x==0) dataHash[k]['data']= [];
          dataHash[k]['data'].push(results[x][group][k])
        }else{
          delete dataHash[k];
          continue;
        } 
      }
      timeArr.push(results[x].unixSecondsUTC);
    }
    
    res.render('graph/item', {dataHash:dataHash,timeArr:timeArr,ip:ip});
  })
}


exports.now = function(req,res,next){
  var ip = req.query.ip;
  if(!ip) return next();
  var doc = {'agent':ip}
  var now = parseInt(Date.now()/1000);
  doc['unixSecondsUTC'] = {'$gte': now - 600}
  var need = {'unixSecondsUTC':1,'agent':1,'cpu.cpu_load_one':1,
  'memory.mem_total':1,'memory.mem_free':1,'memory.mem_shared':1,
  'memory.mem_buffers':1,'memory.mem_cached':1,
  'disk.disk_bytes_read':1,'disk.disk_bytes_written':1,
  'network.nio_bytes_in':1,'network.nio_bytes_out':1};
  db_day.find(doc,need).toArray(function (err,results){
    if(err) return next(err);
    var dataHash = {
      'cpu_load_one':{'name':'每分钟负载','group':'cpu','data':[]},
      'mem_free':{'name':'空闲','group':'memory','data':[]},
      'mem_buffers':{'name':'Buffers','group':'memory','data':[]},
      'mem_cached':{'name':'Cached','group':'memory','data':[]},
      'disk_bytes_read':{'name':'磁盘每秒读取字节','group':'disk','data':[]},
      'disk_bytes_written':{'name':'磁盘每秒写入字节','group':'disk','data':[]},
      'nio_bytes_in':{'name':'网络每秒流入字节','group':'network','data':[]},
      'nio_bytes_out':{'name':'网络每秒流出字节','group':'network','data':[]},
    };
    for(var x in results){
      for(var k in dataHash){
        group = dataHash[k]['group'];
        dataHash[k]['data'].push([results[x].unixSecondsUTC,results[x][group][k]])
      }
    }
    if(results.length>0) req.session.lasttime = results[results.length-1].unixSecondsUTC;
    res.render('graph/now', {dataHash:dataHash,ip:ip});
  })
}

exports.data = function(req,res,next){
  var ip = req.query.ip;
  if(!ip) return next();
  var lasttime = req.session.lasttime;
  if(!lasttime||typeof(lasttime)!='number'){
    lasttime = parseInt(Date.now()/1000);
  }
  var doc = {'agent':ip}
  doc['unixSecondsUTC'] = {'$gte': lasttime}
  var need = {'unixSecondsUTC':1,'agent':1,'cpu.cpu_load_one':1,
  'memory.mem_total':1,'memory.mem_free':1,'memory.mem_shared':1,
  'memory.mem_buffers':1,'memory.mem_cached':1,
  'disk.disk_bytes_read':1,'disk.disk_bytes_written':1,
  'network.nio_bytes_in':1,'network.nio_bytes_out':1};
  db_day.find(doc,need).toArray(function (err,results){
    if(err) return next(err);
    var dataHash = {
      'cpu_load_one':{'name':'CPU每分钟负载','group':'cpu','data':[]},
      'mem_free':{'name':'内存空闲','group':'memory','data':[]},
      'mem_buffers':{'name':'内存 Buffers','group':'memory','data':[]},
      'mem_cached':{'name':'内存 Cached','group':'memory','data':[]},
      'disk_bytes_read':{'name':'磁盘每秒读取字节','group':'disk','data':[]},
      'disk_bytes_written':{'name':'磁盘每秒写入字节','group':'disk','data':[]},
      'nio_bytes_in':{'name':'网络每秒流入字节','group':'network','data':[]},
      'nio_bytes_out':{'name':'网络每秒流出字节','group':'network','data':[]},
    };
    for(var x in results){
      for(var k in dataHash){
        group = dataHash[k]['group'];
        dataHash[k]['data'].push([results[x].unixSecondsUTC,results[x][group][k]])
      }
    }
    if(results.length>0)req.session.lasttime =  results[results.length-1].unixSecondsUTC;
    res.send(dataHash);
  })
}



