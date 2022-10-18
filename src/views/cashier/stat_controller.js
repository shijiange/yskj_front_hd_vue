// import { mapState, mapMutations } from "vuex";
import cTitle from "../../components/title";
// var haveShop = false;

export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      myType: window.localStorage.type,
      store: {
        name: "",
        thumb: "",
        store_id: ""
      },
      startDate: "",
      endDate: "",
      income: {
        money_total: 0.0,
        sure_withdraw_money: 0.0
      },
      stat: {},
      statList: [],
      is_hotel: false,
      is_distribution: false,//配送站
      integral: ""
    };
  },
  mounted() {
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },

    getStat(is_time) {
      //plugin.store-cashier.frontend.cashier.statistics.index
      // var stime = {};
      if (!is_time) {
        is_time = 0;
      }
      let url = "", json = {};
      if (this.is_distribution) {
        this.getDistribution(1);
        return;
      } else if (this.fun.isTextEmpty(this.$route.params.hotel_id)) {
        url = "plugin.store-cashier.frontend.cashier.Statistics.index";
        json = {
          i: this.fun.getKeyByI(),
          type: this.fun.getTyep(),
          store_id: this.store.store_id,
          is_time: is_time
        };
      } else {
        url = "plugin.hotel.frontend.cashier.Statistics.index";
        json = {
          i: this.fun.getKeyByI(),
          type: this.fun.getTyep(),
          hotel_id: this.$route.params.hotel_id,
          is_time: is_time
        };
      }
      $http
        .get(url, json)
        .then((response) => {
          if (response.result === 1) {
            this.stat = response.data;
            this.statList = response.data.display_data;
          } else {
            this.$dialog.alert({ message: response.msg });

          }
        },
        function(response) {
          // error callback
        }
        );
    },
    //配送站数据
    getDistribution(day) {
      var that = this;
      let json = {
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        that_day: 0
      };
      if (!this.fun.isTextEmpty(day)) {
        json.that_day = day;
      }
      $http
        .get("plugin.delivery-station.frontend.delivery-station.statistics", json, "加载中")
        .then(
          function(response) {
            if (response.result == 1) {
              that.store = response.data;
              that.store.thumb = response.data.has_one_member.avatar;
              that.store.name = response.data.delivery_name;

            } else {
              that.$dialog.alert({ message: response.msg });

            }
          },
          function(response) {
            // error callback
          }
        );
    },
    getStoreInfo() {
      var that = this;
      $http
        .get("plugin.store-cashier.frontend.cashier.center.index", {
          i: this.fun.getKeyByI(),
          type: this.fun.getTyep()
        })
        .then(
          function(response) {
            // console.log("cashier::", response);

            if (response.result == 1) {
              console.log("cashier::", response.data);
              that.store = response.data.store;
              that.income = response.data.income;
              that.getStat();
              //that.credit = myData.credit;
            } else {
              that.$dialog.alert({ message: response.msg });

            }
          },
          function(response) {
            // error callback
          }
        );
    },

    getHotelInfo() {
      $http.get("plugin.hotel.frontend.cashier.center.index", { hotel_id: this.$route.params.hotel_id }, "加载中...").then(res => {
        if (res.result === 1) {
          this.store = res.data.hotel;
          this.getStat();
        }
      }).catch(error => {
        console.log(error);
      });
    }
  },
  activated() {
    this.toi = this.fun.getKeyByI();
    this.startDate = "";
    this.endDate = "";
    this.is_distribution = this.$route.name == "distribution_stat" ? true : false;
    if (this.is_distribution) {
      this.is_hotel = false;
      this.getDistribution();
    } else if (this.fun.isTextEmpty(this.$route.params.hotel_id)) {
      this.is_hotel = false;
      this.getStoreInfo();
    } else {
      this.is_hotel = true;
      this.getHotelInfo();
    }
    this.integral = window.localStorage.getItem("integral");
  },
  created() {
    this.toi = this.fun.getKeyByI();
  },
  components: { cTitle }
};
