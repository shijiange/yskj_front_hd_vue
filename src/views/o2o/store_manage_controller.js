// import { mapState, mapMutations } from "vuex";
import cTitle from "components/title";
// var haveShop = false;

export default {
  data() {
    return {
      store: {
        name: "",
        thumb: "",
        validity: "", // 有效期
        store_id: ""
      },
      income: {
        money_total: 0.0,
        sure_withdraw_money: 0.0
      },
      goods_id: "", // 商品id
      status: 0,
      cloudHornStatus: false,
      zkzStatus: false,
      nearby: false,
      specify_show: 0,//门店进入页面 0门店首页 1门店商品页
      is_open_code:0,//收款二维码是否开启 0关1开
      my_store_order: 0, // 显示我的订单选项栏
      order_survey: 0,  // 显示订单概况
      show_store_balance_award:false
    };
  },

  mounted() {
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    toNear() {
      this.$router.push(
        this.fun.getUrl("introduceNear", {
          store_id: this.store.store_id
        })
      );
    },
    gotoStoreGroup() {
      this.$router.push(this.fun.getUrl("o2oGroupActivitylist", { store_id: this.store.store_id }));
    },
    toMyStore() {
      console.log(this.specify_show);
      let url = "";
      if (this.specify_show == 1) {
        url = "o2oStore_v2";
      }
      else {
        url = "HomeSeller";
      }
      this.$router.push(
        this.fun.getUrl(url, {
          store_id: this.store.store_id,
          fromHome: 1
        })
      );
    },
    getStoreInfo() {
      var that = this;
      $http
        .get("plugin.store-cashier.frontend.store.center.index.index", {}, "")
        .then(
          function(response) {
            if (response.result === 1) {
              that.store = response.data.store;
              // that.store.validity = that.store.validity;
              if (response.data.store.validity == 0) {
                that.store.validity = "无限期";
              } else {
                // 不需要转化了，任务编号: 39431
                // that.initDefaultDate(
                //   response.data.store.created_at.date,
                //   Number(response.data.store.validity)
                // );
                that.store.validity = response.data.store.validity.slice(0, 10);
              }
              that.income = response.data.income;
              that.nearby = response.data.nearby;
              if (response.data.store.is_open_yun_horn && (response.data.store.is_open_yun_horn == 1)) {
                that.cloudHornStatus = true;
              } else {
                that.cloudHornStatus = false;
              }
              if(response.data.show_store_balance_award){
                that.show_store_balance_award = response.data.show_store_balance_award;
              }
              if (response.data.store.is_open_zkc_pay && (response.data.store.is_open_zkc_pay == 1)) {
                that.zkzStatus = true;
              } else {
                that.zkzStatus = false;
              }
              that.specify_show = response.data.specify_show;
              that.is_open_code = response.data.is_open_code;
              that.my_store_order = response.data.my_store_order;
              that.order_survey = response.data.order_survey;
            } else {
              if (response.data.url) {
                window.location.href = response.data.url;
                return;
              }
              that.$dialog.alert({ message: response.msg });
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    // 续费按钮被点击的时候
    getCash() {
      this.$router.push(
        this.fun.getUrl("goodsorder", {}, {
          tag: "store",
          //  store_id: this.store.store_id,
          isCash: 1
        })
      );
    },
    // 显示续费按钮
    showCash() {
      $http
        .get("plugin.store-cashier.frontend.store.enter.enable")
        .then(res => {
          if (res.result === 1) {
            this.status = res.data.status;
          } else {
            this.$dialog.alert({ message: res.msg });
          }
        });
    },
    initDefaultDate(tiem, n) {
      var d2 = new Date(tiem);
      d2.setFullYear(d2.getFullYear() + n);
      d2.setDate(d2.getDate() - 1);
      console.log(
        "开始时间：：",
        d2.toLocaleString("chinese", { hour12: false }).replace(/:d{1,2}$/, " ")
      );
      this.timeFn(
        d2.toLocaleString("chinese", { hour12: false }).replace(/:d{1,2}$/, " ")
      );
    },
    timeFn(d1) {
      //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      var dateBegin = new Date(d1.replace(/-/g, "/")); //将-转化为/，使用new Date
      var dateEnd = new Date(); //获取当前时间
      var dateDiff = dateBegin.getTime() - dateEnd.getTime(); //时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      this.store.validity = dayDiff >= 0 ? dayDiff + "天 " : "已到期！";
    }
  },
  computed: {},
  activated() {
    this.getStoreInfo();
    this.showCash();
  },
  components: { cTitle }
};
