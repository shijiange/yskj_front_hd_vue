import cTitle from "components/title";
import { Toast } from "vant";
import vueSeamlessScroll from 'vue-seamless-scroll';
export default {
  data() {
    return {
      screen_id: "",
      store_id: "",
      info: [],
      kart_match: [],
      kart_match_first: [],
      classArr: [],
      kart_match_id: "",
      lisArr: [],
      member_ranking_len: [],
      list_type: 1,
      week: ""
    };
  },
  activated() {
    this.screen_id = this.$route.query.screen_id;
    this.store_id = this.$route.query.store_id;
    window.scrollTo(0, 0);
    if (this.screen_id == "real_time") {
      this.getClass();
    } else {
      this.lisArr = "";
      this.getdata();
      setInterval(() => {
        this.getdata();
      }, 3000);
    }
    // this.getdata(90);
  },
  mouted() {},
  methods: {
    getClass(kid) {
      let kart_match_id = "";
      if (kid) {
        kart_match_id = kid;
      }
      let that = this;
      $http
        .get("plugin.kart.Frontend.Store.Modules.Screen.Controllers.records.index", { store_id: that.store_id, screen_id: "real_time", kart_match_id: kart_match_id })
        .then(
          response => {
            if (response.result == 1) {
              this.info = response.data;
              if (this.info.kart_match.length > 0 && this.info.member_ranking.length > 0) {
                this.kart_match_first = response.data.member_ranking.slice(0, 3);
                this.kart_match = response.data.member_ranking.slice(3);
                this.classArr = response.data.kart_match;
                this.lisArr = this.classArr[0];
                this.funAsy(this.classArr);
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    async funAsy(arr) {
      let that = this;
      if (arr.length == 1) {
        let date = new Date();
        date = Date.parse(date);
        date = this.fun.timestampToTime(date / 1000);
        date = date.slice(0, 10);
        this.week = date;
        this.lisArr = this.classArr[0];
        await new Promise((resolve, reject) => {
          setTimeout(function() {
            resolve(1);
            that.gettest(1);
          }, 2000);
        });
      } else {
        for (let i = 0; i < this.classArr.length + 1; i++) {
          await new Promise((resolve, reject) => {
            setTimeout(function() {
              resolve(i);
              that.gettest(i);
            }, 6000);
          });
        }
      }
    },
    gettest(i) {
      // console.log(i)
      let last = i;
      if (this.classArr.length == last) {
        // 是当前class数组的最后一个分组了，重新请求分组数据
        console.log("是当前class数组的最后一个分组了，重新请求分组数据", this.classArr);
        if (this.classArr.length == 1) {
          this.getClass(this.classArr[0].id);
        } else {
          this.getClass();
        }
      } else {
        let id = this.classArr[i].id;
        console.log("继续", id, this.classArr[i]);
        this.lisArr = this.classArr[i];
        this.getdata(id);
      }
    },
    getdata(id) {
      let that = this;
      let json;
      let url;
      console.log(this.screen_id);
      if (this.screen_id == "real_time") {
        json = { store_id: that.store_id, screen_id: "real_time", kart_match_id: id };
        url = "plugin.kart.Frontend.Store.Modules.Screen.Controllers.records.index";
      } else {
        json = {
          store_id: that.store_id,
          screen_id: that.screen_id,
          list_type: that.list_type
        };
        url = "plugin.kart.Frontend.Store.Modules.Screen.Controllers.records.index";
      }
      $http
        .get(url, json)
        .then(
          response => {
            if (response.result == 1) {
              if (that.screen_id == "real_time") {
                this.info = response.data;
                this.kart_match_first = response.data.member_ranking.slice(0, 3);
                this.kart_match = response.data.member_ranking.slice(3);
                console.log(this.kart_match_first, this.kart_match_first);
              } else {
                this.info = response.data;
                this.lisArr = response.data.data[0];
                if (response.data.data[0].data) {
                  this.kart_match_first = response.data.data[0].data.slice(0, 3);
                  this.kart_match = response.data.data[0].data.slice(3);
                }
                console.log(this.kart_match);
                this.getWeek(this.info.list_type);
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    getWeek(type) {
      console.log(type);
      if (type == 2) {
        let date = new Date();
        let day = date.getFullYear();
        let month = date.getMonth() + 1;
        let days = date.getDate();
        date = this.getMonthWeek(day, month, days);
        this.week = `${day}年${date}周`;
      } else if (type == 1) {
        let date = new Date();
        date = Date.parse(date);
        date = this.fun.timestampToTime(date / 1000);
        date = date.slice(0, 10);
        this.week = date;
      } else if (type == 3) {
        let date = new Date();
        date = Date.parse(date);
        date = this.fun.timestampToTime(date / 1000);
        date = date.slice(0, 7);
        this.week = date;
      }
    },
    getMonthWeek(a, b, c) {
      var date1 = new Date(a, parseInt(b) - 1, c),
        date2 = new Date(a, 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
      return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7);
    }
  },
  filters: {
    timestampToTime: function(timestamp) {
      if (!Number(timestamp) || timestamp == "") {
        return "";
      }
      let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
      let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      return Y + M + D;
    },
    isSecond: function(sec) {
      if(sec >= 60000){
        var minute = Math.floor((sec /1000)/60);
        var second = Math.floor((sec/1000) % 60);
        var msec = (sec/1000) % 60;
        msec = msec.toString().split('.')[1];
        msec = '0.' + msec;
        msec = msec*1000;
        msec = msec.toFixed(0);
        return minute+':'+second+'.'+msec;
      }else{
        return (sec /1000).toFixed(3);
      }
    }
  },
  computed: {
    optionSetting() {
      return {
        step: 1, // 数值越大速度滚动越快
        limitMoveNum: 10, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: false, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  components: {
    cTitle,
    vueSeamlessScroll
  }
};
