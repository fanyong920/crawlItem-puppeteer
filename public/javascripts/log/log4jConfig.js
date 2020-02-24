var log4js = require('log4js');
var path = require("path");
var basePath = path.resolve(__dirname, "../../../logs");
log4js.configure({
    appenders: {
      infoLog: { type: 'dateFile', filename: basePath+'/info.log',pattern: '.yyyy-MM-dd', compress: true },
      errorLog: { type: 'dateFile', filename: basePath+'/error.log',pattern: '.yyyy-MM-dd', compress: true },
    },
    categories: {
      infoLog: { appenders: ['infoLog'], level: 'info' },
      errorLog: { appenders: ['errorLog'], level: 'error' },
      default: { appenders: [ 'infoLog',"errorLog" ], level: 'info' }
    },
    daysToKeep:3,//保留3天日志
    alwaysIncludePattern: true,//在当前日志文件以及备份文件的名称中包含模式
    pm2:true,
    pm2InstanceVar:"INSTANCE_ID",
    disableClustering:true
  });
  


  //监控日志，当日志大量输入导致占用大量内存时暂时日志记录
  let paused = false;
  process.on("log4js:pause", (value) => paused = value);
  let infoLog = log4js.getLogger('infoLog');
  // while (!paused) {
  //   infoLog.info("I'm logging, but I will stop once we start buffering");
  // }
  module.exports = log4js