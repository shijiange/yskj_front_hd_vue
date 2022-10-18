import yz_pay from "components/ui_components/yz_pay";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法
import { Toast } from 'vant';

var self = null;
export default {
  mixins: [yzPay],
  beforeRouteLeave: function (to, from, next) {
    if (to.name == "HotelGoodsOrder") {
      this.$dialog.confirm({ message: "您还没完成支付，确认离开?"})
        .then(() => {
          self.$router.push(self.fun.getUrl("home", {}));
          next();
        }).catch(() => {
          next(false);
        });
    } else {
      next();
    }
  },
  data() {
    return {
      balance: 0,
      payParams: "",
      info_form: {},
      order_sn: "",
      money: "",
      buttons: [],
      typename: "",
      pay_sn: "订单编号",
      order_pay_id: "",
      uid: "",

      // 余额字样
      balanceLang: this.fun.getBalanceLang(),
    };
  },
  methods: {
    getPaycreate() {
      let _id = [];
      // 注意ids参数后台可以设置数组一键支付，数组！！！！
      let stringId = this.$route.params.id;
      _id = stringId.toString().split(",");
      $http
        .post('plugin.supplier.frontend.insOrder.create', { ids: _id, supplier_id: this.$route.params.supplier_id }, "").then(response => {
          if (response.result === 1) {
            this.order_ids = response.data.order_ids;
            this.getMultipleOrderInfo();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 多订单合并支付获取信息接口方法
    getMultipleOrderInfo() {
      // order.pay.wechatPay
      console.log("多订单合并支付获取信息接口方法");
      let json = {
        order_ids: this.order_ids,
        pid: this.$route.query.pid ? this.$route.query.pid : this.uid
      };

      if (this.fun.isCPS() && this.fun.isCPSAPPI()) {
        json.wechat_app_pay_type = "cps";
      }
      $http
        .get("order.merge-pay", json)
        .then(
          (response)=> {
            if (response.result == 1) {
              this.order_sn = response.data.order_pay.pay_sn;
              this.balance = Number(response.data.member.credit2).toFixed(2);
              this.money = Number(response.data.order_pay.amount).toFixed(2);
              this.uid = response.data.order_pay.uid;
              this.order_pay_id = response.data.order_pay.id; // 支付id
              this.buttons = response.data.buttons;
              this.typename = response.data.typename;
            } else {
              this.$dialog.confirm({ message:response.msg})
                .then(() => {
                  this.$router.push(this.fun.getUrl("home"));
                }).catch(() => {});
            }
          });
    },

  },
  activated() {
    this.getPaycreate();
    self = this;
  },
  components: {
    yz_pay
  }
};
