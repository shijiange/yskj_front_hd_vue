<template>
  <div id="answer">
    <c-title :hide="false" :text="'答题'"> </c-title>
    <!-- <div class="top"></div> -->
    <div class="questions" v-if="question">
      <div class="questions_box" v-for="(item, index) in question" :key="index">
        <div class="title">{{ index + 1 }}.{{ item.title }}</div>
        <div class="btn_box" v-for="(data, ind) in item.option" :key="ind" @click.stop="tapAnswer(data.id, item.id)">
          <!-- classOn -->
          <div :class="[data.crd ? 'classOn' : data.crd]" class="btn">
            <span style="text-align: left;">{{ data.content }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="posbtn set-pc-styleLeft">
      <div
        style="
          color: #fff;
          width: 19.06rem;
          height: 2.5rem;
          background-color: #f14e4e;
          border-radius: 0.47rem;
          text-align: center;
          line-height: 2.5rem;
"
        @click="submit"
      >
        提交
      </div>
    </div>
    <van-popup v-model="pass" round :style="{ width: '18.75rem' }" closeable close-icon="cross">
      <div class="pass" v-if="is_qualified == 1">
        <div class="imgbox" :style="{ backgroundImage: 'url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/jb@3x.png)' }"></div>
        <span style="font-size: 1.13rem; color: #2d353d; margin-top: 1.47rem;">答题完成，分数达标！</span>
        <span style="font-size: 0.75rem; color: #999; margin-top: 0.91rem;"
          >本次得分 <em style="color: #f15353;">{{ score }}</em
          >分</span
        >
        <div class="subBtn" @click="goApply">申请推广员</div>
      </div>
      <div class="pass" v-if="is_qualified == 0">
        <div class="imgbox" :style="{ backgroundImage: 'url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/bdb@3x.png)' }"></div>
        <span style="font-size: 1.13rem; color: #2d353d; margin-top: 1.47rem;">答题完成，分数不达标！</span>
        <span style="font-size: 0.75rem; color: #999; margin-top: 0.91rem;"
          >本次得分 <em style="color: #f15353;">{{ score }}</em
          >分</span
        >
        <div class="subBtn" @click="again">重新答题</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import answer_controller from "./answer_controller";
export default answer_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#answer {
  min-height: 100vh;
  background: #fff;

  .pass {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.97rem 2.13rem;

    .imgbox {
      width: 11.13rem;
      height: 9.28rem;
      // background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/jb@3x.png');
      background-size: 100%;
    }

    .subBtn {
      width: 14.5rem;
      height: 2.5rem;
      background-color: #f15353;
      border-radius: 0.47rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1.3em;
    }
  }

  .top {
    width: 100%;
    height: 40px;
  }

  .posbtn {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 5rem;
    background: #fff;
    padding-top: 1rem;
  }

  .questions {
    padding: 1.22rem 1rem;
    min-height: 100vh;
    background-color: #fff;
    padding-bottom: 6rem;

    .questions_box {
      display: flex;
      flex-direction: column;
      text-align: left;
      padding-bottom: 2.5rem;

      .title {
        padding-bottom: 0.5rem;
        color: #202020;
        font-weight: bold;
        font-size: 1rem;
      }

      .btn_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 0.9rem;

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 19.28rem;
          min-height: 2.188rem;
          padding: 0.3rem 0.5rem;
          font-size: 0.813rem;
          color: #fff;
          text-align: center;
          border-radius: 0.625rem;
          background-color: #00b98d;
        }

        .classOn {
          background: #ff9c00;
        }
      }
    }
  }
}
</style>
