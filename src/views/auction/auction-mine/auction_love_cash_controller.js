import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      radio: "1",
      Data: {},
      integralShow: false,
      sure_usable: "",
      withdraw_status: false
    };
  },
  activated() {
    this.iniData();
    //获取数据
    this.getStoreInfo();
  },
  computed: {
  },
  methods: {
    iniData() {
      this.Data = {};
      this.integralShow = false;
      this.withdraw_status = false;
      this.sure_usable = "";
      this.radio = "1";
    },
    getStoreInfo() {
      var that = this;
      $http
        .get(
          "plugin.auction.api.prepayment.withdraw.page",
          {},
          " "
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that.Data = response.data;
              that.integralShow = that.Data.alipay;
              that.withdraw_status = that.Data.wechat;
              if (!that.withdraw_status && that.integralShow) {
                that.radio = "2";
              }
              if (that.withdraw_status && !that.integralShow) {
                that.radio = "1";
              }
              if (that.withdraw_status && that.integralShow) {
                that.radio = "1";
              }
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    confirm() {
      //withdraw_money
      var that = this;

      if (this.sure_usable == undefined || this.sure_usable <= 0) {
        that.$dialog.alert({message:'提现数值不可低于0'});
        return;
      }

      let json = { withdraw_money: this.sure_usable, withdraw_type: this.radio };
      $http
        .get(
          "plugin.auction.api.prepayment.withdraw.withdraw",
          json,
          "正在提交数据"
        )
        .then(
          function(response) {
            if (response.result == 1) {
              Toast(response.msg);
              that.$router.push(that.fun.getUrl("auctionLove"));
            } else {
              that.$dialog.alert({message:'提现数值不可低于0'});
              that.$router.go(-1);
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
