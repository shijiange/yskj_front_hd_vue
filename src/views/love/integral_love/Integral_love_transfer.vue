<template>
  <div id="integral_transfer">
    <c-title :hide="false" :text="'转让'"> </c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>当前{{ name }}：</span>
          <span>{{ integral }}</span>
        </li>
        <li class="info_b">
          <span>受让人ID：</span>
          <input
            type="text"
            v-model="transferID"
            placeholder="请输入您要转账的会员ID"
          />
        </li>
      </ul>
      <div class="transfer_sum">
        <span>转账{{ name }}</span>
        <div class="sum">
          <input type="tel" v-model="transferIntegral" placeholder="0.00" />
        </div>
      </div>
      <button type="button" class="btn custom_color" @click="sureTransfer">
        确认转账
      </button>
    </div>

    <!-- <div class="content">
      <div class="transfer">
        <div class="input">
          <p>当前{{name}}：{{integral}}</p>
        </div>
        <div class="input">
          <p>受让人ID：</p><input type="text" v-model="transferID" placeholder="请输入您要转账的会员ID" title="转让">
        </div>
        <div class="input">
          <p>转账{{name}}：</p><input type="tel" v-model="transferIntegral" :placeholder="'请输入您要转账的'+name" title="转让">
        </div>
      </div>
      <div class="button" @click="sureTransfer">确认转账</div>
    </div> -->
  </div>
</template>

<script>
import Integral_love_transfer_controller from "./Integral_love_transfer_controller";

export default Integral_love_transfer_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
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
}
</style>
