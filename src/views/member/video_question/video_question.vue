<template>
  <div id="video_question">
    <van-nav-bar :title="info.name" fixed="true" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
      <template #right>
        <i class="iconfont icon-fontclass-tongzhi" :class="[unread_message_count > 0 ? 'aaa' : '']" style="color: #adadad;"></i>
      </template>
    </van-nav-bar>
    <div style="width: 100%; height: 46px;"></div>
    <div class="top_o" :style="{ height: info.show_video_viewing_progress == 1 ? '10rem' : '5.72rem' }">
      <div class="line" v-if="info.show_video_viewing_progress == 1">
        <div class="line_t">观看进度</div>
        <div class="progress">
          <div class="cir" :style="{ width: info.percentage + '%' }">
            <div class="cir_pos"></div>
            <span class="cir_pos_a">0%</span>
            <div class="cir_img">{{ info.percentage }}%</div>
          </div>
          <span class="cir_pos_b">100%</span>
        </div>
      </div>
      <div class="top_o_t" v-if="info.show_video_viewing_progress == 1">观看视频进度完成100%，即可进入答题</div>
    </div>
    <div class="banner" v-if="info.carousel_list">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" :show-indicators="false">
        <van-swipe-item v-for="(item, index) in info.carousel_list" :key="index"><img :src="item.thumb" alt="" @click="tapSwiper(item.url)"/></van-swipe-item>
      </van-swipe>
    </div>
    <div class="grid">
      <c-ment :datas="fun.chunk(category, 10)" :iscont="'question'"></c-ment>
    </div>
    <div class="list" v-if="info.video_category_list">
      <van-tabs v-model="tabind" title-active-color="#f15353" @click="onClick">
        <van-tab :title="item.title" v-for="(item, index) in info.video_category_list" :key="index"></van-tab>
      </van-tabs>
      <div class="listBox">
        <div class="li" v-for="(data, ind) in info.video_category_list[tabind].video_list" :key="ind" @click="toWatch(data.url, data.id, data.title)">
          <div class="img">
            <img :src="data.image" alt="" />
          </div>
          <div class="bot_text">{{ data.title }}</div>
        </div>
      </div>
    </div>
    <!-- 答题按钮 -->
    <div class="posBtn " @click="goAnswer" v-if="info.show_answer_button == 1"></div>
    <div class="posBtnRecord " @click="goRecord" v-if="info.show_answer_button == 1">答题记录</div>
    <!-- 消息弹窗 -->
    <van-popup v-model="message" position="bottom" :style="{ height: '50%' }" closeable close-icon="cross">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="messageBox" v-if="messageList">
          <div v-for="(item, index) in messageList" :key="index" style="margin-bottom: 0.5rem;">
            <div class="message_time">{{ item.created_at }}</div>
            <div class="messageLine">{{ item.content }}</div>
          </div>
          <span v-if="messageList.length == 0" style="color: #666;">暂无消息</span>
        </div>
      </van-list>
    </van-popup>
  </div>
</template>

<script>
import video_question_controller from "./video_question_controller";
export default video_question_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// .van-nav-bar--fixed {
//   position: fixed;
//   top: 0;
//   left: 50%;
//   width: 375px;
//   margin-left: -187.5px;
// }
#video_question {
  .aaa::after {
    position: absolute;
    content: "";
    top: 1rem;
    left: 1.55rem;
    width: 0.25rem;
    height: 0.25rem;
    background-color: #f15353;
    border-radius: 50%;
  }

  .answer {
    width: 100%;
    height: 100%;
    background: #fff;
  }

  .posBtnRecord {
    width: 2.5rem;
    height: 2.5rem;
    position: fixed;
    bottom: 6.2rem;
    border-radius: 100%;
    border: 1px solid #f15353;
    background: #fff;
    color: #f15353;
    padding: 0.15rem 0.2rem;
    font-size: 12px;
    right: 50%;
    margin-right: -183.5px;
  }

  .posBtn {
    // width: 2.39rem;
    // height: 2.39rem;
    // background-color: #f15353;
    // box-shadow: 0rem 0.06rem 0.19rem 0rem #b9b9b9;
    // position: fixed;
    // top: 41.88rem;
    // right: 1.06rem;
    // border-radius: 50%;
    // font-size: 11px;
    // color: #ffffff;
    // display: flex;
    // flex-direction: column;
    width: 3rem !important;
    height: 3rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/ksdt@3x.png");
    background-size: 100% 100%;
    position: fixed;
    bottom: 9rem;
    right: 50%;
    margin-right: -187.5px;
  }

  .messageBox {
    padding: 2.78rem 0.94rem;

    .messageLine {
      width: 21.56rem;
      height: 4.38rem;
      background-color: #f6f6f6;
      border-radius: 0.47rem;
      display: flex;
      text-align: left;
      justify-content: center;
      align-items: center;
      padding: 1.25rem 0.94rem;
    }

    .message_time {
      font-size: 0.69rem;
      color: #999;
      margin-bottom: 0.72rem;
    }
  }

  .list {
    background: #fff;
    padding-bottom: 4rem;

    .listBox {
      padding: 0.94rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .li {
        width: 10.47rem;
        margin-bottom: 0.5rem;

        .img {
          width: 10.47rem;
          height: 13.94rem;
          border-radius: 0.47rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 0.47rem;
          }
        }

        .bot_text {
          text-align: left;
          font-size: 0.88rem;
          margin-top: 0.72rem;
          line-height: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  .grid {
    background: #fff;
  }

  .top_oI {
    height: 5.72rem;
  }

  .top_o {
    height: 10rem;
    background-color: #24d8a8;
    border-radius: 0 0 2rem 2rem;
    overflow: hidden;

    .top_o_t {
      font-size: 0.75rem;
      color: #fff;
      line-height: 1.5rem;
      margin-top: 0.78rem;
    }

    .line {
      margin-top: 2rem;
      margin-left: 1.09rem;
      margin-right: 1.03rem;
      display: flex;
      align-items: center;

      .line_t {
        color: #fff;
        font-size: 0.75rem;
        margin-right: 0.5rem;
      }

      .progress {
        flex: 1;
        height: 0.44rem;
        border-radius: 0.22rem;
        background: #fff;
        position: relative;

        span {
          font-size: 0.63rem;
          color: #fff;
        }

        .cir_pos_b {
          position: absolute;
          right: 0;
          bottom: -1rem;
        }

        .cir {
          border-radius: 0.22rem;
          position: relative;
          height: 100%;
          background: #8dffe1;

          .cir_img {
            background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/yjjx2@3x.png");
            width: 2.19rem;
            height: 1.44rem;
            background-size: 100% 100%;
            position: absolute;
            top: -1.6rem;
            right: -1rem;
            line-height: 1rem;
            font-size: 0.63rem;
            color: #24d8a8;
          }

          .cir_pos {
            width: 0.75rem;
            height: 0.75rem;
            background-color: #8dffe1;
            border: solid 0.03rem #fff;
            position: absolute;
            right: -0.325rem;
            top: -0.15rem;
            border-radius: 50%;
          }

          .cir_pos_a {
            position: absolute;
            left: 0;
            bottom: -1rem;
          }
        }
      }
    }
  }

  .banner {
    height: 9.69rem;
    background-color: #e8e8e8;
    border-radius: 0.63rem;
    margin: 0 0.94rem;
    margin-top: -3.81rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 9.69rem;
    text-align: center;
    background-color: #39a9ed;
  }
}
</style>
