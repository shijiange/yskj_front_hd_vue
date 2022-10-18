<template>
  <div id="rentDeposit">
    <c-title :hide="false"
             :text="`押金${this.fun.initWithdrawal()}`"></c-title>
    <div style="height: 10px;"></div>
    <div class="my_wrapper">
      <span>当前押金</span>
      <div class="my-value">{{deposit}} {{$i18n.t('元')}}</div>
    </div>
    <div class="my_wrapper">
      <!--<span>提现金额</span>-->
      <!--<div class="my-value">
				<span>{{chargeMoney}}</span> {{$i18n.t('元')}}</div>-->
      <van-field class="inp-field"  type="number"  v-model="withdraw_money" :label="`${this.fun.initWithdrawal()}金额`"   :placeholder="`请输入${this.fun.initWithdrawal()}金额`" center clearable />
    </div>
    <div style="height: 0.625rem;"></div>
    <div class="mod_btns">
      <a class="mod_btn bg_ali"
         v-if="alipay"
         @click="withdraw(2)">{{this.fun.initWithdrawal()}}到支付宝</a>
      <a class="mod_btn bg_ali"
         v-if="balance"
         @click="withdraw(3)">{{this.fun.initWithdrawal()}}到余额</a>
      <a class="mod_btn bg_wechat"
         v-if="wechat"
         @click="withdraw(1)">{{this.fun.initWithdrawal()}}微信</a>
    </div>

  </div>
</template>

<script>
import rentDeposit_controller from "./rentDeposit_controller";
export default rentDeposit_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#rentDeposit {
  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0.625rem;

    span {
      flex: 1;
      font-size: 16px;
      line-height: 1;
    }

    .my-value {
      flex: 2;
      text-align: left;

      span {
        color: red;
      }
    }
  }

  .mod_btns {
    margin: 0.625rem 0;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 16px;

    .mod_btn {
      display: block;
      width: 96%;
      margin: 1.25rem 2%;
      border-radius: 0.3125rem;
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

  /deep/.inp-field.van-cell {
    padding: 10px 0 10px 1.5rem;

    /deep/.van-field__label {
      flex: none;
      white-space: nowrap;
      width: 4.5rem;
      margin-right: 20px;
      color: #333;
      text-align: left;
      font-size: 16px;
    }

    input::placeholder {
      color: #555;
      font-size: 16px;
    }
  }
}
</style>
