
module.exports = {
    compareTimeWithInterval : function(date1,date2,interval){
        try {
            if(date1.getTime()-date2.getTime() >= interval*3600000){
                return true;
            }else{
                return false;
            }
        } catch (error) {
            return false;
        }    
        
    },
    formatDate : function(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
      }
}
