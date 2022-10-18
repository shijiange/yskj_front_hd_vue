import cTitle from "components/title";
import { Toast } from "vant";
import vueSeamlessScroll from 'vue-seamless-scroll';
export default {
  data() {
    return {
      datainfo: [1, 2, 3],
      datalen: [],
      screen_id: "",
      store_id: "",
      info: [],
      list: [],
      lis: [],
      timeInterval: "",
      nowTime: Date.parse(new Date())/1000,
      loadingAdd:false
    };
  },
  activated() {
    this.screen_id = this.$route.query.screen_id;
    this.store_id = this.$route.query.store_id;
    window.scrollTo(0, 0);
    this.getdata();
    this.timeInterval = setInterval(() => {
      this.getdata();
    }, 2000);
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
    optionSettingTwo() {
      return {
        step: 1, // 数值越大速度滚动越快
        limitMoveNum: 20, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: false, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  deactivated() {
    clearInterval(this.timeInterval);
  },
  mouted() {},
  methods: {
    getdata() {
      let that = this;
      $http
        .get("plugin.kart.Frontend.Store.Modules.Screen.Controllers.records.index", { store_id: that.store_id, screen_id: that.screen_id, limit: "2" })
        .then(
          response => {
            if (response.result == 1) {
              this.info = response.data;
              if (response.data.data[0]) {
                this.list = response.data.data[0];
              }

              if (response.data.data[1]) {
                this.lis = response.data.data[1];
              }
              console.log(this.list);
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
    }
  },
  filters: {
    timestampToTime: function(timestamp) {
      if (!Number(timestamp) || timestamp == "") {
        return "";
      }
      let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return h + m;
    },
    timestampYear: function(timestamp) {
      if (!Number(timestamp) || timestamp == "") {
        return "";
      }
      let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "年";
      let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "月";
      let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "日";
      return Y + M + D ;
    }
  },
  components: {
    cTitle,
    vueSeamlessScroll
  }
};
