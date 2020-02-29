
// const puppeteer = require('puppeteer');
const broswerPool = require('./browserManager');
const log4js = require('./util/log4jUtil');
const errorLog = log4js.getLogger('errorLog');

puppeteerCrawler = {
    crawlerPage: function (url) {
        return new Promise((resolve) => {
            broswerPool.acquire().then(browser => {
                browser.useCount += 1;
                browser.newPage().then(page => {
                    page.setRequestInterception(true).then(() => {
                        page.on('request', interceptedRequest => {
                            if (interceptedRequest.url().endsWith('.js') || 
                                interceptedRequest.url().endsWith('.png') || 
                                interceptedRequest.url().endsWith('.jpg') || 
                                interceptedRequest.url().endsWith('.webp') || 
                                interceptedRequest.url().endsWith('.ico') || 
                                /* interceptedRequest.url().indexOf('login') > -1 || */ 
                                interceptedRequest.url().endsWith('.gif') || 
                                interceptedRequest.url().endsWith('.mp4') || 
                                interceptedRequest.url().endsWith('.svg') || 
                                interceptedRequest.url().endsWith('.jpeg')
                                || interceptedRequest.url().endsWith('.webm') || 
                                interceptedRequest.url().endsWith('.ogg') || 
                                interceptedRequest.url().endsWith('.mp3') || 
                                interceptedRequest.url().endsWith('.wav') || 
                                interceptedRequest.url().endsWith('.flac') || 
                                interceptedRequest.url().endsWith('.aac') || 
                                interceptedRequest.url().endsWith('.woff') || 
                                interceptedRequest.url().endsWith('.eot') || 
                                interceptedRequest.url().endsWith('.ttf') || 
                                interceptedRequest.url().endsWith('.otf')
                            )
                            // if (interceptedRequest.resourceType === 'image' || interceptedRequest.resourceType === 'font' || interceptedRequest.resourceType === 'script' || interceptedRequest.resourceType === 'media')
                                interceptedRequest.abort();
                            else
                                interceptedRequest.continue();
                        });
                        page.goto(url, {
                            timeout: 10000,
                            waitUntil: ['domcontentloaded']
                        }).then(() => {
                            page.content().then(content => {
                                if (!page.isClosed()) {
                                    page.close();
                                }
                                if (content) {
                                    resolve({ isSuccess: true, message: content });
                                }
                                else {
                                    resolve({ isSuccess: false, message: "爬到的网页内容为空" });
                                }
                            });
                        }).catch(error => {
                            errorLog.error("TimeoutError: Navigation timeout of 10000 ms exceeded", error);
                            if (!page.isClosed()) {
                                page.close();
                            }
                            resolve({ isSuccess: false, message: JSON.stringify(error) });
                        });
                    });
                });

            }).catch(error => {
                resolve({ isSuccess: false, message: JSON.stringify(error) });
            })

        })
    }
}
module.exports = puppeteerCrawler