const async = require('async');
const crawler = require('./puppeteerCrawler')
const appConfig = require('../../config/config');
const log4js = require('./util/log4jUtil');
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

module.exports =  crawlerQueue;