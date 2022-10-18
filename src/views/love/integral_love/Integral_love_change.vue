<template>
  <div id="integral_transfer">
    <c-title :hide="false"
             :text="shiftPoint?`转化${integral.point_name||'积分'}`:`转化${integral.love_name||'爱心值'}`"> </c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>当前{{ integral.integral_name||'消费积分' }}：</span>
          <span>{{ integral.member_integral }}</span>
        </li>
        <li>
          <van-radio-group v-model="checkRadio">
            <div class="radioStyle">
              <van-radio name="1" checked-color="#ee0a24">转化给自己</van-radio>
              <van-radio name="2" checked-color="#ee0a24" style="margin-left:0.85rem">转赠他人</van-radio>
            </div>
          </van-radio-group>
        </li>
        <li class="info_b" v-if="checkRadio == '2'">
          <span>受让人ID：</span>
          <input type="text"
                 v-model="transferID"
                 @keyup="serach_nick_name"
                 placeholder="请输入您要转账的会员ID" />
        </li>
        <li class="info_b" v-if="checkRadio == '2'">
          <span>昵称：</span>
            {{nick_name}}
        </li>
      </ul>
      <div class="transfer_sum">
        <span>转化{{ integral.integral_name||'消费积分' }}</span>
        <div class="sum">
          <input type="tel"
                 v-model="transferIntegral"
                 placeholder="0.00" />
        </div>

      </div>
      <div class="explain" v-if="!shiftPoint">
        <p>例如:1个消费积分等于2个<span>{{integral.love_name||'爱心值'}}</span></p>
        <p style="color: #ccc; margin-top: 0.5rem;">注:转化比例{{integral.transformation_amount}}:{{integral.transformation_ratio}},你实际到账数为{{Number(transferIntegral)/integral.transformation_amount*integral.transformation_ratio}}</p>
      </div>
      <div class="explain" v-if="shiftPoint">
        <p>例如:1个消费积分等于2个<span>{{integral.point_name||'积分'}}</span></p>
        <p style="color: #ccc; margin-top: 0.5rem;">注:转化比例{{integral.point_transformation_amount}}:{{integral.point_transformation_ratio}},你实际到账数为{{Number(transferIntegral)/integral.point_transformation_amount*integral.point_transformation_ratio}}</p>
      </div>
      <button type="button"
              class="btn custom_color"
              @click="sureTransfer">
        确认转化
      </button>
    </div>
  </div>
</template>

<script>
import Integral_love_change_controller from './Integral_love_change_controller';

export default Integral_love_change_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.radioStyle{
  display: flex;
  align-items: center;
  padding: 0.65rem 0;
}
#integral_transfer {
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
          // width: 6.875rem;
          display: block;
          text-align: left;
        }

        input {
          border: none;
          width: 15.625rem;
        }
      }
    }

    .explain {
      padding: 0.625rem 0.875rem;
      background: #fff;
      text-align: left;
    }

    .transfer_sum {
      background: #fff;
      padding: 0.625rem 0.875rem;
      border-bottom: solid 1px #ccc;

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
}
</style>
