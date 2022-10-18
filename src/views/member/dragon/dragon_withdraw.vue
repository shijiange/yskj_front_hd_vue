<template>
  <div id="dragon_withdraw">
    <c-title :hide="false"
             text="提现"></c-title>
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>当前余额：</span>
          <span>{{info}}元</span>
        </li>
      </ul>
      <div class="transfer_sum">
        <span>提现余额金额</span>
        <div class="sum">
          <div>
            {{$i18n.t('money')}}<input type="number"
                   v-model="money"
                   placeholder="0.00" />
          </div>
        </div>
      </div>
      <div class="btn"
           @click="confirm()">
        确认提现
      </div>
    </div>
  </div>
</template>

<script>
import dragon_withdraw_controller from "./dragon_withdraw_controller";
export default dragon_withdraw_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#dragon_withdraw {
  .content {
    .transfer_info {
      background: #fff;
      padding-left: 0.875rem;
      font-size: 16px;

      .info_a,
      .info_b {
        line-height: 2.875rem;
        border-bottom: solid 0.0625rem #ebebeb;
        display: flex;
        justify-content: flex-start;

        span:first-child {
          width: 6.875rem;
          display: block;
          text-align: left;
        }

        input {
          border: none;
          width: 15.625rem;
        }
      }
    }

    .transfer_sum {
      background: #fff;
      padding: 0.625rem 0.875rem;

      span {
        display: block;
        font-size: 16px;
        line-height: 2.5rem;
        text-align: left;
      }

      .sum {
        text-align: left;
        font-size: 18px;

        input {
          margin-left: 0.375rem;
          line-height: 2rem;
          color: #666;
          width: 90%;
          font-size: 20px;
          border: none;
        }
      }
    }

    .btn {
      margin: 0 auto;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      width: 80%;
      height: 3rem;
      border-radius: 0.25rem;
      color: #fff;
      background-color: #f15353;
    }
  }
}
</style>
