
export function timeDate(date){
      var date = new Date(date);
      var Y,M,D,h,m,s;
      Y = date.getFullYear()+ '-';
      M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      D = date.getDate()+" ";
      h = date.getHours()+':';
      m = date.getMinutes()+':';
      s = date.getSeconds()<10?"0":date.getSeconds();
     return Y+M+D+h+m+s;
}