<template>
  <div class="page">
    <c-title text="捐赠信息查询"></c-title>
    <van-search placeholder="请输入姓名或手机号进行查询" v-model="search_kwd" @search="getListData" shape="round"></van-search>

    <div class="wrapper">
      <div class="donation-list ">
        <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
          <div class="donation-item" v-for="item in listData" :key="item.id" @click="gotoPage('donationProjectDetails', {}, { id: item.id })">
            <div class="desc_info">
              <div class="name overflow">{{ item.name }}</div>
              <div class="price">
                <span class="small">￥</span><span class="num">{{ item.price }}</span>
              </div>
            </div>
            <div class="project_name overflow" v-if="item.project">项目名称：{{ item.project.title }}</div>
            <div class="time">
              <i class="iconfont icon-qhm_record"></i>
              <span>{{ item.time }}</span>
            </div>
          </div>
        </d-list>
        <div class="blank" v-if="neworkloading && listData.length == 0">
          <img src="../../../assets/images/blank.png" />
          <span>没有数据哦</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./donation_project_search_controller.js";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrapper {
  padding: 0 0.625rem;
}

.donation-list {
  padding: 0.4rem 0;

  .donation-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.9rem 0.8rem;
    margin-top: 0.625rem;
    text-align: left;
    background: #fff;
    border-radius: 0.469rem;

    .desc_info {
      display: flex;
      justify-content: space-between;
      font-size: 15px;
      color: #333;

      .price {
        .small {
          font-size: 12px;
          color: #f15353;
        }

        .num {
          font-size: 15px;
          color: #f15353;
        }
      }
    }

    .project_name {
      margin-top: 0.781rem;
      font-size: 13px;
      color: #333;
    }

    .time {
      display: flex;
      align-items: center;
      margin-top: 0.9rem;
      font-size: 11px;
      color: #6f6f6f;

      i {
        font-size: 13px;
      }

      span {
        margin-left: 0.4rem;
      }
    }
  }
}
</style>
