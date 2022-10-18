<template>
  <div id="balance_recharge">
    <c-title :hide="false"
             :text="`${this.fun.initWithdrawal()}`"></c-title>
    <div style="height: 10px;"></div>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>冻结{{ coin_name }}：</span>
          <span>{{ froze }}{{$i18n.t('元')}}</span>
        </li>
        <li class="info_b">
          <span>可用{{ coin_name }}：</span>
          <span>{{ usable }}{{$i18n.t('元')}}</span>
        </li>
      </ul>
      <div class="transfer_sum">
        <span>{{this.fun.initWithdrawal()}}金额</span>
        <div class="sum">
          {{$i18n.t('money')}}<input type="text"
                 v-model="balance_money"
                 placeholder="0.0" />
        </div>
      </div>
      <button type="button"
              @click="confirm"
              class="btn custom_color">
        {{this.fun.initWithdrawal()}}到余额
      </button>
      <p class="notes">
        注：{{this.fun.initWithdrawal()}}手续费比率为{{ withdraw_proportion }}%，<br />
        您实际到账到数为：{{ bllw }}
      </p>
    </div>
  </div>
</template>
<script>
import overseas_balance_withdrawals from "./overseas_balance_withdrawalscontroller";
export default overseas_balance_withdrawals;
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

    .notes {
      color: #8c8c8c;
    }
  }

  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    line-height: 2.75rem;
    padding: 0 0.75rem;
    align-items: center;

    span {
      width: 7.5rem;
      text-align: left;
      font-size: 15px;
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
    font-size: 16px;

    .mod_btn {
      display: block;
      width: 96%;
      margin: 0.9375rem 2%;
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
