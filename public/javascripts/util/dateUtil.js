
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
        
    }
}
