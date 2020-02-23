const async = require('async');
const puppeteer = require('puppeteer');
const appConfig = require('../../config/config');
const log4js = require('./log/log4jConfig');
const infoLog = log4js.getLogger('infoLog');
const maxCrawlerCount = (appConfig.maxCrawlerCount && appConfig.maxCrawlerCount == 0) ?150:appConfig.maxCrawlerCount;

// import async from 'async';
// import puppeteer from 'puppeteer';

const MAX_WSE = appConfig.MAX_WSE == 0 ? 3:appConfig.MAX_WSE;  //启动几个浏览器 
const WSE_LIST = []; //存储browserWSEndpoint列表
initBrowser();
/**
 * 初始化browser
 * @param {创建broswer数量} num 
 */
function initBrowser(num) {
    (async () => {
        let creatCount = 0 ;
        if(num && num != 0){
            creatCount = num;
        }else{
            creatCount = MAX_WSE;
        }
        for (var i = 0; i < creatCount; i++) {
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox', '--disable-setuid-sandbox','–-disable-gpu' , '--use-gl=swiftshader', '--disable-gl-drawing-for-tests','--blik-settings=doHtmlPreloadScanning=false'
                ]
            })
            let wseObject = {};
            browserWSEndpoint = await browser.wsEndpoint();
            wseObject.browserWSEndpoint = browserWSEndpoint;
            wseObject.crawlerCount = 0;
            if(WSE_LIST.length < MAX_WSE){
                WSE_LIST.push(wseObject);
            }
        }
        infoLog.info(WSE_LIST);
    })();
}
/**
 * 获取一个BrowserWSEndpoint
 */
getBrowserWSEndpoint= function () {
    return new Promise(resolve => {
        let needLanchCount = 0;
        if(WSE_LIST && WSE_LIST.length > 0 ){
            for(let i =0; i < WSE_LIST.length;i++){
                let wseObject = WSE_LIST[i];
                if(wseObject){
                    if(wseObject.crawlerCount > maxCrawlerCount){
                        WSE_LIST.splice(i,1);
                        infoLog.info("browser数组WSE_LIST中第"+i+"个已使用超过2"+maxCrawlerCount+"次，将其删除")
                        if(i == WSE_LIST.length-1){
                            
                        }else{
                            i--;
                        }
                        needLanchCount++;
                        continue;
                    }else{
                        wseObject.crawlerCount = wseObject.crawlerCount + 1;
                        resolve(wseObject);
                        break;
                    }
                }else{
                    WSE_LIST.splice(i,1);
                    if(i == WSE_LIST.length-1){
                            
                    }else{
                        i--;
                    }
                    needLanchCount++;
                    continue;
                }
               }
        }else{
            initBrowser().then(() => {
                resolve(WSE_LIST[0]);
            });
            
        }
        
        if(needLanchCount != 0){
            infoLog.info("browser数组WSE_LIST中将新建"+needLanchCount+"个browser")
            initBrowser(needLanchCount);
        }
    })
}
 /**
*队列
    * @param obj ：obj对象 
      * @param callback ：回调函数
    */
const broswerQueue = async.queue(function (wseReq, callback) {
        // 需要执行的代码的回调函数
        getBrowserWSEndpoint().then(wse => {
            if(typeof callback === 'function'){
                callback(wse);
            }
        });
}, appConfig.parallelBrowser && appConfig.parallelBrowser == 0 ? 1 : appConfig.parallelBrowser);

// worker数量将用完时，会调用saturated函数
broswerQueue.saturated = function() { 
    infoLog.info('all workers to be used'); 
}
 
// 当最后一个任务交给worker执行时，会调用empty函数
broswerQueue.empty = function() { 
    infoLog.info('no more tasks wating'); 
}
 
// 当所有任务都执行完时，会调用drain函数
broswerQueue.drain = function() { 
    infoLog.info('all tasks have been processed'); 
}
module.exports =  broswerQueue;