export const KEY = "data";
export function setSession(value) {
    var jsonString = sessionStorage.getItem(KEY);
    jsonString = jsonString || "[]";
    sessionStorage.setItem(KEY, JSON.stringify([value]));
}
export function setIsOpenId(key,value){
  let jsonString = sessionStorage.getItem(key);
  jsonString = jsonString || "[]";
  sessionStorage.setItem(key, JSON.stringify(value));
}
export function getIsOpenId(key){
  let jsonString = sessionStorage.getItem(key);
  jsonString = jsonString || false;
  return JSON.parse(jsonString)
}
export function getSession() {
    var jsonString = sessionStorage.getItem(KEY);
    jsonString = jsonString || "[]";
    return JSON.parse(jsonString)
}
export function setLocalStorage(key, value) {
    var jsonString = localStorage.getItem(key);
    jsonString = jsonString || "[]";
    var arr = JSON.parse(jsonString);
    arr.push(value);
    localStorage.setItem(key, JSON.stringify(arr));
}
export function getLocalStorage(key) {
    var jsonString = localStorage.getItem(key);
    jsonString = jsonString || "[]";
    return JSON.parse(jsonString)
}
export function removerStorage(key) {
    localStorage.removeItem(key,"[]")
}
export function setSize(key,value){
  localStorage.setItem(key, JSON.stringify(value));
}
