<template>
  <div class="page">
    <c-title :text="title"></c-title>

    <div class="wrapper">
      <div class="video-list ">
        <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
          <div class="video-item" v-for="item in video_list" :key="item.id">
            <div class="name overflow">{{ item.name }}</div>
            <div class="face">
              <video v-if="item.url" :src="item.url" controls="controls"></video>
              <span v-else>暂无内容</span>
            </div>
          </div>
        </d-list>
        <div class="blank" v-if="neworkloading && video_list.length == 0">
          <img src="../../../assets/images/blank.png" />
          <span>没有数据哦</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./donation_project_video_controller.js";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  padding-bottom: 1rem;
}

.wrapper {
  padding: 0 0.625rem;
}

.video-list {
  .video-item {
    width: 100%;
    height: 16.875rem;
    margin-top: 0.625rem;
    padding: 0.906rem 1.094rem;
    background-color: #fff;
    border-radius: 0.469rem;

    .name {
      text-align: left;
      font-size: 15px;
      color: #333;
    }

    .face {
      margin-top: 0.781rem;
      height: 13.281rem;

      video {
        height: 13.281rem;
        width: 100%;
        border-radius: 0.313rem;
      }
    }
  }
}
</style>
