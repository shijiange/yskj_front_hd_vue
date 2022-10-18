<template>
  <div class="questioHistory">
    <div class="navTitle set-pc-style">
      <van-icon name="arrow-left" @click="goback" />
      历史记录
    </div>
    <div style="width: 100%; height: 3.6rem;"></div>
    <template v-for="(item, index) in list">
      <div class="list" :key="index">
        <div class="top">
          <div class="topleft">
            得分 <span>{{ item.score }}</span
            ><span>分</span>
          </div>
          <div class="topRight">
            <span>奖励积分</span> <span>+{{ item.integral }}</span>
          </div>
        </div>
        <div class="centre">{{ item.has_one_questionnaire.title }}</div>
        <div class="btom">
          <div class="btime">{{ item.created_at }}</div>
          <div class="detail" @click="godetail(item)">查看详情</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import questioHistory_controller from "./questioHistory_controller";

export default questioHistory_controller;
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

.list {
  margin: 0.9375rem 0.7813rem;
  background-color: #fff;
  border-radius: 0.6563rem;
  padding: 0.7813rem 0.4375rem 0.9688rem 0.6563rem;
}

.top {
  display: flex;
  justify-content: space-between;
}

.topleft text:nth-child(1) {
  font-size: 1.25rem;
}

.topleft text:nth-child(2) {
  font-size: 0.75rem;
}

.topRight text:nth-child(1) {
  font-size: 0.875rem;
  color: #999;
  padding-right: 0.3125rem;
}

.topRight text:nth-child(2) {
  font-size: 1.25rem;
  color: #4687ff;
}

.centre {
  margin-top: 0.9063rem;
  font-size: 1rem;
  line-height: 1.3125rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-align: left;
}

.btime {
  font-size: 0.875rem;
  color: #999;
  line-height: 1.3125rem;
}

.btom {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail {
  width: 5.5rem;
  height: 1.7188rem;
  background-image: linear-gradient(90deg, #72a3ff 0%, #4687ff 100%), linear-gradient(#4a84fd, #4a84fd);
  background-blend-mode: normal, normal;
  border-radius: 0.875rem;
  text-align: center;
  line-height: 1.7188rem;
  font-size: 0.875rem;
  color: #fff;
}
</style>
