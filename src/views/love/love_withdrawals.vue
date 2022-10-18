<template>
  <div id="love-withdrawals">
    <c-title :hide="false" :text="`${this.fun.initWithdrawal()}`"></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>可{{ this.fun.initWithdrawal() }}：</span>
          <span>{{ Data.usable || 0 }}</span>
        </li>
      </ul>
      <div class="transfer_sum">
        <span>{{ this.fun.initWithdrawal() }}金额</span>
        <div class="sum">{{ $i18n.t("money") }}<input type="number" v-model="sure_usable" max="20" placeholder="0.00" /></div>
        <div style="text-align: left;color: #999;" v-if="final_proportion_rate>0">预计需扣除{{deductPoint}}{{point}}</div>
      </div>
      <van-radio-group v-model="radio">
        <!-- 这里后面需要让后端优化返回的数据结构 -->
        <!-- 例如支持的提现类型是在数组对象里返回 ，包含对应的类型值、比例、固定金额、图标class，这样循环数组就行 -->
        <div class="transfer-to">
          <div class="title">{{ this.fun.initWithdrawal() }}到</div>
          <div class="income">
            <div class="top" v-if="withdraw_status">
              <p class="top-icon">
                <i class="iconfont icon-balance_e"></i><span>{{ this.fun.initWithdrawal() }}到收入</span>
              </p>
              <van-radio name="1" checked-color="#f15353" @click="radio = '1'"></van-radio>
              <p class="text">
                <span
                  >{{ this.fun.initWithdrawal() }}{{ love_name ? love_name : "爱心值" }}{{ fun.isTextEmpty(Data.withdraw_multiple) ? "倍数无限制" : `需要是${Data.withdraw_multiple}的整数倍` }}。</span
                ><span>{{ this.fun.initWithdrawal() }}到收入比例为{{ Data.withdraw_scale * 100 || 0 }}%</span>
              </p>
            </div>

            <div class="bottom" v-if="integralShow">
              <p class="bottom-icon">
                <i class="iconfont  icon-balance_g"></i><span>{{ this.fun.initWithdrawal() }}到{{ Data.integral_name }}</span>
              </p>
              <van-radio name="2" checked-color="#f15353" @click="radio = '2'"></van-radio>
              <p class="text">
                <span>{{ this.fun.initWithdrawal() }}到{{ Data.integral_name }}比例为{{ (Data.withdraw_integral_scale * 100).toFixed(2) || 0 }}%</span>。<span v-if="Data.proportion_switch == '1'"
                  >需扣取{{ coin.toFixed(2) || 0 }}积分</span
                >
              </p>
            </div>

            <div class="top" v-if="cmc_withdraw_status == '1'">
              <p class="top-icon">
                <i class="iconfont icon-balance_cmc"></i><span>{{ this.fun.initWithdrawal() }}到CMC</span>
              </p>
              <van-radio name="3" checked-color="#f15353" @click="radio = '3'"></van-radio>
              <p class="text">
                <span>{{ this.fun.initWithdrawal() }}到CMC比例为{{ Data.cmc_withdraw_scale * 100 || 0 }}%</span>
              </p>
            </div>

            <div class="top" v-if="balance_withdraw_status == '1'">
              <p class="top-icon">
                <i class="iconfont icon-balance_g" style="font-size: 32px; margin-right: 1rem; color: #00508e;"></i><span>{{ this.fun.initWithdrawal() }}到{{ fun.getBalanceLang() }}</span>
              </p>
              <van-radio name="4" checked-color="#f15353" @click="radio = '4'"></van-radio>
              <p class="text">
                <span
                  >{{ this.fun.initWithdrawal() }}到{{ fun.getBalanceLang() }}比例为{{
                    Data.scale_show == 0 ? (Data.balance_withdraw_scale * 100 || 0) + "%" : `1:${Data.balance_withdraw_scale}`
                  }}</span
                >
              </p>
            </div>

            <div class="top" v-if="Data.we_chat_withdraw_status == '1'">
              <p class="top-icon">
                <i class="iconfont icon-balance_i"></i><span>{{ this.fun.initWithdrawal() }}到微信</span>
              </p>
              <van-radio name="5" checked-color="#f15353" @click="radio = '5'"></van-radio>
              <p class="text">
                <span>{{ this.fun.initWithdrawal() }}到微信手续费{{ Number(Data.we_chat_fee_fixed) > 0 ? `金额${Data.we_chat_fee_fixed}元` : `比例${Data.we_chat_fee_rate}%` }}</span>
              </p>
            </div>
            <!-- 高灯 -->
            <div class="top" v-if="Data.high_light_we_chat_status == '1'">
              <p class="top-icon">
                <i class="iconfont icon-balance_i"></i><span>{{ this.fun.initWithdrawal() }}到高灯-微信</span>
              </p>
              <van-radio name="6" checked-color="#f15353" @click="radio = '6'"></van-radio>
              <p class="text">
                <span
                  >{{ this.fun.initWithdrawal() }}到高灯-微信手续费{{
                    Number(Data.high_light_we_chat_fee_fixed) > 0 ? `金额${Data.high_light_we_chat_fee_fixed}元` : `比例${Data.high_light_we_chat_fee_rate}%`
                  }}</span
                >
              </p>
            </div>
            <div class="top" v-if="Data.high_light_alipay_status == '1'">
              <p class="top-icon">
                <i class="iconfont icon-balance_j" style="color:#1677ff"></i><span>{{ this.fun.initWithdrawal() }}到高灯-支付宝</span>
              </p>
              <van-radio name="7" checked-color="#f15353" @click="radio = '7'"></van-radio>
              <p class="text">
                <span
                  >{{ this.fun.initWithdrawal() }}到高灯-支付宝手续费{{
                    Number(Data.high_light_alipay_fee_fixed) > 0 ? `金额${Data.high_light_alipay_fee_fixed}元` : `比例${Data.high_light_alipay_fee_rate}%`
                  }}</span
                >
              </p>
            </div>
            <div class="top" v-if="Data.high_light_bank_status == '1'">
              <p class="top-icon">
                <i class="iconfont icon-balance_g" style="color: #00508e;"></i><span>{{ this.fun.initWithdrawal() }}到高灯-银行卡</span>
              </p>
              <van-radio name="8" checked-color="#f15353" @click="radio = '8'"></van-radio>
              <p class="text">
                <span
                  >{{ this.fun.initWithdrawal() }}到高灯-银行卡手续费{{
                    Number(Data.high_light_bank_fee_fixed) > 0 ? `金额${Data.high_light_bank_fee_fixed}元` : `比例${Data.high_light_bank_fee_rate}%`
                  }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </van-radio-group>
      <button type="button" class="btn custom_color" v-if="isShowConfirmBtn" @click="confirm()">确认{{ this.fun.initWithdrawal() }}</button>
    </div>
  </div>
</template>
<script>
import love_withdrawals_controller from "./love_withdrawals_controller";
export default love_withdrawals_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#love-withdrawals {
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

            .iconfont {
              font-size: 32px;
              margin-right: 1rem;
            }
            .icon-balance_e {
              color: #64b42e;
            }

            .icon-balance_cmc {
              color: #20aeff;
            }

            .icon-balance_i {
              color: #64b42e;
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

            .iconfont {
              font-size: 32px;
              margin-right: 1rem;
            }
            .icon-balance_g {
              color: #fac337;
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
