import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      transferID: "",
      transferIntegral: "",
      integral: 0,
      name: ""
    };
  },
  activated() {
    this.initData();
    this.getName();
    this.getData();
  },
  methods: {
    getName() {
      $http
        .get("plugin.integral.Frontend.Controllers.page.get-name", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.name = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    initData() {
      this.transferID = "";
      this.transferIntegral = "";
      this.integral = 0;
      this.name = "";
    },
    getData() {
      $http
        .get("plugin.integral.Frontend.Controllers.Page.index", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.transferID = "";
            this.transferIntegral = "";
            this.integral = response.data.member_integral;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    sureTransfer() {
      if (!this.transferIntegral) {
        Toast("请输入转让数额");
        return;
      }
      if (Number(this.transferIntegral) > Number(this.integral)) {
        Toast(`输入的${this.fun.initWithdrawal()}数额超过已有的` + this.name);
        return;
      }
      $http
        .get(
          "plugin.integral.Frontend.Modules.Integral.Controllers.Transfer",
          {
            change_value: this.transferIntegral,
            recipient_id: this.transferID
          },
          "转让中"
        )
        .then(response => {
          if (response.result === 1) {
            this.getData();
            this.$router.push(this.fun.getUrl("Integral_love_detail"));
            Toast("转让成功");
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
