<template>
  <div class="calendar" :style="{ '--normal_bg_color': `${options.normal_bg_color}`, '--normal_font_color': `${options.normal_font_color}`,
  '--disabled_bg_color': `${options.disabled_bg_color}`, '--disabled_font_color': `${options.disabled_font_color}` }">
    <div class="calendar-header">
      <div class="calendar-info" :style="{'background-color': options.header_bg_color}">
        <span class="pre-month" @click='preMonth'></span>
        <transition name="fade">
          <p :style="{'color': options.header_font_color}">{{ nowDay }}</p>
        </transition>
        <span class="next-month" @click='nextMonth'></span>
      </div>
      <ul>
        <li v-for="(week, index) in weeks" :key="index" class="week" :style="{'color': options.week_font_color}">{{week}}</li>
      </ul>
    </div>

    <div class="calendar-box">
      <div class="wrapper">
        <table cellpadding="5" class="last-month">
          <tbody>
          <tr v-for="(day,k1) in lastDays" :key="k1" style="{'animation-delay',(k1*30)+'ms'}">
            <td v-for="(child,k2) in day" :key="k2" :class="{'selected':child.selected,'disabled':child.disabled}"
                :style="{height: tdH + 'px'}">
              <span :style="dateStyle(child)">{{child.day}}</span>
              <span class="dot" v-if="child.eventName"></span>
            </td>
          </tr>
          </tbody>
        </table>
        <table cellpadding="5" class="now-month">
          <tbody>
          <tr v-for="(day,k1) in days" :key="k1" style="{'animation-delay',(k1*30)+'ms'}">
            <td v-for="(child,k2) in day" :key="k2" :class="{'selected':child.selected,'disabled':child.disabled}"
                :style="{height: tdH + 'px'}" @click="select(k1,k2,$event,child)">
              <span :style="dateStyle(child)">{{child.day}}</span>
              <span class="dot-title" :style="{color: options.event_dot_color}" v-if="child.eventTitle">{{child.eventTitle}}</span>
              <span class="dot" :style="{'background-color': options.event_dot_color}"
                    v-else-if="child.eventName"></span>
            </td>
          </tr>
          </tbody>
        </table>
        <table cellpadding="5" class="now-month">
          <tbody>
          <tr v-for="(day,k1) in nextDays" :key="k1" style="{'animation-delay',(k1*30)+'ms'}">
            <td v-for="(child,k2) in day" :key="k2" :class="{'selected':child.selected,'disabled':child.disabled}"
                :style="{height: tdH + 'px'}">
              <span :style="dateStyle(child)">{{child.day}}</span>
              <span class="dot" v-if="child.eventName"></span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: ()=> {
        return {
          header_bg_color: "#ffffff",
          header_font_color: "#ffa300",
          week_font_color: "#333333",
          selected_bg_color: "#f49f19",
          today_bg_color: "#f9d08f",
          event_dot_color: "#083ce4",
          normal_bg_color: "#ffffff",
          normal_font_color: "#333333",
          disabled_bg_color: "#ffffff",
          disabled_font_color: "#cccccc",
        };
      }
    },
    // ??????????????????
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // ??????????????????
    begin: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // ??????????????????
    end: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // ????????????10??????
    zero: {
      type: Boolean,
      default: true
    },
    // ???????????????
    disabled: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // ??????????????????
    lunar: {
      type: Boolean,
      default: false
    },

    // ?????????????????????
    weeks: {
      type: Array,
      default: function() {
        return window.navigator.language.toLowerCase() == "zh-cn" ? ["???", "???", "???", "???", "???", "???", "???"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      }
    },
    // ?????????????????????
    months: {
      type: Array,
      default: function() {
        return window.navigator.language.toLowerCase() == "zh-cn" ? ["??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "?????????"] : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      }
    },
    // ???????????????
    events: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      year: 0,
      month: 0,
      day: 0,
      days: [],
      lastDays: [],
      nextDays: [],
      selectedDate: [],
      festival: {
        lunar: {
          "1-1": "??????",
          "1-15": "?????????",
          "2-2": "?????????",
          "5-5": "?????????",
          "7-7": "?????????",
          "7-15": "?????????",
          "8-15": "?????????",
          "9-9": "?????????",
          "10-1": "?????????",
          "10-15": "?????????",
          "12-8": "?????????",
          "12-23": "?????????"
        },
        gregorian: {
          "1-1": "??????",
          "2-14": "?????????",
          "3-8": "?????????",
          "3-12": "?????????",
          "4-5": "?????????",
          "5-1": "?????????",
          "5-4": "?????????",
          "6-1": "?????????",
          "7-1": "?????????",
          "8-1": "?????????",
          "9-10": "?????????",
          "10-1": "?????????",
          "12-24": "?????????",
          "12-25": "?????????"
        }
      },
      startPos: {},
      endPos: {},
      isScrolling: 0,
      translateX: 0,
      calendarBox: null,
      wrapper: null,
      tdH: 46
    };
  },
  computed: {
    nowDay() {
      return this.year + "-" + this.zeroPad(parseInt(this.month) + 1);
    }
  },
  watch: {
    events() {
      this.days = this.render(this.year, this.month, true);
    },
    value() {
      this.init();
    }
  },
  mounted() {
    this.calendarBox = document.getElementsByClassName("calendar-box")[0];
    this.wrapper = document.getElementsByClassName("wrapper")[0];
    this.init();
    // console.log(this.calendarBox.clientWidth);
    this.tdH = Math.round(this.calendarBox.clientWidth / 7);
  },
  methods: {
    preMonth() {
      this.wrapper.style.transition = "all 300ms ease";
      this.wrapper.style.transform = "translateX(" + 0 + "px)";
      this.resetTransition("left");
    },
    nextMonth() {
      this.wrapper.style.transition = "all 300ms ease";
      this.wrapper.style.transform = "translateX(" + -this.calendarBox.clientWidth * 2 + "px)";
      this.resetTransition("right");
    },
    init() {
      let now = new Date();
      this.year = now.getFullYear();
      this.month = now.getMonth();
      this.day = now.getDate();
      if (this.value.length > 0) {
        this.year = parseInt(this.value[0]);
        this.month = parseInt(this.value[1]) - 1;
        this.day = parseInt(this.value[2]);
      }
      this.selectedDate = [this.year, this.month, this.day];
      this.days = this.render(this.year, this.month, true);
      this.nextDays = this.next();
      this.lastDays = this.prev();

      this.$emit("monthChanged", this.year + "-" + this.zeroPad(this.month + 1));

      //  listener touch event
      this.wrapper.style.transform = "translateX(" + -this.calendarBox.clientWidth + "px" + ")";
      this.calendarBox.addEventListener("touchstart", e => {
        this.startPos = this.endPos = { x: 0, y: 0 };
        let touch = e.targetTouches[0]; //touches????????????????????????????????????touch???????????????touch
        this.startPos = { x: touch.pageX, y: touch.pageY, time: +new Date }; //????????????touch????????????
        const tranStr = this.wrapper.style.transform;
        if (tranStr) {
          this.translateX = Number(tranStr.substring(11, tranStr.length - 3));
        } else {
          this.translateX = 0;
        }
        this.calendarBox.addEventListener("touchmove", this.touchmove, false);
        this.calendarBox.addEventListener("touchend", this.touchend, false);
      }, false);
    },
    // ????????????
    render(y, m, isCurrentMonth = false) {
      let firstDayOfMonth = new Date(y, m, 1).getDay();         //???????????????
      let lastDateOfMonth = new Date(y, m + 1, 0).getDate();    //??????????????????
      let lastDayOfLastMonth = new Date(y, m, 0).getDate();     //???????????????????????????
      let i, line = 0, temp = [], nextMonthPushDays = 1;
      for (i = 1; i <= lastDateOfMonth; i++) {
        let day = new Date(y, m, i).getDay(); //??????????????????0???6???
        let k;
        // ?????????
        if (day == 0) {
          temp[line] = [];
        } else if (i == 1) {
          temp[line] = [];
          k = lastDayOfLastMonth - firstDayOfMonth + 1;
          for (let j = 0; j < firstDayOfMonth; j++) {
            temp[line].push(Object.assign(
              { day: k, disabled: true },
              // this.getLunarInfo(this.computedPrevYear(),this.computedPrevMonth(true),k),
              isCurrentMonth ? this.getEvents(this.computedPrevYear(), this.computedPrevMonth(true), k) : {},
              this.isToday(this.computedNextYear(), this.computedNextMonth(true) + 1, k)
            ));
            k++;
          }
        }

        let chk = new Date();
        let chkY = chk.getFullYear();
        let chkM = chk.getMonth();
        // let chkD = chk.getDate();
        // ???????????????????????????
        if (this.selectedDate.length == 3 && y == this.selectedDate[0] && m == this.selectedDate[1] && i == this.selectedDate[2]) {
          temp[line].push(Object.assign(
            { day: i, selected: true },
            // this.getLunarInfo(y, m, i),
            isCurrentMonth ? this.getEvents(y, m, i) : {},
            this.isToday(y, m, i)
          ));
        } else if (this.selectedDate.length != 3 && chkY == this.year && chkM == this.month && i == this.day && this.value.length === 0) {    // ????????????????????????????????????????????????
          temp[line].push(Object.assign(
            { day: i, selected: true },
            // this.getLunarInfo(y, m, i),
            isCurrentMonth ? this.getEvents(y, m, i) : {},
            this.isToday(y, m, i)
          ));
          this.selectedDate = [this.year, this.month, this.day];
        } else {
          // ????????????
          let options = Object.assign(
            { day: i, selected: false },
            // this.getLunarInfo(y, m, i),
            isCurrentMonth ? this.getEvents(y, m, i) : {},
            this.isToday(y, m, i)
          );
          if (this.begin.length > 0) {
            let beginTime = Number(new Date(parseInt(this.begin[0]), parseInt(this.begin[1]), parseInt(this.begin[2])));
            if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true;
          }
          if (this.end.length > 0) {
            let endTime = Number(new Date(parseInt(this.end[0]), parseInt(this.end[1]) - 1, parseInt(this.end[2])));
            if (endTime < Number(new Date(this.year, this.month, i))) options.disabled = true;
          }
          if (this.disabled.length > 0) {
            if (this.disabled.filter(v => {
              let item = v.split("-");
              return this.year === parseInt(item[0]) && this.month === parseInt(item[1]) - 1 && i === parseInt(item[2]);
            }).length > 0) {
              options.disabled = true;
            }
          }
          // if(Number(new Date(this.year, this.month, i)) < Number(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))){
          //   options.disabled = true;
          // }
          temp[line].push(options);
        }
        // ???????????????
        if (day == 6 && i < lastDateOfMonth) {
          line++;
        } else if (i == lastDateOfMonth) {
          // line++
          let k = 1;
          for (let d = day; d < 6; d++) {
            temp[line].push(Object.assign(
              { day: k, disabled: true },
              // this.getLunarInfo(this.computedNextYear(),this.computedNextMonth(true),k),
              isCurrentMonth ? this.getEvents(this.computedNextYear(), this.computedNextMonth(true), k) : {},
              this.isToday(this.computedNextYear(), this.computedNextMonth(true) + 1, d)
            ));
            k++;
          }
          // ????????????????????????????????????????????????
          nextMonthPushDays = k;
        }
      } //end for

      // ??????????????????????????????
      if (line <= 5 && nextMonthPushDays > 0) {
        for (let i = line + 1; i <= 5; i++) {
          temp[i] = [];
          let start = nextMonthPushDays + (i - line - 1) * 7;
          for (let d = start; d <= start + 6; d++) {
            temp[i].push(Object.assign(
              { day: d, disabled: true },
              // this.getLunarInfo(this.computedNextYear(),this.computedNextMonth(true),d),
              isCurrentMonth ? this.getEvents(this.computedNextYear(), this.computedNextMonth(true), d) : {},
              this.isToday(this.computedNextYear(), this.computedNextMonth(true) + 1, d)
            ));
          }
        }
      }
      return temp;
    },
    touchmove(e) {
      //??????????????????touch???????????????????????????????????????move??????
      if (e.targetTouches.length > 1 || e.scale && e.scale !== 1) return;
      let touch = e.targetTouches[0];
      this.endPos = { x: touch.pageX - this.startPos.x, y: touch.pageY - this.startPos.y };
      this.isScrolling = Math.abs(this.endPos.x) < Math.abs(this.endPos.y) ? 1 : 0; //isScrolling???1???????????????????????????0???????????????
      if (this.isScrolling === 0) {
        e.preventDefault(); //???????????????????????????????????????????????????
        const x = this.translateX + this.endPos.x;
        this.wrapper.style.transform = "translateX(" + x + "px" + ")";
      }
    },
    touchend(e) {
      let duration = +new Date - this.startPos.time; //?????????????????????
      if (this.isScrolling === 0) { //?????????????????????
        if (Number(duration) < 300 && Math.abs(this.endPos.x) > 30) {     //  ?????????????????????
          if (this.endPos.x > 30) {
            this.wrapper.style.transition = "all 300ms ease";
            this.wrapper.style.transform = "translateX(" + 0 + "px)";
            this.resetTransition("left");
          } else if (this.endPos.x < -30) {
            this.wrapper.style.transition = "all 300ms ease";
            this.wrapper.style.transform = "translateX(" + -this.calendarBox.clientWidth * 2 + "px)";
            this.resetTransition("right");
          }
        } else if (Number(duration) >= 300) {    //  ????????????
          if (Math.abs(this.endPos.x) > this.calendarBox.clientWidth / 2) {
            if (this.endPos.x > 0) {
              this.wrapper.style.transition = "all 300ms ease";
              this.wrapper.style.transform = "translateX(" + 0 + "px)";
              this.resetTransition("left");
            } else {
              this.wrapper.style.transition = "all 300ms ease";
              this.wrapper.style.transform = "translateX(" + -this.calendarBox.clientWidth * 2 + "px)";
              this.resetTransition("right");
            }
          } else {
            this.wrapper.style.transition = "all 300ms ease";
            this.wrapper.style.transform = "translateX(" + -this.calendarBox.clientWidth + "px)";
            this.resetTransition("none");
          }
        }
      }
      //????????????
      this.calendarBox.removeEventListener("touchmove", this.touchmove, false);
      this.calendarBox.removeEventListener("touchend", this.touchend, false);
    },
    resetTransition(dir) {
      setTimeout(() => {
        this.wrapper.style.transition = "";
        this.wrapper.style.transform = "translateX(" + -this.calendarBox.clientWidth + "px)";
        switch (dir) {
        case "left":
          // let ldays = this.days;
          // let lastDays = this.lastDays;
          // let lmonth, lyear;
          if (this.month == 0) {
            this.month = 11;
            this.year = parseInt(this.year) - 1;
          } else {
            this.month = parseInt(this.month) - 1;
            // this.year = this.year;
          }

          // this.month = lmonth;
          // this.year = lyear;
          // this.days = lastDays
          this.nextDays = this.days;
          this.lastDays = this.prev();
          this.$emit("monthChanged", this.year + "-" + this.zeroPad(this.month + 1));
          break;
        case "right":
          // let rdays = this.days;
          // let nextDays = this.nextDays;
          // let rmonth, ryear;
          if (this.month == 11) {
            this.month = 0;
            this.year = parseInt(this.year) + 1;
          } else {
            this.month = parseInt(this.month) + 1;
            // this.year = this.year;
          }
          // this.month = rmonth;
          // this.year = ryear;
          // this.days = nextDays
          this.lastDays = this.days;
          this.nextDays = this.next();
          this.$emit("monthChanged", this.year + "-" + this.zeroPad(this.month + 1));
          break;
        default:
          break;
        }
        this.days = this.render(this.year, this.month, true);
      }, 310);
    },
    computedPrevYear() {
      let value = this.year;
      if (this.month - 1 < 0) {
        value--;
      }
      return value;
    },
    computedPrevMonth(isString) {
      let value = this.month;
      if (this.month - 1 < 0) {
        value = 11;
      } else {
        value--;
      }
      // ???????????????????????????????????????0????????????
      if (isString) {
        return value + 1;
      }
      return value;
    },
    computedNextYear() {
      let value = this.year;
      if (this.month + 1 > 11) {
        value++;
      }
      return value;
    },
    computedNextMonth(isString) {
      let value = this.month;
      if (this.month + 1 > 11) {
        value = 0;
      } else {
        value++;
      }
      // ???????????????????????????????????????0????????????
      // if (isString) {
      //   return value + 1;
      // }
      return value;
    },
    // ??????????????????
    // getLunarInfo(y,m,d) {
    //   let lunarInfo=calendar.solar2lunar(y,m,d)
    //   let lunarValue=lunarInfo.IDayCn
    //   let isLunarFestival=false
    //   let isGregorianFestival=false
    //   if(this.festival.lunar[lunarInfo.lMonth+"-"+lunarInfo.lDay]!=undefined) {
    //     lunarValue=this.festival.lunar[lunarInfo.lMonth+"-"+lunarInfo.lDay]
    //     isLunarFestival=true
    //   }else if(this.festival.gregorian[m+"-"+d]!=undefined){
    //     lunarValue=this.festival.gregorian[m+"-"+d]
    //     isGregorianFestival=true
    //   }
    //   return {
    //     lunar:lunarValue,
    //     isLunarFestival:isLunarFestival,
    //     isGregorianFestival:isGregorianFestival,
    //   }
    // },
    isToday(y, m, d) {
      let now = new Date();
      if (now.getFullYear() == y && now.getMonth() == m && now.getDate() == d) {
        return { "isToday": true };
      } else {
        return { "isToday": false };
      }
    },
    // ?????????????????????
    getEvents(y, m, d) {
      if (this.events.length === 0) return false;
      let isContain = false;
      let eventTitle = "";
      let data = {};
      this.events.forEach(item => {
        let days = item.split("-");
        if (days.length == 3 && days[0] == y && Number(days[1]) == (m + 1) && Number(days[2] == d)) {
          isContain = true;
        }
        if (days.length == 4 && days[0] == y && Number(days[1]) == (m + 1) && Number(days[2] == d) && days[3]) {
          eventTitle = days[3];
        }
      });

      if (eventTitle) {
        data.eventTitle = eventTitle;
      }

      if (isContain) {
        data.eventName = isContain;
      }
      return data;
    },
    // ??????
    prev() {
      let month, year;
      if (this.month == 0) {
        month = 11;
        year = parseInt(this.year) - 1;
      } else {
        month = parseInt(this.month) - 1;
        year = this.year;
      }
      return this.render(year, month, false);
    },
    //  ??????
    next() {
      let nextMonth, nextYear;
      if (this.month == 11) {
        nextMonth = 0;
        nextYear = parseInt(this.year) + 1;
      } else {
        nextMonth = parseInt(this.month) + 1;
        nextYear = this.year;
      }
      return this.render(nextYear, nextMonth, false);
    },
    // ????????????
    select(k1, k2, e, child) {
      if (e != undefined) e.stopPropagation();
      // ??????????????????
      if (this.selectedDate.length > 0) {
        this.days.forEach(v => {
          v.forEach(vv => {
            vv.selected = false;
          });
        });
        this.lastDays.forEach(v => {
          v.forEach(vv => {
            vv.selected = false;
          });
        });
        this.nextDays.forEach(v => {
          v.forEach(vv => {
            vv.selected = false;
          });
        });
      }
      // ?????????????????????
      this.days[k1][k2].selected = true;
      // this.day = this.days[k1][k2].day
      this.selectedDate = [this.year, this.month, this.days[k1][k2].day];
      this.$emit("select", [this.year, this.zero ? this.zeroPad(this.month + 1) : this.month + 1, this.zero ? this.zeroPad(this.days[k1][k2].day) : this.days[k1][k2].day, child]);
    },
    // ????????????
    setToday() {
      let now = new Date();
      this.year = now.getFullYear();
      this.month = now.getMonth();
      this.day = now.getDate();
      this.render(this.year, this.month, true);
      // ???????????????????????????
      this.days.forEach(v => {
        let day = v.find(vv => {
          return vv.day == this.day && !vv.disabled;
        });
        if (day != undefined) {
          day.selected = true;
        }
      });
    },
    // ????????????
    zeroPad(n) {
      return String(n < 10 ? "0" + n : n);
    },
    dateStyle(child) {
      if (child.selected) {
        return {
          "background-color": this.options.selected_bg_color,
          "color": "#fff"
        };
      } else if (child.isToday) {
        return {
          "background-color": this.options.today_bg_color,
          "color": "#fff"
        };
      }
      // else {
      //   return {
      //     "background-color": "#fff",
      //     "color": "#333"
      //   };
      // }
    }
  }
};

</script>


<style scoped>
  .calendar {
    margin: 0.5rem;
    width: 95%;
    min-width: 300px;
    background: #fff;
    user-select: none;
    box-shadow: 0 0 16px 0 rgba(108, 108, 108, 0.17);
    border-radius: 25px;
  }

  .calendar-header > ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 13px;
    padding: 5px 0;
  }

  .calendar-info {
    padding: 9px;
    font-size: 16px;
    line-height: 1.3;
    text-align: center;
    display: flex;
    border-radius: 25px;
  }

  .calendar-info > p {
    margin: 0.7rem 0 0 0;
    font-size: 14px;
    flex: 2;
  }

  .calendar-info > div.month .month-inner > span {
    display: block;
    font-size: 14px;
    height: 20px;
    width: 100px;
    overflow: hidden;
    text-align: center;
    flex: 1;
  }

  .calendar > .calendar-box {
    overflow-x: hidden;
  }

  .calendar > .calendar-box > .wrapper {
    display: -webkit-box;
    width: 300%;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }

  .calendar > .calendar-box > .wrapper::-webkit-scrollbar {
    width: 0 !important;
  }

  .calendar table {
    clear: both;
    width: 33.333%;
    border-collapse: collapse;
    color: var(--normal_font_color);
  }

  .calendar td {
    width: 14.28571429%;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    vertical-align: center;
    padding: 0;
    height: 40px;
    text-align: center;
  }

  .calendar td.week {
    font-size: 10px;
    pointer-events: none !important;
    cursor: default !important;
  }

  .calendar td > span:first-child {
    width: 70%;
    margin: auto;
    height: 70%;
    border-radius: 50%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--normal_bg_color);

    /* color: #333; */
    font-size: 13px;
  }

  .calendar td.disabled,
  .calendar td.disabled > span {
    pointer-events: none !important;
    cursor: default !important;

    /* opacity: 0; */
  }

  .calendar td.disabled > span {
    color: var(--disabled_font_color);
    background-color: var(--disabled_bg_color);
  }

  .calendar td.disabled div {
    color: var(--disabled_font_color);
  }

  .calendar td:not(.selected) span:not(.red):hover {
    /* background: #f3f8fa; */

    /* color: #444; */
  }

  .calendar td .dot {
    position: absolute;
    bottom: 0;
    left: 50%;
    text-align: center;
    padding: 4px;
    font-size: 8px;
    line-height: 1.2;
    color: #444;
    width: 1px;
    height: 1px;
    background: #083ce4;
    transform: translateX(-50%) scale(0.8);
    border-radius: 50%;
  }

  .calendar td .dot-title {
    position: absolute;
    bottom: -16%;
    left: 50%;
    text-align: center;
    width: 100%;
    font-size: 14px;
    line-height: 1.2;
    color: #083ce4;
    transform: translateX(-50%) scale(0.8);
    border-radius: 50%;
  }

  .calendar td .isGregorianFestival,
  .calendar td .isLunarFestival {
    color: #ea6151;
  }

  .calendar td.selected span.red {
    background-color: #ea6151;
    color: #fff;
  }

  .calendar td.selected span.red:hover {
    background-color: #ea6151;
    color: #fff;
  }

  .calendar thead td {
    text-transform: uppercase;
    height: 30px;
    vertical-align: middle;
  }

  .next-month {
    margin: 12px 10px;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 12px solid #ffa300;
  }

  .pre-month {
    margin: 12px 10px;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 12px solid #ffa300;
  }
</style>
