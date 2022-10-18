<template>
  <div class="page">
    <c-title text="公示页捐赠项目详情"></c-title>

    <div class="wrapper">
      <div class="donation-list ">
        <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
          <div class="donation-item" v-for="item in listData" :key="item.id">
            <div class="face">
              <img
                v-if="item.project_v && item.project_v.change_img && item.project_v.change_img.length > 0"
                :src="item.project_v.change_img[0]"
                alt=""
                @click="handImagePreview(item.project_v.change_img[0])"
              />
              <span v-else>暂无内容</span>
            </div>
            <div class="desc_info" @click="goDetails(item.id)">
              <div class="name overflow">姓名：{{ item.name }}</div>
              <div class="price">
                捐赠金额: <span class="small">￥</span><span class="num">{{ item.price }}</span>
              </div>
              <div class="project_name">项目名称：{{ item.project_v.title }}</div>
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
import controller from "./donation_project_list_controller.js";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  padding-bottom: 1rem;
}

.wrapper {
  padding: 0 0.625rem;
}

.donation-list {
  padding: 0.4rem 0;

  .donation-item {
    display: flex;
    padding: 0.5rem 0.781rem;
    margin-top: 0.625rem;
    text-align: left;
    background: #fff;
    border-radius: 0.469rem;

    .face {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 6.875rem;
      height: 4.563rem;
      margin: 0.2rem 0;
      background-color: #ededed;
      border-radius: 0.313rem;

      img {
        width: 6.875rem;
        height: 4.563rem;
        border-radius: 0.313rem;
        object-fit: cover;
      }

      span {
        font-size: 13px;
        color: #7c7c7c;
      }
    }

    .desc_info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 0.625rem;
      font-size: 15px;
      color: #333;
      overflow: hidden;

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

      .project_name {
        font-size: 12px;
        color: #6e6e6e;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
  }
}
</style>
