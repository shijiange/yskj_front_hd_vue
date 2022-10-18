<template>
  <div id="love_transfer">
    <c-title :hide="false"
             :text="isTransformLoveV?`${love_name}出售`:`转化${love_name}`"></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>{{isTransformLoveV?`可出售${love_name}`:`当前${balanceLang}`}}：</span>
          <span>{{ usable }}</span>
        </li>
      </ul>
      <div class="transfer_sum">
        <span>{{isTransformLoveV?love_name:`转化${balanceLang}` }}</span>
        <div class="sum">
          {{$i18n.t('money')}}<input type="tel"
                 v-model="sell_value"
                 placeholder="0.00" />
        </div>
      </div>
      <h3 class="info_b"
          v-if="!isTransformLoveV">例如：100个{{balanceLang}}可以转化{{Math.floor(((100*rate)/100)*100)/100}}个{{love_name}}</h3>
      <button type="button"
              class="btn custom_color"
              @click="saleBalance">
        确认{{isTransformLoveV?'出售':'转化'}}
      </button>
      <p class="notes"
         v-if="isTransformLoveV">
        注：交易手续费收取{{ poundage }}%，<br />
        交易限制(最小额度){{ trading_limit }}，<br />
        交易限制(倍数) {{ trading_fold }}，<br />
        只有 {{ trading_fold }} 或 {{ trading_fold }} 的倍数是可以交易。<br />
        {{fun.isTextEmpty(trading_fetter)?'':`出售限制${trading_fetter}`}}
      </p>
      <p class="notes"
         v-if="!isTransformLoveV">
        注：转化比例为{{rate}}%，<br />
        您实际转账到数为：{{Math.floor(((sell_value*rate)/100)*100)/100}}
      </p>
    </div>
  </div>
</template>
<script>
import love_trading_sell_controller from "./love_trading_sell_controller";

export default love_trading_sell_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#love_transfer {
  .content {
    padding-bottom: 5rem;

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
          max-width: 10rem;

          /* width: 6.875rem; */
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

      p {
        border-top: solid 0.0625rem #ebebeb;
        line-height: 2.25rem;
        color: #8c8c8c;
        text-align: left;
        font-size: 14px;
      }
    }

    .info_b {
      background: #fff;
      padding-left: 0.875rem;
      font-size: 14px;
      line-height: 2.875rem;
      border-top: solid 0.0625rem #ebebeb;
      font-weight: 400;
      text-align: left;
      color: #7d7e80;
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

  button {
    width: 90%;
    margin: 1.25rem;
    height: 2.875rem;
    font-size: 16px;
  }

  i {
    font-size: 4.375rem;
    color: #f15353;
  }

  .my-banlance {
    margin: 1.25rem 0;
    font-size: 14px;
    color: #333;
    line-height: 1.875rem;
  }

  .my-banlance span {
    font-size: 14px;
    color: #333;
    margin-top: 0.625rem;
  }

  .my-banlance span b {
    font-size: 28px;
  }

  .notes {
    color: #8c8c8c;
    line-height: 1.25rem;
  }

  .transfer {
    display: inline-block;
    height: 2.875rem;
    width: 90%;
    margin: 1rem 0.9375rem;
    color: #fff;
    background-color: #13ce66;
    border-color: #13ce66;
    border-radius: 4px;

    span {
      line-height: 2.875rem;
    }
  }
}
</style>
