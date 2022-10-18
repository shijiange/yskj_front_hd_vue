<template>
  <div id="questionnaireIndex">
    <div class="navTitle set-pc-style">
      <van-icon name="arrow-left" @click="goback" />
      首页
    </div>
    <div style="width: 100%; height: 3.6rem;"></div>
    <div class="headBox">
      <van-search v-model="value" shape="round" placeholder="请输入搜索关键词" disabled="true" @click="goSearch" />
      <span style="font-size: 0.88rem; color: #828282;" @click="posterShow = true">说明</span>
    </div>
    <div style="padding: 0 0.78rem; padding-bottom: 3.5rem;">
      <div class="banner">
        <img :src="info.thumb" alt="" @click="goBanner" />
      </div>
      <div class="newSurvey">
        <div class="newTxt">最新问卷</div>
        <div v-for="(item, index) in list" :key="index" class="surveyBox">
          <div class="surveyList">
            <div class="left">
              <p class="survey-title">{{ item.title }}</p>
            </div>
            <div class="right" @click="goDetail(item)">立即参与</div>
          </div>
          <div class="time" v-if="item.start_time && item.end_time">
            时间：{{item.start_time}} - {{item.end_time}}
          </div>
        </div>
      </div>
    </div>
    <div class="posBtn " @click="gohistory">
      <i class="iconfont icon-jk_record"></i>
      记录
    </div>
    <van-popup v-model="posterShow" closeable>
      <div class="explain">
        <span>说明</span>
        <div class="explainConten" v-html="info.content"></div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import questionnaireIndex_controller from "./questionnaireIndex_controller";

export default questionnaireIndex_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#questionnaireIndex {
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
    padding-right: 1.31rem;

    .van-search {
      flex: 1;
    }
  }

  .banner {
    width: 21.875rem;
    height: 9.3438rem;
    border-radius: 0.625rem;
    margin-top: 0.9375rem;
    margin-bottom: 1.5938rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 0.625rem;
    }
  }

  .surveyBox {
    width: 21.875rem;
    background-color: #f9fbfb;
    padding: 0.8rem 0;
    margin-bottom: 0.5rem;
    border-radius: 0.125rem;

    .time {
      font-size: 0.8rem;
      color: #afa7a7;
      letter-spacing: 0;
      text-align: left;
      padding-left: 0.5313rem;
    }
  }

  .surveyList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.125rem;
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
    text-align: left;

    .survey-title {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
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

  /* 说明弹窗 */
  .explain {
    width: 18.4375rem;
    height: 19rem;
    background-color: #fff;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
  }

  .explain span {
    padding-top: 0.9375rem;
    font-size: 1.125rem;
    color: #000;
  }

  .explainConten {
    width: 100%;
    text-indent: 0.9375rem;
    padding: 0 0.5rem;
    padding-top: 1.06rem;
  }

  .posBtn {
    position: fixed;
    bottom: 4.22rem;
    right: 1rem;
    width: 3.75rem;
    height: 3.75rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #2672ff;
    border-radius: 50%;
    color: #fff;
    font-size: 0.75rem;
    z-index: 666;
  }

  .posBtn i {
    color: #fff;
    font-size: 1.25rem;
  }
}
</style>
