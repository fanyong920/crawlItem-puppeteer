
var express = require('express');
var crawlerQueue = require('../public/javascripts/crawlerQueue');
var router = express.Router();
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
      if(!result.isSuccess){
        res.json({ isOk: false, message: result.message, item: null });
      }else{
        res.json({ isOk: true, message: '爬取成功', item: result.message });
      }
    });
 
  }else{
    res.json({ isOk: false, message: 'url为空', item: null });
  }
  
})


module.exports = router;
