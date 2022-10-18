var YDB = new YDBOBJ();
var YDB_isWXApp = true;
var YDB_GPSla = 0;
var YDB_GPSlo = 0;
if (isApp()) {
    YDB.isWXAppInstalled("installstate");
}

//回调是否安装微信
function installstate(state){
    if(state == 0){
        YDB_isWXApp = false;
    }
}
//云打包APP获取地理位置
function DoWithYDBGPS (la,lo){
    YDB_GPSla = la;
    YDB_GPSlo = lo;
}

//分享回调
function Sharesback(state) {
  YDB.GoBack();
}

//是否为app打开
function isApp(){
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf('yunzshop') > -1) {
        return true;
    } else {
        return false;
    }
}

// 聚合CPS的登录跳转
function callAndroid() {
  // 由于对象映射，所以调用cps对象等于调用Android映射的对象
  cps.toLogin();
}
function callIOS(data) {
  window.webkit.messageHandlers.toLogin.postMessage(data);
}

// 聚合CPS的退出跳转
function toQuitAndroid() {
  cps.toQuitAndroid();
}
function toQuitIOS(data) {
  window.webkit.messageHandlers.toQuitIOS.postMessage(data);
}

// 聚合CPS的分享方法
function shareByH5Android(json) {
  // 由于对象映射，所以调用cps对象等于调用Android映射的对象
  cps.shareByH5Android(json);
}
function shareByH5IOS(data) {
  window.webkit.messageHandlers.shareByH5IOS.postMessage(data);
}

// 聚合CPS的返回上一页的方法
function routeBackUrlAndroid() {
  cps.routeBackUrlAndroid();
}
function routeBackUrlIOS(data) {
  window.webkit.messageHandlers.routeBackUrlIOS.postMessage(data);
}

// 聚合CPS调起小程序的方法
function miniWXAndroid(json) {
  cps.miniWXAndroid(json);
}
function miniWXIOS(data) {
  window.webkit.messageHandlers.miniWXIOS.postMessage(data);
}

// 聚合CPS原生微信支付
function wxPayAndroid(json) {
  cps.wxPayAndroid(json);
}
function wxPayIOS(data) {
  window.webkit.messageHandlers.wxPayIOS.postMessage(data);
}

// 聚合APP 任务中心跳转
function toUrlAndroid(json) {
  cps.toUrlAndroid(json);
}
function toUrlIOS(data) {
  window.webkit.messageHandlers.toUrlIOS.postMessage(data);
}

// 聚合APP 原生页面跳转
function toAPPUrlAndroid(json) {
  cps.toAPPUrlAndroid(json);
}
function toAPPUrlIOS(data) {
  window.webkit.messageHandlers.toAPPUrlIOS.postMessage(data);
}

// 获取聚合APP的公众号i和域名
function getKeyIAndroid() {
  if(cps.getKeyIAndroid()) {
    return JSON.parse(cps.getKeyIAndroid()) || {};
  }else {
    return {}
  }
}

function toGetKeyIIOS(data) {
  window.webkit.messageHandlers.toGetKeyIIOS.postMessage(data);
}

function getKeyIIOS(data) {
  var obj = {};
  // if(data){
  //   obj = JSON.parse(data)
  // }
  // console.log(obj['token'],obj.i,obj.domain,"obj")
  // window.localStorage.setItem('getKeyIIOS',JSON.stringify(obj));
  var regex = /\{(.+?)\}/g;
  if(window.navigator.userAgent.match(regex)) {
    obj = JSON.parse(window.navigator.userAgent.match(regex)[0]);
  }
  // console.log(obj,"obj")
  return obj;
}

// 跳转详情通知APP
function toGoodDetailIOS(data) {
  if(window.webkit && window.webkit.messageHandlers) {
    window.webkit.messageHandlers.toGoodDetailIOS.postMessage(data);
  }
}



// 详情返回列表通知APP
function toGoodListIOS(data) {
  var u = window.navigator.userAgent;
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf("yz_cps") > -1) {
    // 是否为cps环境
    if (isiOS) {
      if(window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.toGoodListIOS.postMessage(data);
      }
    }
  }
}

// 商品购买成功通知APP
function toGoodBuyIOS(data) {
  if(window.webkit && window.webkit.messageHandlers) {
    window.webkit.messageHandlers.toGoodBuyIOS.postMessage(data);
  }
}