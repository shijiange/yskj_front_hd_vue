import { Toast } from "vant";
import yz_pay from "components/ui_components/yz_pay";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法
export default {
  mixins: [yzPay],
  data() {
    return {
      balance: 0,
      info_form: {},
      passwordInfo: {},
      order_sn: "",
      money: "",
      buttons: [],
      typename: "",
      pay_sn: "订单编号",
      order_pay_id: "",
      uid: "",
      pageUrl: "",
      // 余额字样
      balanceLang: this.fun.getBalanceLang(),

    };
  },
  methods: {
    getData() {
      let that = this;
      //获取支付方式
      $http.get("plugin.luck-draw.frontend.team.getPayType", {}, "获取中").then(
        function(response) {
          if (response.result === 1) {
            that.buttons = response.data.buttons;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    confirm(data, pwd) {
      //选择了支付方式
      if (data.need_password && !pwd) {
        this.passwordInfo = data;
        this.popupSpecs = true;
        return;
      }

      let json = {
        activity_id: this.info_form.activity_id,
        total: this.info_form.total,
        pay_id: data.value,
        money: this.info_form.money * this.info_form.total,
        pid: this.info_form.pid || 0,
        address: this.info_form.address
      };
      $http
        .get("plugin.luck-draw.frontend.team.payJoinActivity", json, "支付中...")
        .then(response => {
          if (response.result == 1) {
            this.handleOtherPay(data, response, "newDraw");
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          this.$dialog.alert({ message: error });
        });
    },
  },
  activated() {
    if (this.$route.params.datas) {
      this.info_form = JSON.parse(this.$route.params.datas);
    } else {
      Toast("缺少支付参数");
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    }
    this.getData();
  },
  components: {
    yz_pay
  }
};
