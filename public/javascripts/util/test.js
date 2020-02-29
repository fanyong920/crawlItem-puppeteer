const async = require('async');
const crawlerQueue = async.queue(function (time, callback) {
    // 需要执行的代码的回调函数
    setTimeout(function(){
        console.log("time:",time);
        if(typeof callback === 'function'){
            callback(true);
        }
    },time)
       
   
}, 3);

crawlerQueue.push(2000,res => {

})
crawlerQueue.push(5000,res => {
    
})
crawlerQueue.push(6000,res => {
    
})
crawlerQueue.push(2000,res => {
    
})
crawlerQueue.push(1000,res => {
    
})