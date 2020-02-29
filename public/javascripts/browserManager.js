const puppeteer = require('puppeteer');
const appConfig = require('../../config/config');
const log4js = require('./util/log4jUtil');
const dateUtil = require('./util/dateUtil');
const schedule = require('node-schedule');

const infoLog = log4js.getLogger('infoLog');

const launchOptions = appConfig.launchOptions;

const MAX_BROWSER = appConfig.MAX_BROWSER == 0 ? 3 : appConfig.MAX_BROWSER;  //启动几个浏览器 
const BROWSER_ARRAY = [];
init();
function init(){
	(async () => {
		for(var i = 0;i < MAX_BROWSER;i++){
            let browser = await puppeteer.launch(launchOptions);
            infoLog.info("browser create",browser.wsEndpoint());
            browser.useCount = 0
			BROWSER_ARRAY[i] = browser;
		}
		console.log(BROWSER_ARRAY);
	})();	
}

startSchedule();//开启定时任务

//0 0 0/1 * * ? 
function startSchedule() {
    schedule.scheduleJob('0 * * * * *', function () {
        //定时执行的代码
        infoLog.info("服务器进程存在...", dateUtil.formatDate(new Date()));
        for(var i = 0;i < MAX_BROWSER;i++){
            let browser =  BROWSER_ARRAY[i] ;
            if(browser.useCount >= appConfig.maxCrawlerCount){
                puppeteer.launch(launchOptions).then(newBrowser => {
                    infoLog.info("browser create",newBrowser.wsEndpoint());
                    newBrowser.useCount = 0
                    BROWSER_ARRAY.splice(i,1,newBrowser);
                });
                
            }
		}
    });
}
const browserPool = {};
browserPool.acquire = function(){
    return new Promise((resolve,reject) => {
        let browser = BROWSER_ARRAY.pop();
        
        if(browser){
            BROWSER_ARRAY.push(browser)
            resolve(browser);
        }else{
            reject("获取到的浏览器为空");
        }
    })
}
module.exports = browserPool;
