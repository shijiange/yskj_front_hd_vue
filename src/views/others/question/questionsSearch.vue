<template>
  <div id="questionsSearch">
    <div class="navTitle set-pc-style">
      <van-icon name="arrow-left" @click="goback" />
      搜索
    </div>
    <div style="width: 100%; height: 3.6rem;"></div>
    <div class="headBox">
      <van-search v-model="key" shape="round" placeholder="请输入搜索关键词" @input="onSearch" />
    </div>
    <div class="newSurvey">
      <div v-for="(item, index) in list" :key="index">
        <div class="surveyList">
          <div class="left">{{ item.title }}</div>
          <div class="right" @click="detail(item)">立即参与</div>
          <!--  catchtap="detail" data-id="{{item.id}}" -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import questionsSearch_controller from "./questionsSearch_controller";

export default questionsSearch_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.navTitle {
  width: 100%;
  font-size: 1.25rem;
  padding: 1rem 0;
  box-sizing: border-box;
  text-align: left;
  background: #fff;
  padding-left: 0.72rem;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 999;
}

.headBox {
  display: flex;
  justify-content: space-between;
  background: #fff;
  align-items: center;
  // padding-right: 1.31rem;
  .van-search {
    flex: 1;
  }
}

.newSurvey {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #fff;
}

.surveyList {
  width: 21.875rem;
  height: 4.1875rem;
  background-color: #f9fbfb;
  border-radius: 0.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.625rem;
}

.newTxt {
  font-size: 1.125rem;
  line-height: 1.25rem;
  margin-bottom: 1.1563rem;
  text-align: left;
}

.surveyList .left {
  margin-left: 0.5313rem;
  font-size: 1rem;
  color: #000;
  letter-spacing: 0.0625rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: left;
}

.surveyList .right {
  width: 4.25rem;
  height: 1.7188rem;
  background-image: linear-gradient(90deg, #72a3ff 0%, #4687ff 100%), linear-gradient(#4a84fd, #4a84fd);
  background-blend-mode: normal, normal;
  border-radius: 0.875rem;
  text-align: center;
  line-height: 1.7188rem;
  font-size: 0.875rem;
  color: #fff;
  margin-right: 0.7188rem;
  margin-left: 0.9375rem;
}
</style>
