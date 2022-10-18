<template>
  <div id="team_rewards_record" v-if="member.nickname">
    <c-title :hide="false" :text="member.plugin_name"> </c-title>

    <div class="header_box" v-if="member.nickname">
      <div class="left">
        <div class="header">
          <img :src="member.avatar" />
        </div>
        <ul class="name">
          <li>{{ member.nickname }}</li>
        </ul>
      </div>
      <div class="right">
        <p>{{ $i18n.t("money") }}{{ member.amountTotal }}</p>
        <p>奖励总额（{{ $i18n.t("元") }}）</p>
      </div>
    </div>
    <!--<div>-->
    <!--<ul class="today_bonus">-->
    <!--<li class="date">-->
    <!--<span>{{rewards.week}}</span>-->
    <!--<br>-->
    <!--<b>本周</b>-->
    <!--</li>-->
    <!--<li class="date">-->
    <!--<span>{{rewards.yesterday}}</span>-->
    <!--<br>-->
    <!--<b>上周</b>-->
    <!--</li>-->
    <!--<li class="mounth">-->
    <!--<span>{{rewards.month}}</span>-->
    <!--<br>-->
    <!--<b>本月累计奖励</b>-->
    <!--</li>-->
    <!--<li class="line">-->
    <!--<div class="careat"></div>-->
    <!--</li>-->
    <!--</ul>-->
    <!--</div>-->
    <div class="list-cell-group">
      <div class="list-cell-title">上周期业绩</div>
      <div class="list-cell-value">{{ $i18n.t("money") }}{{ member.last_month }}</div>
    </div>
    <div class="list-cell-group">
      <div class="list-cell-title">当前周期累计业绩</div>
      <div class="list-cell-value">{{ $i18n.t("money") }}{{ member.current_month }}</div>
    </div>
    <div class="list-cell-group">
      <div class="list-cell-title">
        距离下一个阶梯还差<em style="color:#f15353;">{{ member.rest }}</em
        >元
      </div>
    </div>
    <div class="list-progress">
      <van-progress :percentage="progressNum" stroke-width="8" color="#f15353" />
    </div>

    <div class="title-box">
      <p>奖励记录</p>
      <span class="red_line"></span>
    </div>
    <div class="list_box">
      <ul class="box" v-for="(item, index) in recordsList" :key="index">
        <li style="border-bottom: 1px solid #eee;">
          <span class="order">分红ID：{{ item.id }}</span>
          <span class="sum">+{{ item.amount }}</span>
        </li>
        <li>
          <span class="time">个人业绩总额：{{ item.performance_total }}</span>
          <span class="state">奖励比例：{{ item.ratio }}%</span>
        </li>
        <li>
          <span class="time">渠道奖励金额：{{ item.lower_performance_total }}</span>
          <span class="state">{{ item.created_at }}</span>
        </li>
      </ul>
    </div>

    <div class="blank" v-if="recordsList.length <= 0">
      <img src="../../../assets/images/blank.png" />
      <span>还没有记录哦</span>
    </div>
  </div>
</template>

<script>
import index_controller from "./index_controller";

export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#team_rewards_record {
  .blank {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 6rem;
      height: 6rem;
    }

    span {
      margin-top: 15px;
      color: #ccc;
      font-size: 14px;
    }
  }

  .header_box {
    background: #f15353;
    color: #fff;
    padding: 1.25rem 0.875rem;
    display: flex;
    align-items: center;

    .left {
      flex: 1;
      display: flex;
    }

    .right {
      flex: 1;
    }

    .header {
      width: 3.25rem;
      height: 3.25rem;
      border: solid 0.125rem #fff;
      margin-right: 0.625rem;
      overflow: hidden;
      border-radius: 3.75rem;
      background: #f2f2f2;

      img {
        width: 100%;
      }
    }

    .name {
      text-align: left;

      li:first-child {
        text-align: left;
        font-size: 16px;
        line-height: 3.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .name_b {
        font-size: 14px;
        line-height: 1.375rem;
        text-align: left;
      }
    }

    .task {
      font-size: 13px;
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      right: 0.875rem;
      padding: 0.25rem 0.625rem;
      border-radius: 1rem;
    }
  }

  .info_box {
    background: #fff;
    display: flex;

    .left,
    .right {
      width: 50%;
      padding: 0.625rem 0.875rem;

      li {
        line-height: 1.5rem;
        text-align: left;
        font-size: 14px;

        span {
          font-size: 24px;
        }
      }

      li:last-child {
        color: #8c8c8c;
      }
    }
  }

  .rew_detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
    padding: 0.4rem;
    font-size: 18px;
    background: #fff;
  }

  .today_bonus {
    margin-top: 0.625rem;
    width: 100%;
    height: 5.125rem;
    background: #fff;
    padding: 1rem 0;
    box-sizing: border-box;
    position: relative;

    li.line {
      position: absolute;
      width: 0.0625rem;
      height: 3.25rem;
      background: #ddd;
      top: 1rem;
      right: 34%;

      .careat {
        width: 0.375rem;
        height: 0.375rem;
        border: 0.0625rem solid #ddd;
        border-left: 0;
        border-bottom: 0;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
        background: #fff;
        position: absolute;
        top: 1.4375rem;
        right: -0.1875rem;
      }
    }

    li {
      text-align: center;
      float: left;

      span {
        font-size: 17px;
        line-height: 1.625rem;
        margin-bottom: 0.625rem;
        display: inline-block;
      }

      b {
        font-size: 11px;
        color: #333;
      }
    }

    .date {
      width: 33%;

      span {
        color: #ffa800;
      }
    }

    li:first-child,
    li:nth-child(2) {
      border-right: 0.0625rem solid #e2e2e2;
    }

    .mounth {
      width: 33%;

      span {
        color: #fc6a70;
      }
    }
  }

  .money {
    margin-top: 0.625rem;
    margin-bottom: 0.625rem;

    .gongge {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      background: #fff;
      column-count: 3;
      padding-bottom: 0.625rem;
      padding-top: 0.625rem;

      li {
        width: 50%;
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 12px;

        i {
          flex: 0 0 1.75rem;
          font-size: 26px;
          color: #999;
          display: inline-block;
          margin-bottom: 0.375rem;
          width: 100%;
        }

        span {
          flex: 0 0 1.4rem;
          color: #333;
          font-size: 12px;
        }

        b {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #f15353;
          font-size: 16px;
        }
      }
    }
  }

  .title-box {
    margin-top: 0.5rem;
    background: #fff;
    position: relative;

    p {
      line-height: 44px;
    }

    .red_line {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background: #f44;
      z-index: 1;
    }
  }

  .list_box {
    .box {
      background: #fff;
      padding: 0.625rem 0;
      border-bottom: solid 0.0625rem #ebebeb;

      li {
        line-height: 1.875rem;
        display: flex;
        justify-content: space-between;
        padding: 0 0.875rem;
        font-size: 15px;

        .sum {
          color: #f15353;
        }

        .time {
          font-size: 12px;
          color: #8c8c8c;
        }
      }
    }
  }

  .list-cell-group {
    display: flex;
    padding: 0 0.875rem;
    line-height: 2.125rem;
    justify-content: space-between;
    background: #fff;
    .list-cell-value {
      color: #f15353;
    }
  }
  .list-progress {
    padding: 0.375rem 0.875rem 1.125rem;
    background: #fff;
  }
}
</style>
