<template>
  <div id="dealer_award">
    <c-title :hide="false" :text="'经销商奖励'"> </c-title>
    <div class="header">
      <ul class="box">
        <li class="left">
          <span class="line">经销商等级：{{ level_name }}</span>
        </li>
        <li class="right">
          <span class="right_a line"
            ><font>{{ $i18n.t('money') }}</font
            >{{ total_dividend }}</span
          >
          <span class="right_b">已奖励总额</span>
        </li>
      </ul>
    </div>
    <div class="title">
      <div class="block"></div>
      <span>赠送记录</span>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <div class="reward_list">
        <ul class="wrapper-box">
          <li class="box" v-for="(item, index) in award" @click="detailTo(item.id)" :key="index">
            <div>
              <span>奖励ID：{{ item.id }}</span>
              <span>{{ item.dividend_amount }}元</span>
            </div>
            <div>
              <span class="time">{{ item.created_at }}</span>
            </div>
          </li>
        </ul>
      </div>
    </van-pull-refresh>
    <h2 v-if="isShowNoTest" class="isShowNoTest">暂无数据</h2>
  </div>
</template>

<script>
import dealer_award_controller from './dealer_award_controller';

export default dealer_award_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#dealer_award {
  .header {
    background: #f15353;
    padding: 0.875rem;

    .box {
      color: #fff;
      display: flex;
      justify-content: space-between;

      li {
        span {
          display: block;
        }

        .line {
          line-height: 1.875rem;
          height: 1.875rem;
        }
      }

      .left {
        text-align: left;
        font-size: 16px;
      }

      .right {
        text-align: right;

        .right_a {
          font-size: 24px;
          margin-bottom: 0.375rem;

          font {
            font-size: 16px;
          }
        }

        .right_b {
          opacity: 0.6;
        }
      }
    }
  }

  .title {
    height: 2.5rem;
    line-height: 2.5rem;
    padding: 0 0.875rem;
    display: flex;
    align-items: center;

    .block {
      width: 0.25rem;
      height: 1rem;
      background: #f15353;
      margin-right: 0.625rem;
      border-radius: 0.0625rem;
    }

    span {
      font-size: 16px;
      text-align: left;
    }
  }

  .reward_list {
    background: #fff;

    .wrapper-box {
      .box {
        padding: 0.2rem 0;
        border-bottom: solid 1px #ccc;

        div {
          display: flex;
          justify-content: space-between;
          padding: 0 0.875rem;
          line-height: 1.875rem;
          font-size: 15px;

          .time {
            color: #8c8c8c;
            font-size: 14px;
          }
        }
      }

      .box:last-child {
        border-bottom: none;
      }
    }
  }
}

.isShowNoTest {
  color: #f15353;
}
</style>
