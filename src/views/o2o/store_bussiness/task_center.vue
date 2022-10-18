<template>
  <div class="task_center">
    <c-title :hide="false" text="店商联盟"></c-title>
    <!-- 背景图 -->
    <img class="img" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/taskCenter@2x.png" alt="" />
    <!-- 列表 -->
    <div class="taskList">
      <div class="item" v-for="(item, key) in listData" :key="key" @click="choice(item)">
        <i class="iconfont icon-all_select_active icon" :class="{ active: sid == item.id }"></i>
        <div class="content">
          <div class="num">任务{{ key + 1 }}</div>
          <div class="detail">
            <p class="award">{{ item.task_reward_day }}天内推广增加{{ item.task_reward_stores }}家门店，可获得{{ item.task_reward_monry }}元奖励</p>
            <p class="pay">需支付定金￥{{ item.deposit }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <button class="btn" @click="send">立即参加</button>
  </div>
</template>
<script>
import task_center_controller from "./task_center_controller";

export default task_center_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// 背景图
.img {
  width: 100%;
  height: auto;
}

// 列表
.taskList {
  background-color: #fff;

  .item {
    display: flex;
    align-items: center;
    margin: 0 1rem;
    padding: 1rem 0;
    border-bottom: 0.031rem solid #e8e8e8;

    &:last-child {
      border: none;
    }

    .icon {
      color: #dbdbdb;
    }

    .active {
      color: #f15353;
    }

    .content {
      display: flex;
      font-weight: bold;

      .num {
        width: 2.813rem;
        height: 1.063rem;
        margin: 0 0.375rem 0 0.688rem;
        color: #fff;
        font-size: 11px;
        background-color: #3fa5f9;
        border-radius: 0.531rem;
      }

      .detail {
        text-align: left;

        .award {
          font-size: 13px;
          color: #333;
        }

        .pay {
          margin-top: 0.5rem;
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
}

// 按钮
.btn {
  position: absolute;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  width: 20.313rem;
  height: 2.188rem;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  line-height: 2.188rem;
  background-color: #3fa5f9;
  border-radius: 1.094rem;
  border: none;
}
</style>
