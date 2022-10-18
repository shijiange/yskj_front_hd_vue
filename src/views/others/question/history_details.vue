<template>
  <div id="history_details">
    <div class="navTitle set-pc-style">
      <van-icon name="arrow-left" @click="goback" />
      问卷调查
    </div>
    <div style="width: 100%; height: 3.6rem;"></div>
    <div class="banner">
      <div class="title">{{ title }}</div>
    </div>
    <div class="selectBox" v-for="(item, ind) in choice" :key="ind">
      <div class="queTitle">
        <span v-if="item.required">*</span>
        <div>{{ ind + 1 }}.({{ item.type == 1 ? "单选" : "多选" }}){{ item.choice_title }}</div>
      </div>
      <div class="answer" v-for="(arr, index) in item.answer.answer" :key="index">
        {{ arr }}({{ item.answer.fraction[index] }}分)
        <i class="iconfont icon-record_go" v-show="record[ind].answer.answer && record[ind].answer.answer[index] == arr"></i>
      </div>
    </div>
  </div>
</template>
<script>
import history_details_controller from "./history_details_controller";

export default history_details_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#history_details {
  padding-bottom: 2rem;
}

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
}

.banner {
  width: 100%;
  height: 8.8438rem;
  margin-bottom: 0.8125rem;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/wj_titlebg@2x.png");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.title {
  width: 11.25rem;
  margin: 2.7188rem 0 0 1.5938rem;
  font-size: 1.125rem;
  color: #fff;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-align: left;
}

.selectBox {
  padding: 0 0.78rem;
  margin-bottom: 1.75rem;

  .queTitle {
    display: flex;
    justify-content: flex-start;
    font-size: 1rem;
    text-align: left;
    margin-bottom: 0.9rem;

    span {
      color: #fa0505;
      font-size: 16px;
    }
  }

  .answer {
    text-align: left;
    padding-left: 0.91rem;
    height: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;

    i {
      margin-right: 1rem;
      color: #0c6cff;
    }
  }
}

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
  z-index: 999;
}

.banner {
  width: 100%;
  height: 8.8438rem;
  margin-bottom: 0.8125rem;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/wj_titlebg@2x.png");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.title {
  width: 11.25rem;
  margin: 2.7188rem 0 0 1.5938rem;
  font-size: 1.125rem;
  color: #fff;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-align: left;
}
</style>
