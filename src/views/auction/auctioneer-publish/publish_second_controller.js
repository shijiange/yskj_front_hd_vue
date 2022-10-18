import cTitle from "components/title";
import { Toast } from "vant";
export default {
  data() {
    return {
      isloaing: false,
      is_examine: "",
      show: false,
      endorsement_name: "",
      form: {
        market_price: "",
        mini_markup: "",
        mini_deal: "",
        prepayment_mode: "1",
        advance_proportion: "",
        advance_money: "",
        start_shooting: "",
        end_shooting: "",
        duration: "",
        start_price: "",
        is_restart: "0",
        endorsement: "",
        em_proportion: "",
        em_mode: "1",
        fixed_price: "",
        dispatch_price: "",
        delay_before_minute: "",
        delay_cycle_minute: ""
      },
      primise: [
        {
          id: "1",
          name: "比例",
          checked: true
        },
        {
          id: "2",
          name: "固定",
          checked: false
        }
      ],
      daiyan: [
        {
          id: "1",
          name: "比例",
          checked: true
        },
        {
          id: "2",
          name: "固定",
          checked: false
        }
      ],
      startTimeTag: false,
      start_shooting: "",
      endTimeTag: false,
      end_shooting: "",
      minDate: new Date()
    };
  },
  activated() {
    console.log(this.$route.params.form);
    if (!this.$route.params.form || !this.$route.params.form.title) {
      Toast("缺少部分信息，请重新填写！");
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("publishFirst", {}));
      } else {
        this.$router.go(-1);
      }
      return;
    }
    this.initData();
    this.getAgreement();
    if (this.$route.params.form.goods_id) {
      this.getInfo();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      if (from.name == "auctionGood") {
        vm.$router.push(vm.fun.getUrl("auctioneer"));
      }
    });
  },
  methods: {
    // CurentTime(){
    //   var now = new Date();
    //
    //   var year = now.getFullYear();       //年
    //   var month = now.getMonth() + 1;     //月
    //   var day = now.getDate();            //日
    //
    //   var hh = now.getHours();            //时
    //   var mm = now.getMinutes();          //分
    //
    //   let clock = year + "/";
    //
    //   if(month < 10){
    //     clock += "0";
    //   }
    //
    //   clock += month + "/";
    //
    //   if(day < 10) {
    //     clock += "0";
    //   }
    //
    //   clock += day + " ";
    //
    //   if(hh < 10) {
    //     clock += "0";
    //   }
    //
    //   clock += hh + ":";
    //
    //   if (mm < 10) {
    //     clock += '0';
    //   }
    //
    //   clock += mm;
    //   return clock;
    // },
    //日期转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "/";
      let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes());
      return Y + M + D + h + m;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    getInfo() {
      let json = { art: "editGoods", goods_id: this.$route.params.form.goods_id };
      $http
        .get("plugin.auction.api.index.getAuctionData", json, "获取中")
        .then(response => {
          if (response.result == 1) {
            this.form.advance_money = response.data.editGoods.has_one_auction_goods.advance_money;
            this.form.advance_proportion = response.data.editGoods.has_one_auction_goods.advance_proportion;
            this.form.market_price = response.data.editGoods.market_price;
            this.form.endorsement = response.data.editGoods.has_one_auction_goods.endorsement;
            this.form.em_proportion = response.data.editGoods.has_one_auction_goods.em_proportion;
            this.form.mini_deal = response.data.editGoods.has_one_auction_goods.mini_deal;
            this.form.mini_markup = response.data.editGoods.has_one_auction_goods.mini_markup;
            this.form.start_price = response.data.editGoods.has_one_auction_goods.start_price;
            this.form.start_shooting = this.timestampToTime(response.data.editGoods.has_one_auction_goods.start_shooting);
            this.start_shooting = this.form.start_shooting;
            this.form.end_shooting = this.timestampToTime(response.data.editGoods.has_one_auction_goods.end_shooting);
            this.end_shooting = this.form.end_shooting;
            this.form.fixed_price = response.data.editGoods.has_one_auction_goods.fixed_price;
            // this.form.duration=response.data.editGoods.has_one_auction_goods.duration;
            // this.form.time_interval=response.data.editGoods.has_one_auction_goods.time_interval;
            this.form.dispatch_price = response.data.editGoods.has_one_auction_goods.dispatch_price;
            this.fun.isTextEmpty(this.form.advance_money) ? (this.form.prepayment_mode = "1") : (this.form.prepayment_mode = "2");
            this.primise.map((list, index, key) => {
              if (this.form.prepayment_mode == list.id) {
                list.checked = true;
                return list;
              } else {
                list.checked = false;
                return list;
              }
            });
            this.fun.isTextEmpty(this.form.endorsement) ? (this.form.em_mode = "1") : (this.form.em_mode = "2");
            this.daiyan.map((list, index, key) => {
              if (this.form.em_mode == list.id) {
                list.checked = true;
                return list;
              } else {
                list.checked = false;
                return list;
              }
            });
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initData() {
      this.show = false;
      this.isloaing = false;
      this.form = {
        market_price: "",
        mini_markup: "",
        mini_deal: "",
        prepayment_mode: "1",
        advance_proportion: "",
        advance_money: "",
        start_shooting: "",
        end_shooting: "",
        duration: "",
        start_price: "",
        is_restart: "0",
        endorsement: "",
        em_proportion: "",
        em_mode: "1",
        fixed_price: "",
        dispatch_price: ""
      };
      this.primise = [
        {
          id: "1",
          name: "比例",
          checked: true
        },
        {
          id: "2",
          name: "固定",
          checked: false
        }
      ];
      this.daiyan = [
        {
          id: "1",
          name: "比例",
          checked: true
        },
        {
          id: "2",
          name: "固定",
          checked: false
        }
      ];
      this.startTimeTag = false;
      this.start_shooting = "";
      this.endTimeTag = false;
      this.end_shooting = "";
    },
    chooseEnp(item) {
      this.primise.map((list, index, key) => {
        if (item.id == list.id) {
          list.checked = true;
          this.form.prepayment_mode = list.id;
          return list;
        } else {
          list.checked = false;
          return list;
        }
      });
    },
    chooseEm(item) {
      this.daiyan.map((list, index, key) => {
        if (item.id == list.id) {
          list.checked = true;
          this.form.em_mode = list.id;
          return list;
        } else {
          list.checked = false;
          return list;
        }
      });
    },
    getAgreement() {
      $http
        .get("plugin.auction.api.index.getAuctionData", {}, "获取中")
        .then(response => {
          if (response.result == 1) {
            this.is_examine = response.data.getAgreement.is_examine;
            this.endorsement_name = response.data.endorsement_name;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    back() {
      this.$router.push(this.fun.getUrl("auctioneer"));
    },
    toUp() {
      if (this.$route.params.form.goods_id) {
        this.$router.push(this.fun.getUrl("publishFirst", { id: this.$route.params.form.goods_id }));
      } else {
        this.$router.push(this.fun.getUrl("publishFirst"));
      }
    },
    showPop() {
      if (this.isloaing) {
        // 防止重复请求提交数据
        return;
      }
      let json = Object.assign(this.$route.params.form, this.form);
      // console.log(json);
      json.param_title = this.$route.params.param_title;
      if (!this.$route.params.form.goods_id) {
        let a = "";
        this.$route.params.form.content.forEach((item, index, key) => {
          a += `<img src="${item}" style="width:100%;"><br />`;
          json.content = a;
        });
      }
      json.param_value = this.$route.params.param_value;
      json.category = this.$route.params.category;
      json.art = "releaseGoods";
      json.start_shooting = String(new Date(json.start_shooting).getTime()).substring(0, 10);
      json.end_shooting = String(new Date(json.end_shooting).getTime()).substring(0, 10);
      json.prepayment_mode == 2 ? delete json.advance_proportion : delete json.advance_money;
      json.em_mode == 2 ? delete json.em_proportion : delete json.endorsement;
      delete json.em_mode;

      if (!json.start_shooting || json.start_shooting == "NaN") {
        Toast("请选择开始时间");
        return;
      }
      if (!json.end_shooting || json.end_shooting == "NaN") {
        Toast("请选择结束时间");
        return;
      }
      if (Number(json.start_shooting) >= Number(json.end_shooting)) {
        Toast("开始时间不能大于结束时间");
        return;
      }

      if (json.prepayment_mode == "1" && Number(json.advance_proportion) < 0) {
        Toast("保证金输入比例不能小于等于0");
        return;
      }

      if (json.prepayment_mode == "2" && Number(json.advance_money) < 0) {
        Toast("保证金输入金额不能小于等于0");
        return;
      }

      if (json.em_mode == "1" && Number(json.em_proportion) <= 0) {
        Toast(this.endorsement_name + "输入比例不能小于等于0");
        return;
      }

      if (json.em_mode == "2" && Number(json.endorsement) <= 0) {
        Toast(this.endorsement_name + "输入金额不能小于等于0");
        return;
      }
      this.isloaing = true;
      $http
        .post("plugin.auction.api.index.getAuctionData", json, "获取中")
        .then(response => {
          this.isloaing = false;
          if (response.result == 1) {
            if (this.is_examine == "1") {
              this.show = true;
            } else if (this.is_examine == "2") {
              let id = this.$store.state.temp.memberinfo.uid;
              this.$router.push(this.fun.getUrl("auctionGood", { id: id, goods_id: response.data.releaseGoods.goods_id }));
            }
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          this.isloaing = false;
          console.log(err);
        });
    },

    sureStartTime(e) {
      let year = e.getFullYear();
      let month = e.getMonth() + 1;
      let day = e.getDate();
      let hour = e.getHours();
      let minutes = e.getMinutes();
      this.start_shooting = year + "/" + this.getzero(month) + "/" + this.getzero(day) + " " + this.getzero(hour) + ":" + this.getzero(minutes);
      // this.start_shooting = Date.parse(e)/1000;
      this.startTimeTag = false;
      // console.log(Date.parse(e)/1000,this.start_shooting);
    },
    sureEndtTime(e) {
      let year = e.getFullYear();
      let month = e.getMonth() + 1;
      let day = e.getDate();
      let hour = e.getHours();
      let minutes = e.getMinutes();
      this.end_shooting = year + "/" + this.getzero(month) + "/" + this.getzero(day) + " " + this.getzero(hour) + ":" + this.getzero(minutes);
      // this.end_shooting = Date.parse(e)/1000;
      this.endTimeTag = false;
    },
    getzero(time) {
      return time < 10 ? "0" + time : time;
    }
  },
  components: {
    cTitle
  }
};
