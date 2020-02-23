
var express = require('express');
var crawlerQueue = require('../public/javascripts/crawlerQueue');
var router = express.Router();
var log4js = require('../public/javascripts/log/log4jConfig');
var infoLog = log4js.getLogger('infoLog');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



/*爬页面请求*/
router.post('/crawl', (req, res) => {
  const url = req.body.url;
  if(url){
    // infoLog.info("url = ", url);
    crawlerQueue.push(url,result => {
      if("爬不到网页" == result){
        res.json({ isOk: false, message: '爬不到网页', item: null });
      }else{
        res.json({ isOk: true, message: '爬取成功', item: result });
      }
    });
 
  }else{
    res.json({ isOk: false, message: 'url为空', item: null });
  }
  
})


module.exports = router;
