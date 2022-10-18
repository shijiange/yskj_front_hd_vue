<template>
  <div id="auction_love_cash">
    <c-title :hide="false"
             text="保证金提现"></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>可提现金额：</span>
          <span>{{ Data.balance||0}}元</span>
        </li>
      </ul>
      <div class="transfer_sum">
        <span>提现金额</span>
        <div class="sum">
          {{$i18n.t('money')}}<input type="number"
                 v-model="sure_usable"
                 max="20"
                 placeholder="0.00" />
        </div>
      </div>
      <van-radio-group v-model="radio">
        <div class="transfer-to">
          <div class="title">提现到</div>
          <div class="income">
            <div class="top"
                 v-if="withdraw_status">
              <p class="top-icon"><i class="iconfont icon-balance_i"></i><span>提现到微信</span>
              </p>
              <van-radio name="1"
                         checked-color="#f15353"
                         @click="radio='1'"></van-radio>
            </div>
            <div class="bottom"
                 v-if="integralShow">
              <p class="bottom-icon"><i class="iconfont icon-balance_j"></i><span>提现到支付宝</span>
              </p>
              <van-radio name="2"
                         checked-color="#f15353"
                         @click="radio='2'"></van-radio>
            </div>
          </div>
        </div>
      </van-radio-group>
      <button type="button"
              class="btn custom_color"
              v-if="withdraw_status||integralShow"
              @click="confirm()">
        确认提现
      </button>
    </div>
  </div>
</template>

<script>
import auction_love_cash_controller from "./auction_love_cash_controller";

export default auction_love_cash_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#auction_love_cash {
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

      p {
        border-top: solid 0.0625rem #ebebeb;
        line-height: 2.25rem;
        color: #8c8c8c;
        text-align: left;
        font-size: 14px;
      }
    }

    .transfer-to {
      background-color: #fff;
      margin-top: 1rem;

      .title {
        text-align: left;
        padding: 0.5rem 0.875rem;
      }

      .income {
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          padding: 0.5rem 0.875rem;

          .top-icon {
            display: flex;
            align-items: center;
            font-size: 14px;
            width: 80%;

            .icon-balance_i {
              color: #64b42e;
            }

            .icon-balance_j {
              color: #069ce7;
            }

            .iconfont {
              font-size: 2rem;
              margin-right: 0.625rem;
            }
          }

          .text {
            text-align: left;
            color: #999;
          }
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          border-top: solid 1px #999;
          padding: 0.5rem 0.875rem;

          .bottom-icon {
            display: flex;
            align-items: center;
            font-size: 14px;
            width: 80%;

            .icon-balance_j {
              color: #069ce7;
            }

            .iconfont {
              font-size: 2rem;
              margin-right: 0.625rem;
            }
          }

          .text {
            text-align: left;
            color: #999;
          }
        }
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
    line-height: 3.0625rem;
    border-bottom: solid 1px #ebebeb;
    padding-left: 14px;

    span {
      width: 4rem;
      text-align: left;
      font-size: 16px;
      line-height: 3.0625rem;
    }

    .my-value {
      flex: 2;
      text-align: left;

      span {
        color: #f15353;
      }
    }
  }
}

.mint-field .mint-cell-title {
  width: 4rem;
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
  text-align: left;
  margin-left: 0.9375rem;
}

#payBtnList {
  .mod_btns {
    margin: 1.25rem auto;
    height: 2.875rem;
    line-height: 2.875rem;
    font-size: 16px;

    .mod_btn {
      display: block;
      width: 96%;
      border-radius: 0.3125rem;
    }

    .mod_btn.bg_wechat {
      margin: 0 auto;
      width: 90%;
      height: 2.875rem;
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
