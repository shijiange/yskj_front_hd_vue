export const evals = (str) => {
  return '55555';
};

export const minus = (value) => {
  if (value) {
    if (value > 0) {
      return "+" + value;
    } else {
      return value;
    }

  }

};

export const KeyWord = (keys, e) => {
  if (e.indexOf(keys) > 0) {
    return keys;
  } else {
    return '过滤器';
  }

};

export const calculate = (value) => {
  if (value) {
    if (value <= 0) {
      return 0.00;
    } else {
      return value.toFixed(2);
    }
  } else {
    return "0.00";
  }

};

export const href_filters = (url) => {
  if (!url) {
    return "javascript:;";
  }
  let host = document.location.host;
  let mid = decodeURIComponent((new RegExp('[?|&]' + "mid" + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [,""])[1].replace(/\+/g, '%20')) || null;
  if (url.indexOf(host) >= 0) {

    if (url.indexOf('?') >= 0) {
      return url + "&mid=" + mid;
    } else {
      return url + "?mid=" + mid;
    }

  } else {
    return url;
  }
};

export const mobile_dispose = (value) => {
  if (value) {
    return value.substr(0, 3) + "****" + value.substr(7, value.length - 1);
  } else {
    return "";
  }

};

export const normalTime = (time) => {
  if (time) {
    return '时间过滤器' + time;
  }

};

export const pwd_filter = (value) => {
  if (value) {
    return "*";
  } else {
    return "";
  }

};

export const trainMinPirce = (pirces) => {
  console.log("pirces", pirces);

  if (pirces == null || pirces == '' || pirces == undefined) {
    return '--';
  }

  if (pirces.length > 0) {

    pirces = pirces.sort(function (a, b) {
      return a.seatPrice - b.seatPrice;
    });
    return pirces[0].seatPrice;
  } else {
    return '--';
  }

};

export const trainRunTime = (time) => {
  if (time > 0) {
    let h = parseInt(time / 3600);
    //let m=(time-h*3600);
    let m = parseInt((time - h * 3600) / 60);
    return h + "时" + m + "分";
  } else {
    return '--';
  }

};

//处理问题：转义字符后台转义后通过接口返回又被转义
export const escapeTitle = (a) => {
  if (!a) return '请填写商品标题';
  a = "" + a;
  return a.replace(/&#60;/g, "<").replace(/&#062;/g, ">").replace(/&#038;/g, "&").replace(/&#034;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"');

};

export const timestampToTime = (time) => {
  if (!time) {
    return '— —';
  }
  var date = new Date(time * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes();
  return Y + M + D + h + m;
};
