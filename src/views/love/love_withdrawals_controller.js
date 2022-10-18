import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      radio: "",
      toi: this.fun.getKeyByI(),
      Data: {},
      integralShow: false,
      sure_usable: "",
      love_name: "", //爱心值自定义名称
      withdraw_status: false,
      cmc_withdraw_status: "0",
      balance_withdraw_status: "0",
      final_proportion_rate:0,
      point:"积分"
    };
  },
  activated() {
    this.iniData();
    //获取数据
    this.getStoreInfo();
    this.fun.setWXTitle(this.fun.initWithdrawal());
    this.getPoint();
  },
  computed: {
    coin: function() {
      return Number(this.sure_usable) * Number(this.Data.withdraw_integral_scale) * Number(this.Data.integral_withdraw_proportion / 100);
    },
    deductPoint(){
      return  (this.sure_usable * (this.final_proportion_rate / 100)).toFixed(2)
    }
  },
  methods: {
    getPoint(){
      let yz_basic_info = window.localStorage.getItem("yz_basic_info");
      if(yz_basic_info) this.point =  JSON.parse(yz_basic_info).point || "积分";
    },
    iniData() {
      this.Data = {};
      this.integralShow = false;
      this.withdraw_status = false;
      this.sure_usable = "";
      // this.radio = "1";
      this.toi = this.fun.getKeyByI();
    },
    getStoreInfo() {
      var that = this;
      $http.get("plugin.love.Frontend.Modules.Love.Controllers.withdraw.page", {}, " ").then(
        response => {
          if (response.result === 1) {
            that.Data = response.data;
            that.integralShow = that.Data.integral_withdraw_status;
            that.withdraw_status = that.Data.withdraw_status;
            that.cmc_withdraw_status = that.Data.cmc_withdraw_status;
            that.balance_withdraw_status = that.Data.balance_withdraw_status;
            // if (!that.withdraw_status && that.integralShow) {
            //   that.radio = "2";
            // }
            // if (that.withdraw_status && !that.integralShow) {
            //   that.radio = "1";
            // }
            // if (that.withdraw_status && that.integralShow) {
            //   that.radio = "1";
            // }
            that.love_name = response.data.love_name;
            that.final_proportion_rate = response.data.final_proportion_rate;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    isShowConfirmBtn() {
      if (
        this.withdraw_status ||
        this.integralShow ||
        this.balance_withdraw_status == "1" ||
        this.Data.we_chat_withdraw_status == "1" ||
        this.Data.high_light_we_chat_status == "1" ||
        this.Data.high_light_alipay_status == "1" ||
        this.Data.high_light_bank_status == "1"
      )
        return true;
    },
    confirm() {
      //withdraw_money
      var that = this;

      if (this.sure_usable == undefined || this.sure_usable <= 0) {
        that.$dialog.alert({ message: `${this.fun.initWithdrawal()}数值不可低于0` });
        return;
      }
      if (!this.radio) {
        this.$dialog.alert({ message: "请选择提现类型" });
        return;
      }
      let json = { change_value: this.sure_usable, withdraw_type: this.radio };
      $http.get("plugin.love.Frontend.Modules.Love.Controllers.withdraw.index", json, "正在提交数据").then(
        function(response) {
          if (response.result == 1 && response.data.type == "1") {
            that.$router.push(that.fun.getUrl("withdrawal"));
          } else if (response.result == 1 && response.data.type == "2") {
            that.$dialog.alert({ message: response.msg }).then(() => {
              that.$router.go(-1);
            });
          } else {
            that.$dialog.alert({ message: response.msg });
            let high_light = ["6", "7", "8"]; //提现高灯
            if (high_light.indexOf(this.radio) > -1) {
              //填写高灯信息
              let _pay_type = "";
              switch (type) {
                case "6":
                  _pay_type = "high_light_wechat";
                  break;
                case "7":
                  _pay_type = "high_light_alipay";
                  break;
                case "8":
                  _pay_type = "high_light_bank";
                  break;
                default:
                  break;
              }
              that.$router.push(that.fun.getUrl("HighLight", { value: _pay_type }));
            }
          }
        },
        function(response) {
          // error callback
        }
      );
    }
  },

  components: { cTitle }
};
