import cTitle from "components/title";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法
export default {
  mixins: [yzPay],
  data() {
    return {
      credit2: 0,
      buttons: [],
      typename: "",
      recharge: "",
      ordersn: "",
      money: "",
      activatDes: {},

      // 选择的充值方式
      pay_type: "",
      // 余额字样
      balanceLang: this.fun.getBalanceLang(),

      isOpenCmc: false //首次需要验证是否开启cmc
    };
  },

  computed: {
    discountType (num) {
      return num => {
        num = num ? num : 0;
        if (this.activatDes.proportion_status == 0) {
          return num + '元';
        } else {
          return num + '%';
        }
      };
    }
  },
  methods: {
    // 初始化参数
    getData() {
      $http.get("finance.balance.balance").then(
        (response)=> {
          if (response.result == 1) {
            this.credit2 = response.data.credit2;
            this.buttons = response.data.buttons;
            this.typename = response.data.typename;
            this.recharge = response.data.recharge;
            this.activatDes = response.data.remark;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        });
    },
    // 确认充值
    confirm(type) {
      this.pay_type = type;
      if (!this.money || this.money <= 0) {
        this.$dialog.alert({ message: "输入值不能小于0" });
        return;
      }
      if (type == 202006 && !this.isOpenCmc) {
        this.isHaveCmcInfo();
        return;
      }
      this.money = parseFloat(this.money);
      let url = "finance.balance.recharge"; // "&client_type=2&app_type=wechat"
      if (window.isMiniprogram) {
        url += "&client_type=2&app_type=wechat";
      }
      $http.get(url, { pay_type: this.pay_type, recharge_money: this.money }, "正在充值").then(
        response => {
          if (response.result == 1) {
            if (this.fun.isTextEmpty(response.data.ordersn)) {
              this.$dialog.alert({ message: "参数错误" });
              return false;
            }
            this.ordersn = response.data.ordersn;
            this.rechargePay(this.pay_type, response, this.ordersn, "balance");
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        });
    },
    isHaveCmcInfo() {
      $http.get("plugin.cmc-pay.frontend.account.get-cmc-account", {}, "").then(
        (response)=> {
          if (response.result === 1) {
            this.isOpenCmc = true;
            this.confirm(202006);
          } else {
            this.$dialog.alert({ message: "没有CMC账号！" });
            this.$router.push(this.fun.getUrl("cmcPayInfo", {}));
          }
        });
    },
    btnclass(type) {
      if (type == 1 || type == 6 || type == 9 || type == 12 || type == 20 || type == 22) {
        return "icon-balance_i";
      } else if (type == 2 || type == 10) {
        return "icon-balance_j";
      } else if (type == 18) {
        return "icon-balance_d";
      } else if (type == 19) {
        return "icon-balance_g";
      } else {
        return "icon-balance_h";
      }
    },
  },
  activated() {
    window.scrollTo(0, 0);
    console.log(this.$route.params);
    this.pay_type = "";
    this.money = "";
    if (this.$route.params.num) {
      this.money = this.$route.params.num;
    }
    this.getData(); // 初始化参数
  },
  components: { cTitle }
};
