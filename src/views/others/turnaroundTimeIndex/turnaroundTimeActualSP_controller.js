import cTitle from "components/title";
import { Toast } from "vant";
export default {
  data() {
    return {
      screen_id: "",
      store_id: "",
      info: [],
      kart_match_first: [],
      kart_match: [],
      week: ""
    };
  },
  activated() {
    this.screen_id = this.$route.query.screen_id;
    this.store_id = this.$route.query.store_id;
    window.scrollTo(0, 0);
    // this.funAsy();
    this.getdata();
    setInterval(() => {
      this.getdata();
    }, 10000);
    this.getWeek();
  },
  mouted() {},
  filters: {
    isSecond: function (sec) {
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
    typeMap: function() {
      let ind = this.info.list_type;
      if (ind == 1) {
        return "每日排行榜";
      } else if (ind == 2) {
        return "每周排行榜";
      } else if (ind == 3) {
        return "每月排行榜";
      }else{
        return "每日排行榜";
      }
    },
  },
  methods: {
    // async funAsy() {
    //   let that = this;
    //   for (let i = 0; i < 3; i++) {
    //     await new Promise((resolve, reject) => {
    //       setTimeout(function() {
    //         resolve(i);
    //         that.getdata(i);
    //       }, 10000);
    //     });
    //   }
    // },
    getdata(i) {
      let that = this;
      // let typeind = (i+1);
      // console.log(typeind,'1111111111111111111')
      // if(!typeind){
      //   return
      // }
      $http
        .get("plugin.kart.Frontend.Store.Modules.Screen.Controllers.records.index", { store_id: that.store_id, screen_id: that.screen_id })
        .then(
          response => {
            if (response.result == 1) {
              console.log(response.data);
              this.info = response.data;
              this.kart_match_first = this.info.data[0].data.slice(0, 3);
              this.kart_match = this.info.data[0].data.slice(3);
              console.log(this.kart_match_first);
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
    getMonthWeek(a, b, c) {
      var date1 = new Date(a, parseInt(b) - 1, c),
        date2 = new Date(a, 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
      return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7);
    },
    // isSecond(second){
    //   let sec = '';
    //   // 一分钟
    //   let min = 60*1000;
    //   if(Number(second) <= 1000){
    //     sec = (second /1000).toFixed(3)
    //     return sec;
    //   }else if(Number(second) >= min){
    //     console.log('====================================')
    //     second = (second /1000).toFixed(3);
    //     console.log(second)
    //     min = (second / 60).toFixed(5)
    //     if(min <10){
    //       let s = Number(min).toFixed(0);
    //       let sce = Number(min).toFixed(5).slice(2,4)
    //       let hm = Number(min).toFixed(5).slice(4)
    //       min = `${s}:${sce}.${hm}`
    //       console.log(min)
    //     }else if(min >= 10 && min < 60){
    //       let s = Number(min).toFixed(0);
    //       let sce = Number(min).toFixed(5).slice(3,5)
    //       let hm = Number(min).toFixed(5).slice(5)
    //       console.log(s,sce,hm)
    //       min = `${s}:${sce}.${hm}`
    //       console.log(min)
    //     }
    //     return min
    //   }else{
    //     sec = (second /1000).toFixed(3)
    //     if(sec < 10){
    //       sec = `0${sec}`
    //     }
    //     return sec;
    //   }
    // },
    getWeek() {
      let date = new Date();
      let day = date.getFullYear();
      let month = date.getMonth() + 1;
      let days = date.getDate();
      date = this.getMonthWeek(day, month, days);
      this.week = `${day}年${date}周`;
    }
  },
  components: {
    cTitle
  }
};
