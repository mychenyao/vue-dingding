
export var _this;

export function ths(_th){
  _this=_th;
}
//显示剩余时间 start
export function orderStatus(input){
  if (input === '07' || input === '05' || input === '01') {
    return true;
  } else {
    return false
  }
}
//显示剩余时间 end
//显示取消订单 start
export function cancel(input,serviceBeginTime) {
  if ((input === "03" || input === "04" || input === "05") && !serviceBeginTime) {   //通过状态判断显示取消按钮；
    return true;
  } else {
    return false;
  }
}
//显示取消订单 end

//显示确认付款 start
export function affirm(input){
  if(input==='12'||input==='16'|| input === "03" || input === "04" || input === "05" ||input==="18"){
    return false;
  }else{

    return true;

  }
}
export function AFFIRM(input){
  if(input==='01'){
    return true
  }else{

    return false

  }
}
//显示确认付款 end
//显示底部按钮 start
export function Footer(input){
  if(input==='13'){
    return false;
  }
  if(input!=='16' && input!=='02' &&input!=='07'){
    return true;
  }else{
    return false;
  }
}
//显示底部按钮 end

export function isMaster(input){
  if(input!=='16'&&input!=='16'&&input!=='11'){
      return false;
  }else{
    return true;
  }
}
