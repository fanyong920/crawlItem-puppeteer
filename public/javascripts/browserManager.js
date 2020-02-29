const puppeteer = require('puppeteer');
const genericPool = require('generic-pool');
const appConfig = require('../../config/config');
const log4js = require('./util/log4jUtil');
const dateUtil = require('./util/dateUtil');
const schedule = require('node-schedule');

const infoLog = log4js.getLogger('infoLog');
const errorLog = log4js.getLogger('errorLog');
const maxCrawlerCount = (appConfig.maxCrawlerCount && appConfig.maxCrawlerCount == 0) ? 500 : appConfig.maxCrawlerCount;

const launchOptions = appConfig.launchOptions;

const MAX_BROWSER = appConfig.MAX_BROWSER == 0 ? 3 : appConfig.MAX_BROWSER;  //启动几个浏览器 

const factory = {
    create: () =>
        puppeteer.launch(launchOptions).then(browser => {
            // 创建一个 puppeteer 实例 ，并且初始化使用次数为 0
            infoLog.info("browser create:",browser.wsEndpoint())
            browser.useCount = 0
            return browser
        }),
    destroy: browser => {
        setTimeout(function(){
            browser.close()
            infoLog.info("browser close:",browser.wsEndpoint())
        },2000)
        
    }
}
const config = {
    max: MAX_BROWSER,
    min: MAX_BROWSER,
    testOnBorrow: false,
    acquireTimeoutMillis: 30000,
    fifo: false,
    autostart: true,
    evictionRunIntervalMillis: 500000,
    idleTimeoutMillis: 3600000
}

const pool = genericPool.createPool(factory, config)

// pool.use = fn => {
//     let resource
//     return pool.acquire().then(r => {
//         resource = r
//         resource.useCount += 1
//         pool.release(resource)
//         return resource
//     }).then(fn).then(result => {
//         // 不管业务方使用实例成功与后都表示一下实例消费完成
//         console.log("resource.useCount",resource.useCount)
//         if(resource.useCount >= maxCrawlerCount){
//             console.log("pool.size",pool.size)
//             if(pool.size >= 1){
//                 pool.destroy(resource)
//             }
//         }
//         return result
//     }, err => {
//         throw err
//     }
//     )
// }

pool.on('factoryCreateError', function (err) {
    errorLog.error('factoryCreateError:', err);
})

pool.on('factoryDestroyError', function (err) {
    errorLog.error('factoryDestroyError:', err);
})
// Destroying the pool:
// pool.drain().then(() => pool.clear())

startSchedule();//开启定时任务

//0 0 0/1 * * ? 
function startSchedule() {
    schedule.scheduleJob('0 * * * * *', function () {
        //定时执行的代码
        infoLog.info("服务器进程存在...", dateUtil.formatDate(new Date()));
    });
}

module.exports = pool;
