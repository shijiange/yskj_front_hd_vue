import cTitle from "components/title";
const INFO_URL = "plugin.love.Frontend.Modules.Love.Controllers.recharge.page";
// let CHARGE_URL = "plugin.love.Frontend.Modules.Love.Controllers.recharge.index";
const LOVE_INDEX_URL = "plugin.love.Frontend.Controllers.page.index";
import { yzPay } from "../../utils/yz_pay"; //引入支付方法

export default {
  mixins: [yzPay],
  data() {
    return {
      value: "",
      every_value: "",
      transform_value: "",
      title: "",
      recharge_value: "",
      pay_type: "",
      AlipayShow: true,
      weixinShow: false,
      // 控制第三方汇聚的显示与隐藏
      converge_alipay_pay: false,
      converge_wechat_pay: false,

      credit2: 0,
      typename: "",
      recharge: "",
      ordersn: "",
      money: null,

      buttons: [],
    };
  },
  methods: {
    getData() {
      $http
        .get(INFO_URL, {}, "加载中")
        .then(res => {
          if (res.result === 1) {
            this.value = res.data.member_usable;
            this.every_value = res.data.recharge_rate_money;
            this.transform_value = res.data.recharge_rate_love;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getTitle() {
      $http
        .get(LOVE_INDEX_URL, {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.title = response.data.love_name;
            //设置微信title
            this.fun.setWXTitle(this.title + "充值");
            this.buttons = response.data.buttons;
          } else {
            this.$dialog.alert({message:response.msg});

          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    initData() {
      this.value = "";
      this.every_value = "";
      this.transform_value = "";
      this.title = "";
      this.recharge_value = "";
      this.pay_type = "";
      this.AlipayShow = false;
      this.weixinShow = false;
    },

    // Alipay(order_id) {
    //   this.$router.push(
    //     this.fun.getUrl("love_alipay2", { status: "11", pay_id: order_id })
    //   );
    // },
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
      this.pay_type = type;
      if (this.money <= 0) {
        this.$dialog.alert({message:"金额不可低于0元"});
        return;
      }
      this.money = parseFloat(this.money);
      let url = "plugin.love.Frontend.Modules.Love.Controllers.recharge.index";
      if (window.isMiniprogram) {
        url += "&client_type=2&app_type=wechat";
      }
      $http
        .get(
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
              this.rechargePay(this.pay_type, response, this.ordersn, 'love');
            } else {
              this.$dialog.alert({message:response.msg});
            }
          });
    },
  },
  activated() {
    if (window.isMiniprogram) {
      this.AlipayShow = false;
    }
    this.initData();
    this.getData();
    this.getTitle();
    // 判断是否显示汇聚
    // this.isShowHj();
  },
  components: { cTitle }
};
