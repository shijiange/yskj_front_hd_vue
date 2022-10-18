<template>
  <section id="page">
    <c-title :hide="false" text="充值"></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>当前冻结值：</span>
          <span>{{ val }}元</span>
        </li>
      </ul>
      <div class="transfer_sum">
        <span>充值金额</span>
        <div class="sum">
          {{$i18n.t('money')}}<input type="number" v-model="recharge_val" placeholder="0.00" />
        </div>
      </div>
      <div class="recharge_way">
        <ul class="choose_box">
          <!-- <li @click="submitOrder('2')">
            <i class="iconfont icon-balance_j"></i>支付宝
          </li> -->
          <!-- <li @click="submitOrder('1')">
            <i class="iconfont icon-balance_i"></i>微信
          </li> -->
          <li
            @click="submitOrder(item.value)"
            v-for="item in buttons"
            :key="item"
          >
            <i
              :class="
                item.value == '2'
                  ? 'iconfont icon-balance_j'
                  : 'iconfont icon-balance_h'
              "
              :style="item.value != '2' ? 'color: #fac337;' : 'color: #069ce7;'"
            ></i
            >{{ item.name }}
          </li>
          <!-- <li @click="submitOrder('29')" v-if="converge_alipay_pay">
            <i class="iconfont icon-balance_h" style="color: #fac337;"></i
            >支付宝支付(HJ)充值
          </li> -->
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import recharge_coin_controller from "./recharge_coin_controller.js";
export default recharge_coin_controller;
</script>

<style lang="scss" rel="stylesheet/scss">
  #page {
    padding-top: 10px;

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

      .notes {
        color: #8c8c8c;
      }
    }
  }
</style>
