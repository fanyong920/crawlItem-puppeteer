const async = require('async');
const crawler = require('./puppeteerCrawler')
const appConfig = require('../../config/config');
const log4js = require('./log/log4jConfig');
const infoLog = log4js.getLogger('infoLog');
const errorLog = log4js.getLogger('errorLog');
 /**
      *队列
      * @param obj ：obj对象 包含执行时间
      * @param callback ：回调函数
    */
const crawlerQueue = async.queue(function (url, callback) {
        // 需要执行的代码的回调函数
        crawler.crawlerPage(url).then(res => {
            if(typeof callback === 'function'){
                callback(res);
            }
        }).catch(error => {
            errorLog.error(error);
        })
}, appConfig.parallelCrawler && appConfig.parallelCrawler == 0 ? 3 : appConfig.parallelCrawler);

// worker数量将用完时，会调用saturated函数
crawlerQueue.saturated = function() { 
    infoLog.info('all workers to be used'); 
}
 
// 当最后一个任务交给worker执行时，会调用empty函数
crawlerQueue.empty = function() { 
    infoLog.info('no more tasks wating'); 
}
 
// 当所有任务都执行完时，会调用drain函数
crawlerQueue.drain = function() { 
    infoLog.info('all tasks have been processed'); 
}
module.exports =  crawlerQueue;