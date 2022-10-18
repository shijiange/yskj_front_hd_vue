<template>
  <div id="my-video">
    <c-title :hide="false" :text="'个人主页'"> </c-title>
    <!-- 李晓红 (和对应的css) start -->
    <div class="header">
      <div class="header_content">
        <div class="header_left">
          <img :src="member.avatar_image"/>
        </div>
        <div class="headet_right">
          <div class="headet_right_top">
            <div class="name">{{ member.nickname }}</div>
            <!-- <div v-if="homepageData.is_own != 1" class="attention" @click="attentionBtn">{{ homepageData.is_follow ? "已关注" : "+关注" }}</div>-->
          </div>
          <!-- 签名 -->
          <div class="bottom bottom2" @click="introductionInp" >
            <template v-if="homepageData.signature"> {{ homepageData.signature }}</template>
            <template v-if="!homepageData.signature && isSelf">
              <div class="b_left">个性签名</div>
              <div class="b_right"><img src="../../../assets/images/micro_communities/home_autograph@2x.png" /></div>
            </template>
          </div>

        </div>
      </div>   
      <div class="tabMicroVideo">   
        <div  class="tabItem" @click="toMicroHomePage()">社区</div>
        <div  class="tabItem  nowActive"  @click="toMyVideoPage()">视频</div>
      </div>
    </div>
    <!-- 李晓红  end --> 

    <van-tabs v-model="activeName" @click.native="handleClick">
      <van-tab :title="`已发布(${release})`" name="1"></van-tab>
      <van-tab :title="`审核中(${review})`" name="0" v-if="is_open"></van-tab>
    </van-tabs>
    <div class="video-list">
      <ul ref="newArray1" class="zq-waterfall-left">
        <li v-for="(item, i) in newArray1" @click="toVideo(item)" :key="i">
          <img class="video-img" :src="item.cover" alt="" />
          <p>{{ item.title }}</p>
          <div class="people" v-if="item.member">
            <img :src="item.member.avatar_image" alt="" />
            <span>{{ item.member.nickname }}</span>
          </div>
          <img class="play" src="../../../assets/images/home_play@2x.png" alt="" />
          <div class="deleta" @click.stop="deletaVideo(item.id)" v-if="isSelf">
            <i class="iconfont icon-appointment_delete"></i>
          </div>
        </li>
      </ul>
      <ul ref="newArray2" class="zq-waterfall-right">
        <li v-for="(item, i) in newArray2" @click="toVideo(item)" :key="i">
          <img class="video-img" :src="item.cover" alt="" />
          <p>{{ item.title }}</p>
          <div class="people" v-if="item.member">
            <img :src="item.member.avatar_image" alt="" />
            <span>{{ item.member.nickname }}</span>
          </div>
          <img class="play" src="../../../assets/images/home_play@2x.png" alt="" />
          <div class="deleta" @click.stop="deletaVideo(item.id)" v-if="isSelf">
            <i class="iconfont icon-appointment_delete"></i>
          </div>
        </li>
      </ul>
      <div class="load" v-if="!showLoading">
        <!--<img src="https://dev6.yunzmall.com/addons/yun_shop/static/app/images/video-loading.gif" alt="">-->
        <img src="../../../assets/images/video-loading.gif" alt="loading" />
      </div>
      <div style="height: 3rem;"></div>
    </div>
    <!-- 李晓红  start -->
    <van-popup v-model="mainCommentShow" position="bottom" :overlay="true">
      <div class="replyMainComment">
        <div class="left">
          <input type="text" v-model="maincomment" placeholder="请留下你的简介吧" />
        </div>
        <div class="right" @click="subMainBtn">发送</div>
      </div>
    </van-popup>
    <!-- 李晓红  end -->
  </div>
</template>

<script>
import my_video_controller from "./my_video_controller";

export default my_video_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#my-video {
  .load {
    text-align: center;

    img {
      width: 3rem;
    }
  }
   /*李晓红 */
  .header {
    padding-top: 0.94rem;
    padding-bottom: 0.63rem;
    background-color: #fff;

    .tabMicroVideo{
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        background-color: #fff;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        box-sizing: content-box;
        height: 100%;
        padding-bottom: 15px;
        margin-top: 1rem;
        
        .tabItem{
          position: relative;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-flex: 1;
          -webkit-flex: 1;
          -ms-flex: 1;
          flex: 1;
          -webkit-box-align: center;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -webkit-justify-content: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          padding: 0 4px;
          color: #646566;
          font-size: 14px;
          line-height: 20px;
          cursor: pointer;
        }

    .nowActive{border-bottom:1px solid #ee0a24;}
  }
    .header_content {
      width: 21.94rem;
      height: 6.25rem;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 0.5rem;
      box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.2);
      padding-left: 0.63rem;
      padding-right: 0.66rem;
      display: flex;
      justify-content: space-between;
      padding-top: 1.25rem;

      .header_left {
        width: 3.75rem;
        height: 3.75rem;
        margin-right: 0.66rem;

        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }

      .headet_right {
        flex: 1;

        .headet_right_top {
          display: flex;
          justify-content: space-between;
          padding-bottom: 0.66rem;

          .name {
            font-size: 1rem;
            height: 1.63rem;
            line-height: 1.63rem;
            color: #333;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 8rem;
            text-align: left;
          }

          .attention {
            width: 5rem;
            height: 1.63rem;
            background-color: #f15353;
            border-radius: 0.81rem;
            line-height: 1.63rem;
            font-size: 0.88rem;
            color: #fff;
          }
        }

        .headet_right_bottom {
          width: 100%;
          font-size: 0.88rem;
          line-height: 0.75rem;
          color: #999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
        }

        .bottom {
          display: flex;
          align-items: center;

          .b_left {
            color: #999;
            font-size: 0.88rem;
          }

          .b_right {
            width: 0.9rem;
            height: 0.9rem;

            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
        }
         /* 李晓红 */
        .bottom2{
          color:#999!important;
        }
      }
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

    .deleta {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 2rem;
      height: 2rem;
      border-radius: 100%;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;

      i {
        font-size: 1.5rem;
        line-height: 2rem;
        display: block;
        text-align: center;
      }
    }
  }

     /* 李晓红 css */
    .replyMainComment {
      display: flex;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      padding-left: 1rem;

      .left {
        width: 18.13rem;
        height: 1.88rem;
        background-color: #f5f5f5;
        border-radius: 0.94rem;

        input {
          border: none;
          height: 100%;
          width: 100%;
          padding-left: 1rem;
        }
      }

      .right {
        width: 3rem;
        height: 1.88rem;
        font-size: 0.94rem;
        line-height: 1.88rem;
        color: #333;
      }
    }
}
</style>
