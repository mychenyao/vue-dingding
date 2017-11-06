export function setCookie(tocken){
	document.cookie="tocken="+tocken;
}
export function getCookie(){
	var cookie=document.cookie;
  if(cookie==""||cookie==undefined){
    return false
	}else{
		var arr = cookie.match(new RegExp("(^| )tocken=([^;]*)(;|$)"));
	return arr[2];
	}
}
export const KEY = "OPENID";
export function setOpenID(value) {
  var jsonString = sessionStorage.getItem(KEY);
  jsonString = jsonString || "[]";
  sessionStorage.setItem(KEY, JSON.stringify([value]));
}
export function getOpenID() {
  var jsonString = sessionStorage.getItem(KEY);
  jsonString = jsonString || "[]";
  return JSON.parse(jsonString)[0]
}
