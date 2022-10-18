/**
 * canqiang
 */


function DateParser() {
  this.weekArr = ['周一', '周二', '周三', '周四', '周五'];
}

DateParser.prototype._padLeftZero = function (str) {
  str = String(str);
  return ('00' + str).substr(str.length);
};

DateParser.prototype.getLocalTime = function (nS) {   //转化时间格式
  let targetDate;
  if((typeof parseInt(nS)) != 'number' || isNaN(Number(nS)) ){
    targetDate = new Date(nS);
  }else{
    targetDate = new Date(parseInt(nS)*1000);
  }
	
  let str = (targetDate.getFullYear()) + '-'
        + this._padLeftZero(targetDate.getMonth() + 1)
        + '-' + this._padLeftZero(targetDate.getDate())
        + ' ' + this._padLeftZero(targetDate.getHours())
        + ':' + this._padLeftZero(targetDate.getMinutes() + 1);

  let currentDate = new Date();
  let $_time_day = currentDate.getDate();
  let $_time_month = currentDate.getMonth() + 1;
  let $_time_year = currentDate.getFullYear();
  // let $_time_week = currentDate.getDay();
  let timeText = '';
	
  let time =  str.substr(11, 5);

  if (this.isYesterday(currentDate, targetDate) == 1) {
    timeText = '昨天';
    return timeText+' '+time;
  }


  //判断是不是同一个星期，如果是就排除 今天，昨天 这两天
  let isWeekFlag = this.isWeek(currentDate, targetDate);
  if (isWeekFlag.is) {
       
    if ((isWeekFlag.cWeek - isWeekFlag.tWeek) >= 2) {
      timeText = this.weekArr[isWeekFlag.tWeek - 1];
      return timeText+' '+time;
    }
  }
  if (str.substr(0, 4) == $_time_year) {	//同一年份
    if (str.substr(5, 2) == $_time_month) {	//同一月份
      if (str.substr(8, 2) == $_time_day) {

        return time;
      } else {

        timeText = str.substr(5, 5);
      }

    } else {

      timeText = str.substr(5, 5);
    }

  } else {

    timeText = str.substr(0, 7);
  }
  return timeText+' '+time;
};

//返回出相隔多少天，如果返回 1 就代表昨天
DateParser.prototype.isYesterday = function (currentDate, targetDate) {
  let t = new Date(targetDate.getFullYear() + '/' + (targetDate.getMonth() + 1) + '/' + targetDate.getDate());
  let c = new Date(currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate());

  let dateNum = (c.getTime() - t.getTime()) / (24 * 3600 * 1000);
  return dateNum;
};


//判断你传进来的那个时间与当前时间是否为同一个星期
DateParser.prototype.isWeek = function (currentDate, targetDate) {


  let t = new Date(targetDate.getFullYear() + '/' + (targetDate.getMonth() + 1) + '/' + targetDate.getDate());
  let c = new Date(currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate());

  let tWeek = t.getDay() == 0 ? 7 : t.getDay();	//星期天是0，手动改为 7
  let cWeek = c.getDay() == 0 ? 7 : c.getDay();
  let is = true;

  let dateNum = (c.getTime() - t.getTime()) / (24 * 3600 * 1000);
  if (dateNum >= 7) {	
    is = false;
  } else {

    if (tWeek == cWeek) {	
      is = true;
    } else {
      if (cWeek <= tWeek) {	
        is = false;
      } else {
        is = true;
      }
    }
  }

  return { is, cWeek, tWeek };

};
let dateParserTime = new DateParser();
export default dateParserTime.getLocalTime.bind(dateParserTime);