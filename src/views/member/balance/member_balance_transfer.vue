<template>
  <div id="balance_recharge">
    <c-title :hide="false" text="转账"></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>当前{{ balanceLang }}：</span>
          <span>{{ balance }}元</span>
        </li>
        <li class="info_b">
          <span>受让人ID：</span>
          <input type="text" v-model.lazy="transfer_id" placeholder="请输入受让人ID" />
        </li>
      </ul>
      <div class="transfer_sum">
        <span>转账金额</span>
        <div class="sum">{{ $i18n.t("money") }}<input type="text" v-model="info_form.transfer_money" placeholder="" /></div>
      </div>
      <ul class="personal_info" v-if="memberInfo">
        <li>
          <span>昵称：</span>
          <span>{{ memberInfo.nickname }}</span>
        </li>
        <li>
          <span>姓名：</span>
          <span>{{ memberInfo.realname }}</span>
        </li>
      </ul>
      <button type="button" class="btn custom_color" @click="beforeConfirm">
        确认转账
      </button>
    </div>

    <pay-keyboard :payKeyboardShow.sync="payKeyboardShow" @complete="payComplete"></pay-keyboard>

    <van-dialog v-model="showConfirm" title="" show-cancel-button @confirm="confirm">
      <div class="confirm-transfer-popup">
        <div class="confirm-transfer-popup-li">受让人ID：{{ transfer_id }}</div>
        <div class="confirm-transfer-popup-li">受让人昵称：{{ memberInfo.nickname }}</div>
        <div class="confirm-transfer-popup-li">受让人姓名：{{ memberInfo.realname }}</div>
        <div class="confirm-transfer-popup-li">转账金额：{{ info_form.transfer_money }}</div>
        <div class="confirm-transfer-popup-warn">您是否确定转账？</div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import member_balance_transfer from "./member_balance_transfercontroller";
export default member_balance_transfer;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#balance_recharge {
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
        font-size: 24px;

        input {
          margin-left: 0.375rem;
          line-height: 3.75rem;
          width: 90%;
          font-size: 36px;
          border: none;
        }
      }
    }

    .personal_info {
      margin-top: 0.625rem;
      background: #fff;
      padding-left: 0.875rem;

      li {
        line-height: 2.875rem;
        display: flex;
        font-size: 16px;
        border-bottom: solid 0.0625rem #ebebeb;
        text-align: left;

        span:first-child {
          display: block;
          width: 6.875rem;
        }
      }

      li:last-child {
        border: none;
      }
    }

    .btn {
      width: 21.5625rem;
      margin: 1.25rem auto;
      height: 2.875rem;
      border-radius: 0.25rem;
      font-size: 16px;
      color: #fff;
      background: #f15353;
      border: none;
    }
  }

  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0 0.875rem;

    span {
      text-align: left;
      font-size: 16px;

      /* line-height: 1; */
    }

    .my-value {
      flex: 2;
      text-align: left;

      span {
        color: #f15353;
      }
    }
  }

  #wrapper {
    border-bottom: solid 0.0625rem #d9d9d9;
    margin-top: 0.625rem;
  }

  .confirm-transfer-popup {
    padding: 1rem;
    .confirm-transfer-popup-li {
      font-size: 12px;
      text-align: left;
      margin-bottom: 10px;
    }
    .confirm-transfer-popup-warn {
      text-align: center;
      color: #f15353;
      font-size: 16px;
    }
  }
}
</style>
