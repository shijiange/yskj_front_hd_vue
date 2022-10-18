<template>
  <div id="balance_recharge">
    <c-title :hide="false" :text="`${fun.initWithdrawal()}`"></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <!-- <span>当前{{ balanceLang }}：</span> -->
          <span>可提现金额：</span>
          <span>{{ balance }}元</span>
        </li>
      </ul>
      <div class="transfer_sum">
        <span>{{ supplier ? poundage_name : `${fun.initWithdrawal()}金额` }}</span>
        <div class="sum">
          <div v-if="supplier">
            <em v-if="service_type == 0">{{ $i18n.t("money") }}</em>
            <input type="number" v-model="service_money" disabled /><em v-if="service_type == 1">%</em>
          </div>
          <div v-if="!supplier">
            {{ $i18n.t("money") }}
            <input type="number" v-model="info_form.balance_money" placeholder="0.00" />
          </div>
        </div>
        <p>{{ poundage }}</p>
        <p v-if="withdraw_multiple > 1" style="border: none; line-height: 1rem;">
          提现金额需要是 <em style="font-weight: bold;">{{ withdraw_multiple }}</em> 的整倍数
        </p>
      </div>
      <div class="recharge_way">
        <h1>{{ fun.initWithdrawal() }}到</h1>
        <ul class="choose_box">
          <li v-if="withdrawToWechat" @click="confirm('1')"><i class="iconfont icon-balance_i"></i>微信</li>
          <li v-if="withdrawToAlipay" @click="confirm('2')"><i class="iconfont icon-balance_j"></i>支付宝</li>
          <li v-if="withdrawToManual" @click="confirm('3')"><i class="iconfont icon-balance_e"></i>{{ manual_name }}</li>
          <li v-if="eupshow" @click="confirm('4')"><i class="iconfont icon-balance_g"></i>EUP提出</li>
          <li v-if="hxShow" @click="confirm('5')"><i class="iconfont icon-balance_f"></i>银行卡</li>
          <li v-if="converge_pay" @click="confirm('6')"><i class="iconfont icon-balance_h"></i>{{ fun.initWithdrawal() }}到银行卡-HJ</li>
          <li @click="towithdrawal(index)" v-for="(type, index) of withdrawType" :key="index">
            <i class="iconfont" :class="type == `汇聚${fun.initWithdrawal()}` ? 'iconfont icon-balance_h' : [btnclass(index)]"></i>{{ type }}
          </li>
          <li v-if="info.high_light_wechat" @click="confirm('7')"><i class="iconfont icon-balance_g"></i>提现到微信-{{highLightName}}</li>
          <li v-if="info.high_light_alipay" @click="confirm('8')"><i class="iconfont icon-balance_g"></i>提现到支付宝-{{highLightName}}</li>
          <li v-if="info.high_light_bank" @click="confirm('9')"><i class="iconfont icon-balance_g"></i>提现到银行卡-{{highLightName}}</li>
        </ul>
      </div>
    </div>

    <!-- 提现到银行卡弹窗 -->

    <van-popup v-model="popupVisible" style="width: 72%; border-radius: 0.375rem;">
      <form :action="action" method="post" style="width: 100%; height: 100%;">
        <h1 style="font-size: 16px; color: #333; padding: 1.25rem 0; line-height: 2.25rem; font-weight: normal; border-bottom: solid 0.0625rem #ebebeb;">
          {{ notice }}
        </h1>
        <input type="text" name="ipsRequest" :value="msg" style="display: none; margin-top: 0.625rem;" />
        <input type="submit" value="确认" style="width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 16px; color: #26a2ff; border: none;" />
      </form>
    </van-popup>
    <!-- 提现银行卡 -->
    <van-popup v-model="show2" position="bottom" :style="{ height: '55%' }">
      <div class="withdrawal_box">
        <i class="fa fa-angle-left" style="display: inline-block; text-align: left; font-size: 24px; float: left; line-height: 2.875rem; height: 2.875rem; padding-left: 10px;" @click="backTap"></i>
        <h2 style="display: inline-block;">提现</h2>

        <div class="recharge_way">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 10px; border-bottom: 1px solid #fafafa;" @click="gotoList">
            <h2 style="text-align: left;">银行卡：{{ checkObj.bankName }}</h2>

            <i class="fa fa-angle-right" style="font-size: 24px;"></i>
          </div>

          <ul class="choose_box" style="margin: 0 20px;">
            <li style="display: flex; justify-content: space-between; padding: 3px 0;">
              <span>提现金额(元)</span>
              <span>{{ cost_money }}</span>
            </li>
            <li style="display: flex; justify-content: space-between; padding: 3px 0;">
              <span>{{ poundage_name }}(元)</span>
              <span>{{ poundageHj }}</span>
            </li>
            <li style="display: flex; justify-content: space-between; padding: 3px 0;">
              <span>实际到账(元)</span>
              <span>{{ actual_amount }}</span>
            </li>
          </ul>
        </div>
        <button v-if="!supplier" type="button" class="btn custom_color" @click="withGotiem">确认提现</button>
        <button v-if="supplier" type="button" class="btn custom_color" @click="suppierGotiem">确认提现</button>
      </div>
    </van-popup>
    <!-- 银行卡列表 -->
    <van-popup v-model="show3" position="bottom" :style="{ height: '55%' }">
      <div class="withdrawal_box">
        <i
          class="fa fa-angle-left"
          style="display: inline-block; text-align: left; font-size: 24px; float: left; line-height: 2.875rem; height: 2.875rem; padding-left: 10px;"
          @click="show3 = false"
        ></i>
        <h2 style="display: inline-block; line-height: 2.875rem; height: 2.875rem;">银行卡列表</h2>
        <i class="iconfont icon-close11" style="display: inline-block; float: right; line-height: 2.875rem; height: 2.875rem; padding-right: 10px;" @click="show3 = false"></i>
        <div class="recharge_way">
          <ul class="choose_box" style="padding-top: 20px;">
            <li
              v-for="item in withList"
              :key="item"
              @click="checkOut(item)"
              style="padding-bottom: 10px; margin: 5px; border-bottom: 1px solid #fafafa; display: flex; align-items: flex-end; justify-content: flex-end;"
            >
              <div style="flex: 1; width: 50%; text-align: left;">
                <!-- <span><i class="iconfont icon-wode-wode"></i></span> -->
                <span>{{ item.bankName }}</span>
              </div>
              <div style="flex: 0 0 32px;">
                <van-checkbox style="position: relative;" v-model="item.check" checked-color="#f45054"></van-checkbox>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>

    <pay-keyboard :payKeyboardShow.sync="payKeyboardShow" @complete="payComplete"></pay-keyboard>
  </div>
</template>
<script>
import member_balance_withdrawals from "./member_balance_withdrawalscontroller";

export default member_balance_withdrawals;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#balance_recharge {
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

      p {
        border-top: solid 0.0625rem #ebebeb;
        line-height: 2.25rem;
        color: #8c8c8c;
        text-align: left;
        font-size: 14px;
      }
    }

    .recharge_way {
      background: #fff;
      margin-top: 0.625rem;

      h1 {
        line-height: 2.5rem;
        text-align: left;
        padding: 0 0.875rem;
        font-size: 16px;
      }

      li {
        position: relative;
        display: flex;
        align-items: center;
        line-height: 3.5rem;
        font-size: 16px;
        margin-left: 1.25rem;
        padding-right: 1.25rem;
        border-bottom: solid 0.0625rem #ebebeb;

        .iconfont_bg {
          background: #f15353;
          width: 2.25rem;
          height: 1.5rem;
          border-radius: 0.1875rem;
          display: flex;
          align-items: center;
          margin-right: 0.625rem;
        }

        .icon-balance_d {
          color: #00908c;
        }

        .icon-balance_e {
          color: #64b42e;
        }

        .icon-balance_f {
          color: #fac337;
        }

        .icon-balance_g {
          color: #00508e;
        }

        .icon-balance_h {
          color: #fac337;
        }

        .icon-balance_i {
          color: #64b42e;
        }

        .icon-balance_j {
          color: #069ce7;
        }

        .icon-balance_z {
          background-image: url(../../../assets/images/pay_e.png);
        }

        .iconfont {
          font-size: 2rem;
          margin-right: 0.625rem;
        }
      }

      li:last-child {
        border: none;
      }
    }

    .withdrawal_box {
      h2 {
        background: #fff;
        line-height: 2.875rem;
        font-size: 16px;
        border-bottom: solid 0.0625rem #ebebeb;
        z-index: 10;

        .icon-close11 {
          width: 3rem;
          display: inline-block;
          position: absolute;
          right: 0;
          font-size: 1rem;
          color: #666;
        }
      }

      .recharge_way {
        background: #fff;

        li {
          position: relative;
          display: flex;
          align-items: center;
          line-height: 3.5rem;
          font-size: 16px;
          margin-left: 1.25rem;
          padding-right: 1.25rem;

          /* border-bottom: solid 0.0625rem #ebebeb; */
          span {
            font-size: 13px;
            color: #8c8c8c;
          }

          .iconfont_bg {
            background: #f15353;
            width: 2.25rem;
            height: 1.5rem;
            border-radius: 0.1875rem;
            display: flex;
            align-items: center;
            margin-right: 0.625rem;
          }

          .icon-balance_d {
            color: #00908c;
          }

          .icon-balance_e {
            color: #64b42e;
          }

          .icon-balance_f {
            color: #fac337;
          }

          .icon-balance_g {
            color: #00508e;
          }

          .icon-balance_h {
            color: #fac337;
          }

          .icon-balance_i {
            color: #64b42e;
          }

          .icon-balance_j {
            color: #069ce7;
          }

          .icon-balance_z {
            background-image: url(../../../assets/images/pay_e.png);
          }

          .iconfont {
            font-size: 2rem;
            margin-right: 0.625rem;
          }
        }
      }
    }
  }

  .btn {
    width: 21.5625rem;
    margin: 1.25rem auto;
    height: 2.875rem;
    border-radius: 5rem;
    font-size: 16px;
    color: #fff;
    background: #f15353;
    border: none;
  }
}
</style>
