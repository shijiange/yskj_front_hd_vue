<template>
  <div id="love_transfer">
    <c-title :hide="false" :text="coin_name + '转账'"></c-title>
    <div style="height: 10px;"></div>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>可用{{ coin_name }}：</span>
          <span>{{ usable }}</span>
        </li>
        <li class="info_b">
          <span>会员ID：</span>
          <input
            type="text"
            v-model="recharge_id"
            placeholder="请输入您要转账的会员ID"
          />
        </li>
      </ul>
      <div class="transfer_sum">
        <span>{{ coin_name }}</span>
        <div class="sum">
          {{$i18n.t('money')}}<input type="text" v-model="recharge_value" placeholder="0.00" />
        </div>
      </div>
      <button type="button" class="btn custom_color" @click="getBalance">
        确认转账
      </button>
      <p class="notes">
        注：转让手续费比率为{{ ratio }}%，<br />
        您实际转账到数为：{{ arrival_count }}
      </p>
    </div>
  </div>
</template>
<script>
import overseas_transfer_controller from "./overseas_transfer_controller";
export default overseas_transfer_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#love_transfer {
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

  #love_id {
    background-color: #fff;
  }

  button {
    width: 70%;
    margin: 0.9375rem;
  }

  i {
    font-size: 4.375rem;
    color: #fc0;
  }

  .notes {
    color: #8c8c8c;
  }
}
</style>
