<template>
  <div class="page">
    <c-title :text="title"></c-title>

    <div class="wrapper">
      <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
        <div class="picture-list ">
          <div class="picture-item" v-for="(item, key) in picture_list" :key="item.id">
            <div class="face">
              <img v-if="item.url" :src="item.url" alt="" @click="handPictureImagePreview(key)" />
              <span v-else>暂无内容</span>
            </div>
            <div class="name_wrapper">
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </d-list>
      <div class="blank" v-if="neworkloading && picture_list.length == 0">
        <img src="../../../assets/images/blank.png" />
        <span>没有数据哦</span>
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./donation_project_picture_controller.js";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  padding-bottom: 1rem;
}

.wrapper {
  padding: 0 0.925rem;
}

.picture-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 0.813rem;

  .picture-item {
    margin-top: 0.5rem;
    background: #fff;
    border-radius: 0.313rem;

    .face {
      width: 100%;
      height: 6.875rem;

      img {
        width: 100%;
        height: 6.875rem;
        border-radius: 0.313rem 0.313rem 0 0;
        object-fit: cover;
      }
    }

    .name_wrapper {
      padding: 0.625rem;
      text-align: left;

      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: 13px;
        color: #333;
      }
    }
  }
}
</style>
