<template>
  <div class="store_bussiness">
    <c-title :hide="false" text="店商联盟"></c-title>
    <!-- 用户信息 -->
    <div class="member_info">
      <div class="info-left">
        <img :src="member.avatar" alt="" />
      </div>
      <div class="info-right">
        <span class="nickname">{{ member.nickname }}</span>
        <span class="level" v-if="agent != null">{{ agent.has_one_agent_level.name }}</span>
      </div>
    </div>
    <!-- 任务中心入口 -->
    <div class="test_center" @click="goTest" v-if="taskCount != 0">
      <van-cell title="任务中心" is-link />
    </div>
    <div class="test_center" style="margin-top: 0;" @click="goProgress" v-if="task_order != 0">
      <van-cell title="任务进度" is-link />
    </div>
    <!-- 中心入口 -->
    <div class="choose" v-if="agent != null">
      <div @click="goCenter(1)" class="img_box" v-if="agent.region && agent.region == 1">
        <img class="img" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/serviceCenter@2x.png" alt="" />
      </div>
      <div @click="goCenter(2)" class="img_box operating" v-if="agent.has_one_agent_level && agent.has_one_agent_level.is_operation_center == 1">
        <img class="img" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/operating_center@2x.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import index_controller from "./index_controller";

export default index_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// 用户信息样式
.img {
  width: 100%;
  height: 100%;
}

.member_info {
  display: flex;
  padding: 1.406rem 0 1.75rem 1.219rem;
  background-color: #ee2e2b;

  .info-left {
    width: 2.875rem;
    height: 2.875rem;
    background-color: cadetblue;
    border-radius: 50%;

    img {
      width: 2.875rem;
      height: 2.875rem;
      border-radius: 50%;
    }
  }

  .info-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    color: #fff;
    margin-left: 0.688rem;

    .nickname {
      font-size: 14px;
    }

    .level {
      margin-top: 0.813rem;
      padding: 0.1rem 0.5rem;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.29);
      border-radius: 0.625rem;
    }
  }
}

// 任务中心入口
.test_center {
  margin: 1rem 1rem 0;
  text-align: left;
  border-bottom: 1px solid rgb(245, 245, 245);
}

// 入口
.choose {
  display: flex;
  margin: 1rem;

  .img_box {
    width: 10.649rem;
    height: 5rem;
  }

  .operating {
    margin-left: 1rem;
  }
}
</style>
