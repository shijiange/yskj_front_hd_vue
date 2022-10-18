import cTitle from "components/title";
import { Toast } from "vant";
import payKeyboard from "components/payKeyboard";
import { payKeyboardAsync } from "utils/payKeyboard";

export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      balance: 0,
      info_form: {
        transfer_id: "",
        transfer_money: ""
      },
      transfer_id: "",
      memberInfo: "",
      //余额字样
      balanceLang: this.fun.getBalanceLang(),

      payKeyboardShow: false, //键盘显示
      need_password: false, //是否需要验证支付密码
      has_password: false, //是否设置了支付密码

      showConfirm: false //确认转账弹窗
    };
  },
  watch: {
    transfer_id: function(new_transfer_id) {
      var that = this;
      $http
        .get(
          "member.member.memberInfo",
          {
            i: this.fun.getKeyByI(),
            type: this.fun.getTyep(),
            uid: this.transfer_id
          },
          "获取用户中"
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that.memberInfo = response.data;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            Toast(response.msg);
          }
        );
    }
  },
  methods: {
    beforeConfirm() {
      //确认转账前处理
      if (parseFloat(this.info_form.transfer_money) > parseFloat(this.balance)) {
        this.$dialog.alert({ message: "转让金额不可大于您的余额" });
        return;
      }
      if (this.transfer_id == undefined || this.transfer_id <= 0 || this.transfer_id.length == 0) {
        this.$dialog.alert({ message: "转让id不可为空" });
        return;
      }
      if (this.info_form.transfer_money == undefined || this.info_form.transfer_money <= 0 || this.info_form.length == 0) {
        this.$dialog.alert({ message: "转让金额不可低于0元" });
        return;
      }

      if (this.need_password == true && this.has_password == false) {
        this.$dialog.confirm({ message: "请先设置支付密码" }).then(() => {
          this.$router.push(this.fun.getUrl("set_balance_password", {}));
        });
        return;
      }
      this.showConfirm = true;
    },
    //确认转账
    async confirm() {
      var that = this;

      let json = {
        recipient: this.transfer_id,
        transfer_money: this.info_form.transfer_money
      };
      if (this.need_password == true) {
        //开启支付密码验证
        let pass = await this.getPayKeyboardPassword();
        json.password = pass;
      }

      $http.get("finance.balance.transfer", json, " ").then(
        function(response) {
          if (response.result === 1) {
            that.$dialog.alert({ message: response.msg }).then(() => {
              that.$router.go(-1);
            });
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },

    payComplete(text) {
      console.log(text, "页面");
      payKeyboardAsync.complete(text);
    },
    getPayKeyboardPassword() {
      this.payKeyboardShow = true;
      return new Promise((resove, reject) => {
        payKeyboardAsync.addCompleteFn(pass => {
          resove(pass);
        });
      });
      // let pass = await this.getPayKeyboardPassword();
      // console.log(pass);
    },

    getBalence() {
      $http
        .get("finance.balance.member-balance", {}, " ")
        .then(response => {
          console.log(response);
          if (response.result === 1) {
            this.balance = response.data.credit2;
            this.need_password = response.data.need_password;
            this.has_password = response.data.has_password;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  activated() {
    this.toi = this.fun.getKeyByI();
    //this.balance = this.$route.params.balance;
    this.getBalence();
  },
  components: { cTitle, payKeyboard }
};
