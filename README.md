# crawlItem-puppeteer
通过puppeteer抓取网页内容
### 使用步骤
1. 把代码拉取下来
 ```javaScript
git https://github.com/fanyong920/crawlItem-puppeteer.git
```
2. 安装依赖
 ```javaScript
cnpm install //npm install
```
3. 启动项目
 ```javaScript
npm run start
```
`注意：还有另外一种启动方式：npm run pm2, 这种方式需要你先安装pm2 安装命令是npm install pm2 -g(全局安装) 不需要全局安装的话 把-g去掉`
### 说明
1.重要的配置文件：config.js
 ```javaScript
var appConfig ={
    MAX_WSE:3,//同时打开的浏览器实例，最好2个以上，如果设计一个的话，会导致不可控制的意外
    parallelCrawler:3,//同时打开几个网页
    parallelBrowser:1,//有多少个浏览器实例在工作
    maxCrawlerCount:1000,//指定一个浏览器打开多少个网页后关闭，然后重新启动另外一个浏览器实例
    launchOptions:
    {
        headless: false,
        args: [
            '--no-sandbox', '--disable-setuid-sandbox', '–-disable-gpu', '--use-gl=swiftshader', '--disable-gl-drawing-for-tests'
        ],
        ignoreDefaultArgs: ["--enable-automation"]
        // executablePath:"C:\\Users\\10230\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"
    }
}
module.exports =  appConfig;
```
2.该项目没有做界面，默认的端口是8082,默认提供了一个抓取网页的接口/crawl,其属于post请求，按照以下配置就能抓取到网页的页面内容
 ```javaScript
Content-Type:application/json
请求体：
{
    "url": "https://detail.tmall.com/item.htm?spm=a220o.1000855.w4023-21272238550.7.c8f34443QTZRqw&id=607562031325&sku_properties=122216443:6280099462"
}
```
### 网页速度
在1核2G的阿里云机器上测试，平均打开网页的耗时500ms,如果电脑配置高，速度会更快。
在加载网页的时候，我把图片，视频等多媒体资源都拦截了，所以会比平时打开网页快很多
