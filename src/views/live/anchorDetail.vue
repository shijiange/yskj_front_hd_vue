<!-- 主播个人中心页 -->
<template>
  <div id="anchorDetail">
    <c-title :hide="false" text="主播页面"></c-title>
    <div class="member-head">
      <div class="left">
        <p class="name-box">
          <span class="name overflow">{{ dataInfo.nickname }}</span
          ><span class="fans">{{ dataInfo.fan_count }}粉丝</span>
        </p>
        <p class="describe">{{ dataInfo.synopsis }}</p>
        <div class="focus" v-if="is_concern == 0" @click="addConcern">关注</div>
        <div class="unfocus" v-if="is_concern == 1" @click="cancelConcern">取消关注</div>
      </div>
      <div class="right">
        <img :src="dataInfo.avatar" alt="" />
      </div>
    </div>

    <div class="live-list" v-if="!fun.isTextEmpty(roomList)">
      <div class="live-item" v-for="(item, index) in roomList" :key="index" @click="gotoLive(item.status, item.id)">
        <p class="title overflow">
          <span class="red">{{ item.status == 3 ? "正在直播" : "预告" }}</span
          ><span>{{ item.title }}</span>
        </p>
        <p class="gray" v-if="item.status == 3">
          <span>{{ item.view_num }}人观看</span> | <span>{{ item.goods_num }}商品</span>
        </p>
        <p class="red-word" v-if="item.status == 2">
          <span style="flex: 1;">
            <span v-if="fun.getTimeDifference(item.live_time) == 0">已结束</span>
            <van-count-down v-else :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒" @finish="timeEnd(index)"></van-count-down> </span
          ><span class="button" @click.stop="addNotice(item.notice, item.id, index)">{{ item.notice == 1 ? "已订阅" : "开播提醒" }}</span>
        </p>
      </div>
      <!-- <div class="live-item">
        <p class="title overflow"><span class="purple">预告</span><span>肖战《陈情令》宣传广州发布会现场直播</span></p>
        <p class="red-word"><span style="flex: 1;">02天12时24分24秒</span><span class="button">开播提醒</span></p>
      </div> -->
    </div>

    <van-tabs v-model="activeName" @click="handleClick" sticky>
      <van-tab v-if="dataInfo.is_back">
        <template #title
          ><div class="back-head"><i class="iconfont icon-zb_zhiboicon"></i> <span>直播回放</span></div></template
        >
        <div class="living-box">
          <div class="living-item" v-for="(item, index) in dataList[0].list" :key="index" @click="gotoBackPlay(item.id, item.room_id)">
            <div class="bg">
              <img style="width: 100%; height: 100%;" :src="item.cover" alt="" />
            </div>
            <div class="top">
              <span class="left">{{ item.view_num }}人观看 | {{ item.goods_num }}商品</span><span class="time">{{ item.time }}</span>
            </div>
            <div class="bottom overflow" style="text-align: left;">{{ item.title }}</div>
          </div>
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem auto; display: block;" v-if="fun.isTextEmpty(dataList[0].list)" />
        </div>
      </van-tab>
      <van-tab v-if="dataInfo.short_video_display">
        <template #title
          ><div class="back-head"><i class="iconfont icon-extension_video" style="color: #018cfb; font-size: 24px;"></i> <span>短视频</span></div></template
        >
        <div class="video-list">
          <ul ref="newArray1" class="zq-waterfall-left">
            <li @click="toVideo(item)" v-for="(item, i) in newArray1" :key="i">
              <img class="video-img" :src="item.cover" alt="" />
              <p>{{ item.title }}</p>
              <div class="people">
                <img :src="dataInfo.avatar" alt="" />
                <span>{{ dataInfo.nickname }}</span>
              </div>
              <img class="play" src="../../assets/images/home_play@2x.png" alt="" />
            </li>
          </ul>
          <ul ref="newArray2" class="zq-waterfall-right">
            <li @click="toVideo(item)" v-for="(item, i) in newArray2" :key="i">
              <img class="video-img" :src="item.cover" alt="" />
              <p>{{ item.title }}</p>
              <div class="people">
                <img :src="dataInfo.avatar" alt="" />
                <span>{{ dataInfo.nickname }}</span>
              </div>
              <img class="play" src="../../assets/images/home_play@2x.png" alt="" />
            </li>
          </ul>
          <div class="load" v-if="!showLoading">
            <img src="../../assets/images/video-loading.gif" alt="loading" />
          </div>
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem auto; display: block;" v-if="showLoading && fun.isTextEmpty(dataList[activeName].list)" />
          <div style="height: 3rem;"></div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import anchorDeatil_Controller from "./anchorDeatil_Controller";
export default anchorDeatil_Controller;
</script>
<style lang="scss" scoped>
.member-head,
.see-back,
.live-list {
  background: #fff;
  text-align: left;
}

.member-head {
  display: flex;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  justify-content: space-between;

  .left {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;

    .name-box,
    .describe {
      margin-bottom: 0.5rem;
      display: flex;
    }

    .describe {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .name {
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
      max-width: 9.5rem;
      height: 1.5rem;
      line-height: 1.5rem;
    }

    .fans {
      color: #ff6e00;
      font-size: 12px;
      border-radius: 15px;
      border: solid 1px #ff6e00;
      padding: 0.2rem 0.5rem;
      margin-left: 0.5rem;
    }

    .describe {
      font-size: 12px;
      color: #666;
    }

    .focus,
    .unfocus {
      width: 5.25rem;
      line-height: 1.5rem;
      color: #fff;
      background-color: #f60426;
      border-radius: 0.938rem;
      text-align: center;
      font-size: 15px;
      font-weight: bold;
    }

    .unfocus {
      background-color: #666;
    }
  }

  .right {
    img {
      width: 6.313rem;
      height: 6.313rem;
      border-radius: 50%;
    }
  }
}

.live-list {
  padding: 0.5rem 0.8rem 0 0.8rem;
}

.live-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;

  .title {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .red {
    border-radius: 15px;
    text-align: center;
    color: #fff;
    background-color: #f51534;
    font-size: 12px;
    padding: 0.15rem 0.4rem;
    margin-right: 0.5rem;
  }

  .purple {
    border-radius: 15px;
    text-align: center;
    color: #fff;
    background-color: #8415f5;
    font-size: 12px;
    padding: 0.15rem 0.4rem;
    margin-right: 0.5rem;
  }

  .gray {
    color: #999;
    font-size: 12px;
  }

  .red-word {
    font-size: 12px;
    color: #f51534;
    display: flex;

    .van-count-down {
      font-size: 12px;
      color: #f51534;
    }

    .button {
      flex: 0 0 4rem;
      border: 1px solid #f51534;
      border-radius: 15px;
      text-align: center;
    }
  }
}

.living-box {
  background: #fff;
  margin: 0 0.8rem;
  padding-bottom: 1rem;
}

.back-head {
  display: flex;
  font-size: 16px;
  font-weight: bold;
  padding: 0.5rem 0.8rem;

  span {
    display: inline-block;
    align-self: center;
  }

  i {
    color: #ff6e00;
    font-size: 30px;
  }
}

.living-item {
  position: relative;
  margin: 0 auto 0.5rem auto;

  .bg {
    width: 21.875rem;
    height: 10rem;
    border-radius: 0.313rem;
    background: #eee;
  }

  .top {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    color: #fff;
    display: flex;
    width: 96%;

    .left {
      background-color: rgba(0, 0, 0, 0.4);
      padding: 0.15rem 0.4rem;
      border-radius: 0.625rem 0 0.625rem 0;
      font-size: 12px;
    }

    .time {
      flex: 1;
      text-align: right;
      line-height: 1.25rem;
      padding: 0.15rem 0.4rem;
    }
  }

  .bottom {
    width: 95%;
    position: absolute;
    bottom: 0.6rem;
    left: 0.5rem;
    font-weight: bold;
    font-size: 16px;
    color: #fff;
  }
}

.video-list {
  margin: 0.5rem 0.5rem 3.5rem 0.5rem;
  text-align: left;

  /* display: flex; */
  ul {
    vertical-align: top;
    display: inline-block;

    /* display: flex; */

    /* flex-direction: column; */

    /* flex-wrap: wrap; */
    width: 48%;
  }

  li {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    overflow: hidden;
  }

  .play {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  ul:first-child {
    margin-right: 0.5rem;
  }

  p {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    padding: 5px 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .video-img {
    width: 100%;
    height: auto;
  }

  .people {
    display: flex;
    padding: 5px;

    img {
      flex: 0 0 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      margin: 0 5px;
    }

    span {
      flex: 1;
      line-height: 1.5rem;
      margin: 0 5px;
      font-size: 11px;
      color: #8c8c8c;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}

.load {
  text-align: center;

  img {
    width: 3rem;
  }
}
</style>
