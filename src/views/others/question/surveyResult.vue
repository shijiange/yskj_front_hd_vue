<template>
  <div id="surveyResult">
    <div class="surveyTop">
      <div class="navTitle set-pc-style">
        <van-icon name="arrow-left" @click="goback" />
        调查结果
      </div>
      <div class="cirbox" id="canvasBox" style="width: 300; height: 300;">
        <canvas id="myCanvas" class="myCanvas" style="width: 300; height: 300;"></canvas>
        <canvas id="cirWeek_run" class="cirWeek_run" style="width: 300; height: 300;"></canvas>
        <div class="cirtext">
          <div class="cirboxArr">
            <span>{{ score }}</span
            >分
          </div>
        </div>
      </div>
      <div style="font-size: 0.875rem; color: #fff; text-align: center;">恭喜您获得{{ rewardPoint }}{{ plugin_point_name }}奖励，感谢您的参与！</div>
    </div>
    <div class="scheme">
      <div class="schemeTxt">建议方案</div>
      <div class="schemeCon" v-html="info" v-if="info.length > 0"></div>
    </div>
    <div class="dbtn set-pc-style">
      <div class="dlin" @click="goback('video')" v-if="tag == 'video'">返回视频</div>
      <div @click="back" class="dback">继续参与</div>
    </div>
  </div>
</template>
<script>
import surveyResult_controller from "./surveyResult_controller";

export default surveyResult_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.dbtn {
  width: 100%;
  position: fixed;
  bottom: 0.4063rem;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
}

.dback {
  width: 10.0313rem;
  height: 2.375rem;
  background-color: #2672ff;
  border-radius: 0.125rem;
  text-align: center;
  line-height: 2.375rem;
  color: #fff;
  font-size: 1rem;
}

.dlin {
  width: 10.0313rem;
  height: 2.375rem;
  border-radius: 0.125rem;
  border: solid 1px #2672ff;
  text-align: center;
  line-height: 2.375rem;
  font-size: 1rem;
  color: #2672ff;
  background-color: #fff;
}

.scheme {
  margin: 1.4063rem 0.7813rem 0 0.7813rem;
}

.schemeTxt {
  font-size: 1.125rem;
  line-height: 1.25rem;
  color: #000;
  text-align: left;
}

.schemeCon {
  width: 100%;
  text-indent: 1.5625rem;
  margin-top: 1.0625rem;
  margin-bottom: 1.2813rem;
  font-size: 0.875rem;
  color: #666;
  text-align: left;
}

.banner {
  width: 21.875rem;
  height: 6.125rem;
  border-radius: 0.4688rem;
  margin: 0 auto;
}

.banner image {
  width: 100%;
  height: 100%;
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

.surveyTop {
  height: 16.6563rem;
  width: 100%;
  border-radius: 0 0 2.5rem 0;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/wj_resultbg@3x.png");
  background-size: 100% 100%;
  overflow: hidden;

  .cirbox {
    position: relative;
    z-index: 101;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1.25rem;

    .cirWeek_run {
      position: absolute;
    }
    // .myCanvas{
    //   position: relative;
    // }
    .cirtext {
      position: absolute;
      width: 100%;
      font-size: 0.75rem;
      color: #fff;

      .cirboxArr {
        width: 300px;
        height: 150px;
        margin: 0 auto;
        line-height: 150px;
        margin-left: 4rem;

        span {
          font-size: 2.375rem;
        }
      }
    }
  }
}
</style>
