<template>
  <div id="balance_recharge">
    <c-title :hide="false" text="充值"></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>当前{{ balanceLang }}：</span>
          <span>{{ credit2 }}</span>
        </li>
      </ul>
      <div class="transfer_sum">
        <span>充值金额</span>
        <div class="sum">{{ $i18n.t("money") }}<input type="number" v-model.trim="money" placeholder="0.00" /></div>
      </div>

      <div class="activity_des" v-if="activatDes.sale && activatDes.sale.length > 0">
        <span class="title">活动说明</span>
        <ul>
          <li class="activity-item">
            活动时间：
            <span class="start-time">{{ activatDes.recharge_activity_start }}</span>
            -
            <span class="end-time">{{ activatDes.recharge_activity_end }}</span>
          </li>
          <li class="activity-item">
            参与次数：
            <span v-if="activatDes.recharge_activity_fetter == -1 || activatDes.recharge_activity_fetter == 0">不限</span>
            <span v-else>每人最多参与{{ activatDes.recharge_activity_fetter }}次</span>
          </li>
          <li class="activity-item">
            活动优惠：
            <span v-for="(item, index) in activatDes.sale" :key="index">
              充值满{{ item.enough }}元赠送
              <span style="color: red; font-weight: 600;">{{ discountType(item.give) }}</span>
              <span v-if="index < activatDes.sale.length - 1">,</span>
            </span>
          </li>
          <li class="activity-item" v-if="activatDes.reward_points">
            <span>
              充值赠送<span style="color: red; font-weight: 600;">{{ activatDes.reward_points.rate }}%</span> {{ activatDes.reward_points.name }}
            </span>
          </li>
        </ul>
      </div>

      <div class="recharge_way" v-if="recharge == 1">
        <h1>充值方式</h1>
        <ul class="choose_box">
          <li @click="confirm(btn.value)" v-for="(btn, i) in buttons" :key="i">
            <i class="iconfont" :class="[btnclass(btn.value)]"> </i>
            {{ btn.name }}{{ typename }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import member_balance_recharge from "./member_balance_rechargecontroller";
export default member_balance_recharge;
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

    .activity_des {
      background: #fff;
      padding: 0.625rem 0.875rem;
      margin-top: 0.625rem;
      text-align: left;

      .title {
        display: block;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      li {
        position: relative;
        margin: 0.6rem 0.2rem 0.6rem 1rem;

        span {
          font-size: 12px;
        }
      }

      .activity-item::after {
        position: absolute;
        content: "";
        top: 50%;
        left: -0.5rem;
        transform: translateY(-50%);
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: black;
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

    .bottom_btn {
      width: 100%;
      background: #fff;
      padding: 0.625rem 0;
      position: fixed;
      bottom: 0;
      border-top: solid 0.0625rem #ebebeb;

      .btn {
        width: 21.5625rem;
        margin: 0 auto;
        height: 2.875rem;
        border-radius: 0.25rem;
        font-size: 16px;
        color: #fff;
        background: #f15353;
        border: none;
      }
    }
  }

  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0 14px;
    line-height: 3.0625rem;
    height: 3.0625rem;

    span {
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
  width: 5rem;
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
  text-align: left;
  margin-left: 0.9375rem;
}
</style>
