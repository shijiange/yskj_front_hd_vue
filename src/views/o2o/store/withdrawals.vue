<template >
  <div id="balance_recharge">
    <c-title :hide="false"
             :text="`${this.fun.initWithdrawal()}`"></c-title>
    <div class="my_wrapper">
      <span>可{{this.fun.initWithdrawal()}}金额：</span>
      <div class="my-value"><span>{{income.sure_withdraw_money}} </span> {{$i18n.t('元')}}</div>
    </div>

    <div id="payBtnList">
      <div class="mod_btns"
           id="wechatpay">
        <a @click="confirm()"
           class="mod_btn bg_wechat">确认{{this.fun.initWithdrawal()}}</a>
      </div>
    </div>
  </div>
</template>
<script>
import withdrawals_controller from "./withdrawals_controller";
export default withdrawals_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#balance_recharge {
  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0 14px;
    line-height: 48px;

    span {
      width: 6.25rem;
      text-align: left;
      font-size: 16px;
      line-height: 3rem;
    }

    .my-value {
      flex: 2;
      text-align: left;

      span {
        color: red;
      }
    }
  }
}

.mint-field .mint-cell-title {
  width: 5rem;
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
  text-align: left;
  margin-left: 0.9375rem;
}

#payBtnList {
  .mod_btns {
    margin: 0.625rem 0;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 1rem;

    .mod_btn {
      display: block;
      width: 92%;
      margin: 1.25rem 4%;
      border-radius: 0.25rem;
    }

    .mod_btn.bg_wechat {
      background: #26ce29;
      color: #fff;
    }

    .mod_btn.bg_ali {
      background: #22aaed;
      color: #fff;
    }
  }
}
</style>
