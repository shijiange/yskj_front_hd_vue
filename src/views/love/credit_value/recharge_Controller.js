import cTitle from "components/title";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法
import { Toast } from "vant";

export default {
  mixins: [yzPay],
  data() {
    return {
      recharge_value: "",
      pay_type: "",

      typename: "",
      recharge: "",
      ordersn: "",
      money: null,
      buttons: [],
    };
  },
  methods: {
    async getButtons() {
      let res = await $http.post("plugin.credit-inventory.frontend.controllers.recharge.index", {}, "加载中");
      if (res.result !== 1) Toast(res.msg);
      this.buttons = res.data.buttons;
    },

    initData() {
      this.buttons = [];
      this.recharge_value = "";
      this.pay_type = "";
    },

    btnclass(type) {
      if (
        type == 1 ||
        type == 6 ||
        type == 9 ||
        type == 12 ||
        type == 20 ||
        type == 22 ||
        type == 48
      ) {
        return "icon-balance_i";
      } else if (type == 2 || type == 10|| type==49 || type==52) {
        return "icon-balance_j";
      } else if (type == 18) {
        return "icon-balance_d";
      } else if (type == 19) {
        return "icon-balance_g";
      } else {
        return "icon-balance_h";
      }
    },

    // 确认充值
    confirm(type) {
      this.money = this.money && parseFloat(this.money);
      this.pay_type = type;
      if (this.money <= 0) {
        this.$dialog.alert({message:"金额不可低于0元"});
        return;
      }
      let url = "plugin.credit-inventory.frontend.controllers.recharge.handle";
      if (window.isMiniprogram) {
        url += "&client_type=2&app_type=wechat";
      }
      $http
        .post(
          url,
          { pay_way: this.pay_type, recharge_money: this.money },
          "正在充值"
        )
        .then(
          response => {
            if (response.result == 1) {
              if (this.fun.isTextEmpty(response.data.order_sn)) {
                this.$dialog.alert({message:"参数错误"});
                return false;
              }
              this.ordersn = response.data.order_sn;
              this.rechargePay(this.pay_type, response, this.ordersn, "recharge");
            } else {
              this.$dialog.alert({message:response.msg});
            }
          });
    },
  },
  activated() {
    this.initData();
    this.getButtons();
    // 判断是否显示汇聚
    // this.isShowHj();
  },
  components: { cTitle }
};
