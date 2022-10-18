import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      cash: "",
      integral: 0,
      name: ""
    };
  },
  activated() {
    this.initData();
    this.getName();
    this.getData();
    this.fun.setWXTitle(this.fun.initWithdrawal());
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
      this.cash = "";
      this.integral = 0;
      this.name = "";
    },
    getData() {
      $http
        .get("plugin.integral.Frontend.Controllers.Page.index", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.integral = response.data.member_integral;
            this.cash = "";
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    sureCash() {
      if (!this.cash) {
        Toast(`请输入${this.fun.initWithdrawal()}数额`);
        return;
      }
      if (Number(this.cash) > Number(this.integral)) {
        Toast(`输入${this.fun.initWithdrawal()}的数额超过已有的` + this.name);
        return;
      }
      $http
        .get(
          "plugin.integral.Frontend.Modules.Integral.Controllers.Withdraw",
          { change_value: this.cash },
          `$${this.fun.initWithdrawal()}中`
        )
        .then(response => {
          if (response.result === 1) {
            this.getData();
            this.$router.push(this.fun.getUrl("withdrawal"));
            Toast(`${this.fun.initWithdrawal()}成功`);
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
