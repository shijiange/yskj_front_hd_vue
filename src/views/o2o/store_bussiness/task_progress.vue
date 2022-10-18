<template>
  <div class="page">
    <c-title :hide="false" text="店商联盟"></c-title>

    <div class="listData">
      <div class="listItem" v-for="item in listData" :key="item.id">
        <div class="title">任务：{{ item.task_reward_day }}天内推广增加{{ item.task_reward_stores }}家门店，可获得{{ item.task_reward_monry }}元奖励</div>
        <div class="startTime">开始时间：{{ item.created_at }}</div>
        <div class="endTime">结束时间：{{ item.settlement_time }}</div>
        <div class="progress">
          <div class="text">完成进度：</div>
          <div class="pgwrapper">
            <div class="bar" :style="{ width: `${(item.store_num / item.task_reward_stores) * 100}%` }"></div>
          </div>
          <div class="num">{{ item.store_num }}/{{ item.task_reward_stores }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import task_progress_controller from "./task_progress_controller";

export default task_progress_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  min-height: 100vh;
}

.listData {
  padding-top: 0.5rem;

  .listItem {
    width: 22rem;
    height: 7.69rem;
    margin: 0.8rem auto;
    padding: 0.6rem 0.906rem;
    text-align: left;
    background: #fff;
    border-radius: 0.31rem;

    .title {
      font-size: 0.8rem;
      font-weight: bold;
      color: #000;
    }

    .startTime {
      margin-top: 1rem;
      font-size: 0.7rem;
    }

    .endTime {
      font-size: 0.7rem;
      margin-top: 0.6rem;
    }

    .progress {
      display: flex;
      align-items: center;
      height: 2rem;

      .text {
        font-size: 0.7rem;
      }

      .num {
        margin-left: 0.3rem;
        font-size: 0.7rem;
      }

      .pgwrapper {
        position: relative;
        width: 8rem;
        height: 0.5rem;
        border-radius: 0.5rem;
        background: #eee;

        .bar {
          position: relative;
          left: 0;
          top: 0;
          max-width: 100%;
          height: 0.5rem;
          border-radius: 0.5rem;
          background: #ff6868;
        }
      }
    }
  }
}
</style>
