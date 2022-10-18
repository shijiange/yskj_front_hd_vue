<template>
  <div class="page">
    <c-title text="个人捐赠详情"></c-title>

    <div class="donation-list ">
      <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
        <div class="donation-item" v-for="item in listData" :key="item.id">
          <div class="project_name overflow">{{ item.title }}</div>
          <div class="price">
            捐赠金额: <span class="small">￥</span><span class="num">{{ item.price }}</span>
          </div>
          <div class="project_ps" v-if="item.remarks && item.remarks != ''">备注：{{ item.remarks }}</div>
        </div>
      </d-list>
      <div class="blank" v-if="neworkloading && listData.length == 0">
        <img src="../../../assets/images/blank.png" />
        <span>没有数据哦</span>
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./donation_project_info_controller.js";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  padding-bottom: 1rem;
}

.donation-list {
  padding: 0.625rem;

  .donation-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.9rem 0.781rem;
    padding-bottom: 0.8rem;
    margin-bottom: 0.625rem;
    text-align: left;
    background: #fff;
    border-radius: 0.469rem;

    .project_name {
      font-size: 15px;
      color: #333;
    }

    .price {
      margin-top: 0.4rem;
      font-size: 13px;
      color: #333;

      .small {
        font-size: 12px;
        color: #f15353;
      }

      .num {
        font-size: 15px;
        color: #f15353;
      }
    }

    .project_ps {
      margin-top: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 11px;
      color: #6f6f6f;
    }
  }
}
</style>
