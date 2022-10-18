<template>
  <div id="circleIndex">
    <c-title :hide="false" :text="circleCustomName"></c-title>
   
    <van-search placeholder="请输入圈子名称" shape="round" disabled @click="toSearch"></van-search>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in banner" :key="index">
        <a :href="item.url">
          <van-image :src="item.img" />
        </a>
      </van-swipe-item>
    </van-swipe>
    <ul class="button-grid">
      <li class="button-grid-item" v-for="gridItem in buttons" :key="gridItem.id">
        <a :href="gridItem.url">
          <van-image :src="gridItem.img" width="2.4375rem" height="2.4375rem" round fit="cover" />
          <div class="button-grid-name">{{ gridItem.name }}</div>
        </a>
      </li>
    </ul>

    <div class="circle-list-wrapper">
      <van-tabs
        title-active-color="#3175fe"
        v-model="currentShowCategoryIndex"
        @change="switchCategory"
      >
        <van-tab title="推荐"></van-tab>
        <van-tab :title="item.name" v-for="(item, index) in category" :name="item.id" :key="index"></van-tab>
      </van-tabs>
      <!-- 圈子列表 -->
      <div class="circle-list">
        <d-list
          @load="loadMoreCircle"
          :loading="circlesPagination.loading"
          :finished="circlesPagination.finished"
        >
          <div
            class="lis"
            v-for="(item, index) in circles"
            :key="index"
            @click="toCircleDetails(item.id)"
          >
            <circle-item :data="item" @button-click="toCircleDetails(item.id)"></circle-item>
          </div>
        </d-list>
      </div>
    </div>
    <Tabbar />
  </div>
</template>

<script>
import circleIndex_controller from "./circleIndex_controller";

export default circleIndex_controller;
</script>

<style scoped>
/deep/ .van-tabs__line {
  background: #3175fe;
}

/deep/ .van-tab--active {
  font-size: 1rem;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(5, calc(20% - 0.25rem));
  row-gap: 1.375rem;
  column-gap: 0.3125rem;
  padding: 1.375rem 0.625rem;
  background-color: white;
}

.button-grid-name {
  margin-top: 0.5625rem;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.circle-list {
  padding: 0 0.9375rem;
  background-color: white;
}

.circle-list-wrapper {
  margin-top: 0.625rem;
}
</style>
