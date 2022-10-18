<template>
  <div class="page">
    <div class="title">
      <div class="con" style="height: 2.938rem;">
        <div class="left" @click="goto">
          <i class="iconfont icon-member-left back"></i>
        </div>
        <div class="right">答题</div>
      </div>
    </div>

    <div class="header">答题赢{{ integral_name }}</div>

    <div class="answerContainer" v-if="subject != null">
      <div class="answerTitle">{{ subject.title }}</div>
      <div class="answerList">
        <div class="answerItem" v-for="item in answerfilter" :key="item.id" @click="reward(item.id)">{{ item.content }}</div>
      </div>
    </div>

    <van-popup v-model="successShow" style="background: transparent;" :close-on-click-overlay="false">
      <div class="successAlert">
        <div class="c1">答题成功</div>
        <div class="c2">恭喜你获得{{ integral_name }}</div>
        <div class="c3">{{ integral }}</div>
        <div class="btn" @click="goto"><img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/videoAnswerSuccess@3x.png" alt="" /></div>
      </div>
    </van-popup>

    <van-popup v-model="errorShow" style="background: transparent;" :close-on-click-overlay="false">
      <div class="errorAlert">
        <div class="sigh"><img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/videoAnswerTan@3x.png" alt="" /></div>
        <div class="c1">答题失败</div>
        <div class="c2">
          <span>很遗憾，答错了。请重新</span>
          <span>观看，再接再厉！</span>
        </div>
        <div class="btn" @click="goto">我知道了</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import videoAnswerController from "./video_answer_controller";

export default videoAnswerController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/videoAnswerBg@3x.png);
  background-size: cover;
  min-height: 100vh;
}

.title {
  height: 2.938rem;
  width: 375px;
  box-sizing: border-box;
  background: #fff;

  .con {
    width: 100%;
    display: flex;
    position: relative;

    .left {
      position: absolute;
      left: 0;
      top: 0;
      width: 3rem;
      height: 100%;
      display: flex;
      padding-left: 1.313rem;
      align-items: center;

      .icon-member-left {
        color: #000;
        font-weight: bold;
      }
    }

    .right {
      flex: 0 0 calc(100% - 6rem);
      width: calc(100% - 6rem);
      margin: 0 auto;
      color: #000;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
      letter-spacing: 0.056rem;
      pointer-events: none;
      text-overflow: ellipsis;
      white-space: normal;
      overflow: hidden;
    }
  }
}

.header {
  margin: 0 auto;
  padding-top: 1.8rem;
  font-size: 2.2rem;
  color: #e9e8e8;
}

.answerContainer {
  margin: 0 auto;
  margin-top: 2.8rem;
  width: 19.969rem;
  height: 20.625rem;
  border-radius: 5%;
  background-color: #fff;
  padding: 1.8rem 2.2rem 0;
  position: relative;

  &::before {
    content: "";
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    position: absolute;
    left: -0.5rem;
    top: 2rem;
    background: rgb(207, 36, 59);
  }

  &::after {
    content: "";
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    position: absolute;
    right: -0.5rem;
    top: 2rem;
    background: rgb(207, 36, 59);
  }

  .answerTitle {
    color: #333;
    font-size: 0.938rem;
  }

  .answerList {
    padding-top: 1.53rem;
    height: 16rem;
    overflow: scroll;

    .answerItem {
      width: 100%;
      height: 2.656rem;
      background-color: #f1f1f1;
      border-radius: 1.328rem;
      color: #333;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.06rem;

      &:active {
        background: rgb(207, 36, 59);
        color: #fff;
      }
    }
  }
}

.successAlert {
  width: 19.563rem;
  height: 17.631rem;
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/videoAnswerAlert@3x.png);
  background-size: contain;
  background-repeat: no-repeat;

  .c1 {
    color: #f06161;
    font-size: 1rem;
    padding-top: 1.3rem;
  }

  .c2 {
    color: #333;
    font-size: 1rem;
    margin-top: 1.8rem;
  }

  .c3 {
    color: #f06161;
    font-size: 2.25rem;
    margin-top: 1.575rem;
  }

  .btn {
    width: 10.375rem;
    height: 2.35rem;
    margin: 0 auto;
    margin-top: 4rem;

    img {
      width: 100%;
      height: auto;
    }
  }
}

.errorAlert {
  width: 15.938rem;
  height: 15.938rem;
  background-color: #fff;
  border-radius: 0.125rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;

  .sigh {
    width: 5.8rem;
    padding-left: 0.8rem;
    height: 4.719rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .c1 {
    margin-top: 0.8rem;
    font-size: 1rem;
    color: #999;
  }

  .c2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1rem;
    color: #333;
    font-size: 0.875rem;
  }

  .btn {
    margin-top: 1rem;
    font-size: 0.938rem;
    color: #fff;
    width: 11.188rem;
    height: 1.906rem;
    background-color: #f35056;
    border-radius: 0.188rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
