const os = require('os');
const log4js = require('../public/javascripts/util/log4jUtil')
const infoLog = log4js.getLogger('infoLog');
const num = (os.cpus().length)*2 + 1;
infoLog.log("系统将配置爬网页的并发数："+num);
var appConfig ={
    MAX_BROWSER:3,//大考的浏览器实例
    parallelCrawler:num,//同时打开几个网页
    maxCrawlerCount:1000,//一个网页打开多少个网页后关闭
    launchOptions:
    {
        headless: true,
        args: [
            '--no-sandbox', '--disable-setuid-sandbox', '–-disable-gpu', '--use-gl=swiftshader', '--disable-gl-drawing-for-tests', '--blik-settings=doHtmlPreloadScanning=false'
        ],
        ignoreDefaultArgs: ["--enable-automation"]
        // executablePath:"C:\\Users\\10230\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"
    }
}

module.exports =  appConfig;