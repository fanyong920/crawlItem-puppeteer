
const puppeteer = require('puppeteer');
const broswerQueue  = require('./BrowserCreater');
const log4js = require('./log/log4jConfig');
const errorLog = log4js.getLogger('errorLog');

puppeteerCrawler = {
    crawlerPage: function (url) {
        return new Promise((resolve, reject) => {
            broswerQueue.push(true,wse=>{
                if(wse){
                    // console.log("从数组WSE_LIST中取出一个browserWSEndpoint，剩余" + WSE_LIST.length + "个browserWSEndpoint");
                    let browserWSEndpoint = wse.browserWSEndpoint 
                    puppeteer.connect({browserWSEndpoint }).then(browser => {
                    browser.newPage().then(page => {
                        // page.setDefaultNavigationTimeout(6000);
                        page.setRequestInterception(true).then(() => {
                            page.on('request', interceptedRequest => {
                                if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg') || interceptedRequest.url().indexOf('login') > -1)
                                    interceptedRequest.abort();
                                else
                                    interceptedRequest.continue();
                            });
    
    
                            page.goto(url, {
                                timeout: 10000,
                                waitUntil: ['domcontentloaded']
                            }).then(page2 => {
                                page.content().then(content => {
                                    if (content) {
                                        resolve(content)
                                    } else {
                                        resolve("爬不到网页");
                                    }
                                    if (!page.isClosed()) {
                                        page.close();
                                    }
                                })
                            }).catch(error => {
                                resolve("爬不到网页");
                                errorLog.error("TimeoutError: Navigation timeout of 6000 ms exceeded",error);
                                if (!page.isClosed()) {
                                    page.close();
                                }
                            })
    
                        });
    
    
                    })
    
                }).catch(error => {
                    resolve("爬不到网页");
                    errorLog.error("connect出错：",error);
                    
                })
                // WSE_LIST.push(wse);
                // console.log("中回收一个browserWSEndpoint到数组WSE_LIST，现有" + WSE_LIST.length + "个browserWSEndpoint");
                }else{
                    resolve("爬不到网页");
                    errorLog.error('获取browserWSEndpoint为空');
                }
            })
        })
    }
}
module.exports = puppeteerCrawler