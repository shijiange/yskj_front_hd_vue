<template>
  <div id="personRedPay">
    <c-title :hide="false" text="支付" />
    <div class="paybox">
      <div class="topTitle">
        <span>账户{{ balance }}：</span>
        <span style="color: #434242;">{{ member.balance }}元</span>
      </div>
      <div class="price">
        <span class="txt">支付金额</span>
        <span class="priceNum">￥{{ info.amount_total }}</span>
      </div>
      <div class="btn" @click="checkPassword">支付</div>
      <pay-keyboard :payKeyboardShow.sync="popupSpecs" @complete="onInput"></pay-keyboard>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from "vant";
import payKeyboard from "components/payKeyboard";
// import { Toast } from "vant";
export default {
  data() {
    return {
      active: 0,
      info: [],
      member: [],
      balance: "",
      popupSpecs: false,
      moreTap:false
    };
  },
  deactivated() {},
  activated() {
    console.log(this.$route.params);
    this.moreTap = false;
    if (this.$route.params.json || this.$route.params.lis) {
      this.info = JSON.parse(this.$route.params.json);
      this.member = JSON.parse(this.$route.params.lis);
    }
    if (!this.$route.params.json) {
      this.$router.push(this.fun.getUrl("personRed", {}));
    }
    this.balance = localStorage.getItem("balanceLang") ? JSON.parse(localStorage.getItem("balanceLang")).balance : "余额";
  },
  methods: {
    onInput(e) {
      console.log(e);
      this.getVerifyPassword(e);
    },
    checkPassword() {
      if (this.member.need_password) {
        this.popupSpecs = true;
      } else {
        this.postPay();
      }
    },
    postPay() {
      if(this.moreTap){
        return;
      }
      this.moreTap = true;
      let datas = JSON.stringify(this.info);
      $http
        .post("plugin.redpack-user.frontend.redpack.send", { redpack_date: datas }, "")
        .then(response => {
          if (response.result === 1) {
            console.log(response.msg);
            Toast(response.msg);
            this.$router.push(this.fun.getUrl("personRed", {}));
            this.moreTap = true;
          } else {
            this.moreTap = false;
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 验证密码
    getVerifyPassword(pwd) {
      // order.pay.wechatPay
      var that = this;
      $http.get("payment.password.check", { password: pwd }, "").then(
        function(response) {
          if (response.result == 1) {
            // 密码正确后走发布红包
            that.postPay();
          } else {
            that.$dialog
              .confirm({ message: response.msg })
              .then(() => {
                if (response.data.code == 2001) {
                  // 商城支付密码设置未开启
                  // that.$router.go(-1)
                } else if (response.data.code == 2002) {
                  // 用户未设置支付密码
                  // 去设置密码
                  that.$router.push(that.fun.getUrl("set_balance_password", {}));
                } else if (response.data.code == 2003) {
                  // 支付密码错误
                }
              })
              .catch(() => {
                if (response.data.code == 2001) {
                  // 商城支付密码设置未开启
                } else if (response.data.code == 2002) {
                  // 用户未设置支付密码
                } else if (response.data.code == 2003) {
                  // 支付密码错误
                }
              });
          }
        },
        function(response) {
          that.$dialog.alert({
            message: response.msg
          });
        }
      );
    }
  },
  components: { cTitle, payKeyboard }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.paybox {
  width: 21.88rem;
  height: 12.5rem;
  background-color: #fff;
  border-radius: 0.47rem;
  margin: 0 auto;
  margin-top: 0.63rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .btn {
    width: 14.38rem;
    height: 2.19rem;
    background-color: #f14e4e;
    border-radius: 1.09rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 0.88rem;
    margin-bottom: 0.8rem;
  }

  .price {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .txt {
      font-size: 0.75rem;
      color: #3a3a3a;
    }

    .priceNum {
      font-size: 1.56rem;
      color: #f14e4e;
    }
  }

  .topTitle {
    margin: 0 0.94rem;
    height: 2.47rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f3f3;
    font-size: 0.88rem;
  }
}
</style>
