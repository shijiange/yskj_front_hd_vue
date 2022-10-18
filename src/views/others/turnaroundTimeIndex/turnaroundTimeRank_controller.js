import cTitle from "components/title";
import { Toast } from "vant";
export default {
  data() {
    let that = this;
    return {
      screen_id: "",
      store_id: "",
      info: [],
      typeind: 3,
      list: [],
      week: "",
      swiperOption: {
        direction: "horizontal",
        // observer: true,
        width: window.innerWidth - 20,
        height: window.innerHeight,
        // watchOverflow: true,
        autoHeight: true,
        autoplay: {
          delay: 6000 //1秒切换一次
        },
        pagination: false,
        slidesPerView: 4,
        slidesPerGroup: 4,
        speed: 1000,
        on: {
          init() {},
          reachEnd() {
            // console.log(that.popularVideo, "popularVideo");
            // 手指触碰拖动最后一张时执行
          },
          slideChangeTransitionEnd() {
            console.log(this.realIndex, that.info, "最后一个");
            that.$refs.mySwiper.swiper.autoplay.start();
            if (that.info.length - 4 == this.realIndex) {
              if (that.screen_id && that.store_id) {
                // that.$refs.mySwiper.swiper.autoplay.stop();
                // that.$refs.mySwiper.swiper.slideTo(0);
                setTimeout(() => {
                  that.getdata();
                }, 6000);
              }
            }
          }
        }
      }
    };
  },
  computed: {
    typeMap: function() {
      let ind = this.list.list_type;
      if (ind == 1) {
        return "每日排行榜";
      } else if (ind == 2) {
        return "每周排行榜";
      } else if (ind == 3) {
        return "每月排行榜";
      } else {
        return "每日排行榜";
      }
    }
  },
  activated() {
    this.screen_id = this.$route.query.screen_id;
    this.store_id = this.$route.query.store_id;
    this.$refs.mySwiper.swiper.autoplay.start();
    // window.scrollTo(0, 0);
    this.getdata();
  },
  mouted() {},
  methods: {
    isSecond(sec) {
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
    },
    getdata() {
      let that = this;
      console.log(this.typeind);
      if (that.typeind == 1) {
        that.typeind = 2;
      } else if (that.typeind == 2) {
        that.typeind = 3;
      } else if (that.typeind == 3) {
        that.typeind = 1;
      }
      $http
        .get("plugin.kart.Frontend.Store.Modules.Screen.Controllers.records.index", {
          store_id: that.store_id,
          screen_id: that.screen_id,
          list_type: that.typeind
        })
        .then(
          response => {
            if (response.result == 1) {
              this.info = response.data.data;
              this.list = response.data;
              this.getWeek(this.list.list_type);
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
  components: {
    cTitle
  }
};
