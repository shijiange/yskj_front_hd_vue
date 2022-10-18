/**
 * 时间元素补齐0
 * @param {number} dateEl 时间单个元素 例如 2
 * @returns string 补齐0后的日期
 */
export function dateAddZero(dateEl) {
  dateEl = parseInt(dateEl);
  return dateEl < 10 ? `0${dateEl}` : dateEl;
}

/**
 *
 * @param {number|string} timestamp 时间戳|标准时间格式 1619423440792|Mon Apr 26 2021 15:51:08 GMT+0800 (中国标准时间)
 * @param {string} format 返回的格式 y=年 m=月 d=天 h=小时 i=分钟(去minute第二个字母) s=秒 w=阿拉伯数字星期 W=中文周数
 * @returns
 */
export function formatDate(timestamp = null, format = "y-m-d h:i:s") {
  if (timestamp === null) {
    timestamp = Date.now();
  }
  const { year, month, day, hour, minute, second, week } = getTime(timestamp);
  const chineseNumbers = ["一", "二", "三", "四", "五", "六", "日"];
  format = format.replace(/y/gi, year);
  format = format.replace(/m/gi, dateAddZero(month));
  format = format.replace(/d/gi, dateAddZero(day));
  format = format.replace(/h/gi, dateAddZero(hour));
  format = format.replace(/i/gi, dateAddZero(minute));
  format = format.replace(/s/gi, dateAddZero(second));
  format = format.replace(/w/g, week);
  format = format.replace(/W/g, chineseNumbers[week - 1]);
  return format;
}

/**
 * 获取时间元素
 * @param {number} timestamp 时间戳
 * @returns object 时间元素
 */
export function getTime(timestamp) {
  if (timestamp === null) {
    timestamp = Date.now();
  }
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = dateAddZero(date.getMonth() + 1);
  const day = dateAddZero(date.getDate());
  const hour = dateAddZero(date.getHours());
  const minute = dateAddZero(date.getMinutes());
  const second = dateAddZero(date.getSeconds());
  const week = date.getDay();
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    week
  };
}

/**
 * 通过秒数转换成时间元素
 * @param {number} microseconds 毫秒数
 * @returns object 时间元素
 */
export function getTimeElBySeconds(microseconds) {
  let seconds = Math.floor(microseconds % 60);
  let minutes = Math.floor(microseconds / 60) % 60;
  let hours = Math.floor(microseconds / 60 / 60) % 24;
  let days = Math.floor(microseconds / 60 / 60 / 24);
  return {
    days,
    hours,
    minutes,
    seconds
  };
}

/**
 * 获取两个时间戳的差后转换出来的时间元素
 * @param {number} time1 时间戳
 * @param {number} time2 时间戳
 * @returns 日期元素
 */
export function getTimeDiff(time1, time2) {
  if (isNaN(Number(time1))) {
    time1 = new Date(time1).getTime();
  }
  if (isNaN(Number(time2))) {
    time2 = new Date(time2).getTime();
  }
  return getTimeElBySeconds((time1 - time2) / 1000);
}

/**
 * 根据日期元素转换出时间戳
 * @param {number} second 秒数
 * @param {number} minute 分
 * @param {number} hour 时
 * @param {number} day 天
 * @param {number} month 月
 * @param {number} year 年
 * @returns number 时间戳
 */
export function timeToTimeStamp(second, minute, hour, day, month, year) {
  let nowDate = new Date();
  if (year) {
    nowDate.setFullYear(year);
  } else {
    nowDate.setFullYear(nowDate.getFullYear());
  }
  if (month) {
    nowDate.setMonth(month);
  } else {
    nowDate.setMonth(nowDate.getMonth());
  }
  if (day) {
    nowDate.setDate(day);
  } else {
    nowDate.setDate(nowDate.getDate());
  }
  if (hour) {
    nowDate.setHours(hour);
  } else {
    nowDate.setHours(nowDate.getHours());
  }
  if (minute) {
    nowDate.setMinutes(minute);
  } else {
    nowDate.setMinutes(nowDate.getMinutes());
  }
  if (second) {
    nowDate.setSeconds(second);
  } else {
    nowDate.setSeconds(nowDate.getSeconds());
  }
  return second.getTime();
}

export default {
  formatDate,
  dateAddZero,
  getTime,
  getTimeElBySeconds,
  getTimeDiff,
  timeToTimeStamp
};
