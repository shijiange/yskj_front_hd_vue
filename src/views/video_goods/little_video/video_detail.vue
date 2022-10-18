<template>
  <div class="wrap">
    <!-- <c-title :hide="false" :text="'短视频标题'" style="z-index:999;"></c-title> -->
    <!-- v-if="dataList[activeType] && dataList[activeType].list.length > 0" -->
    <template v-if="dataList[activeType]">
      <div class="my-video" v-show="show" :style="this.fun.getPhoneEnv() == 3 ? pcVideoStyleObject : phoneVideoStyleObject">
        <video
          :class="minStyle ? '' : 'video-style'"
          :src="showVideo.video_src"
          :poster="showVideo.cover"
          webkit-playsinline="true"
          controlslist="nodownload"
          playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          preload="meta"
          ref="video"
          id="myVideo"
        >
          <!--@pause="onpause"-->
          <!--@play="onplay"-->
          <source :src="showVideo.video_src" type="video/mp4" />
        </video>
      </div>

      <div class="top-nav" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" :style="{ zIndex: showWechatshar ? '0' : '999' }">
        <!-- <c-title :hide="false" :text="'短视频标题'"></c-title> -->
        <div class="navigation-bar">
          <van-icon name="arrow-left" @click="backPage"></van-icon>
          <van-tabs class="tabs-style" v-model="activeType" @click="onChangeVideoTab" v-if="dataList.length != 1&&this.$route.query.from != 'me'">
            <van-tab :title="items.title" v-for="(items, i) in dataList" :key="i"> </van-tab>
          </van-tabs>
          <div v-else style="height: 40px; line-height: 40px; flex: 1; padding-left: 10px; font-size: 18px;">{{ dataList[0].title }}</div>
          <div class="right-icons">
            <i class="iconfont icon-fontclass-shouye" @click="gotoHome"></i>
            <i class="iconfont icon-fontclass-huiyuanzhongxin1" @click.stop="gotoMember" v-if="is_member_enter"></i>
          </div>
        </div>
      </div>
      <template v-if="dataList[activeType].list.length > 0">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item, index) in dataList[activeType].list" :key="index">
            <div :style="swiperConStyle">
              <div class="works_wrap" v-show="!item.show" @click="clickSwiper(index)">
                <div class="poster">
                  <img class="pic" v-show="!show" ref="pic" :src="item.cover" />
                </div>
                <div class="playWorks" :class="{ 'playWorks-bg': !show }"></div>
                <img class="play" src="../../../assets/images/find_play@2x.png" v-if="!item.show" alt="" />
              </div>

              <div class="live-box" v-if="BasicSet.is_show_live == '1' && item.is_live" @click="gotoLiveRoom(item.room_id)">
                <div class="wave">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="live-box-text">正在直播</div>
              </div>

              <div class="advertising-Box" v-if="item.ad_serving_button_status">
                <!-- 广告投放 -->
                <div class="advertising-Box-child member-look-ads" v-if="item.ad_serving_button_status.watch && isShowADLook">
                  <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/ad-serving/look-ads.png" alt="" @click.stop="gotoUrl('advertisingList', { tag: 'video', id: item.id })" />
                  <i class="iconfont icon-adsystem_icon_cancle" @click.stop="isShowADLook = false"></i>
                </div>
                <div class="advertising-Box-child go-put-ads" v-if="item.ad_serving_button_status.put_in && isShowADPut">
                  <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/ad-serving/put-ads.png" alt="" @click.stop="gotoUrl('advertisingPutAD', { item: item })" />
                  <i class="iconfont icon-adsystem_icon_cancle" @click.stop="isShowADPut = false"></i>
                </div>
              </div>

              <div class="side-bar">
                <div class="side-bar-child" v-if="BasicSet.customIcon" @click="onIconLink">
                  <img class="like" :src="BasicSet.customIcon" alt="" style="padding: 2px;" />
                  <span class="side-bar-child-text" style="line-height: 24px;">{{ BasicSet.icon_name }}</span>
                </div>
                <router-link class="side-bar-child" :to="fun.getUrl('videoAgreement')">
                  <!-- <i class="iconfont icon-video_recording"></i> -->
                  <div class="wrap-arc">
                    <div class="inline-arc"></div>
                  </div>
                  <span class="side-bar-child-text">发布</span>
                </router-link>
              </div>

              <!-- 视频信息-用户信息 -->
              <div class="video-detail-box">
                <div class="good-and-title">
                  <div class="good-box" @click.stop="toGood(item)" v-if="item.goods">
                    <div class="good-img">
                      <img :src="item.goods.thumb" alt="" />
                    </div>
                    <div class="text-wrap">
                      <p class="desc">{{ item.goods.title }}</p>
                      <div class="money">
                        <span class="price">{{ $i18n.t("money") }}{{ item.goods.price }}</span>
                        <span class="old-price">原价：{{ $i18n.t("money") }}{{ item.goods.market_price }}</span>
                      </div>
                    </div>
                    <div class="cart">
                      <img src="../../../assets/images/find_cart@2x.png" alt="" />
                    </div>
                  </div>
                  <!-- <div class="member-name" v-if="BasicSet.is_show_name && BasicSet.is_show_name == '1' && item.member">{{ item.member.nickname }}</div> -->
                  <!-- <div class="video-title">{{ showVideo.title }}</div> -->
                </div>
                <div class="video-title">{{ showVideo.title }}</div>
                <div class="detail-box" :class="[fun.isIphoneX() ? 'iphoneXStyle' : '']">
                  <div style="display: flex; align-items: center;">
                    <div class="left-user-info" >
                      <img class="avatar" :src="item.member ? item.member.avatar : ''" alt="" @click.stop="chooseUser(item)"/>
                      <div class="user" @click.stop="goMyVideo(item.member.uid)">
                        <p>{{ item.member ? item.member.nickname : "" }}</p>
                        <p style="font-size: 12px;">共{{ item.member_video_num ? item.member_video_num : 0 }}个分享视频</p>
                      </div>
                    </div>
                    <div class="center-follow">
                      <div :class="['btn-follow', { grey: item.is_follow }]" @click.stop="followMember(item.member.uid, item.is_follow, index)">{{ item.is_follow ? "已关注" : "关注" }}</div>
                    </div>
                  </div>

                  <div class="right-icon">
                    <div @click="shareVideo(index)" class="share-icon">
                      <i class="iconfont icon-zb_share"></i>
                      <p>{{ item.share_num ? calNum(item.share_num) : "0" }}</p>
                    </div>
                    <div @click.stop="toggleLike(item)" class="like-icon">
                      <p>
                        <i class="iconfont icon-bc_like_normal" v-if="item.member_like == 1"></i>
                        <i class="iconfont icon-zb_all_like" v-if="item.member_like != 1" style="color: #ff5757;"></i>
                      </p>
                      <p>{{ item.like_num ? calNum(item.like_num) : 0 }}</p>
                    </div>
                    <div @click.stop="toComment(item)" class="comment-icon" v-if="comment_open == 1">
                      <i class="iconfont icon-service_shop"></i>
                      <p>{{ item.comment_num ? calNum(item.comment_num) : 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="play-video" v-if="item.show" @click="clickSwiper(index)"></div>
            </div>
          </swiper-slide>
        </swiper>
      </template>
      <template v-if="!loading && dataList[activeType].list.length <= 0">
        <div class="noData">
          <img src="../../../assets/images/energytank_blank@2x.png" class="noData_imgs" alt="" />
          <p class="text">暂无视频！</p>
          <router-link :to="fun.getUrl('videoAgreement')" class="btn" tag="div">分享视频</router-link>
        </div>
      </template>
    </template>
    <yzWechatShareImg v-model="showWechatshar"></yzWechatShareImg>

    <van-popup v-model="showRedpack" round :close-on-click-overlay="false" :style="{ backgroundColor: 'transparent' }">
      <div
        class="Redpack-box"
        :style="{
          backgroundImage: 'url(' + (redpack_info.redpack_pic ? redpack_info.redpack_pic : 'https://dev4.yunzmall.com/attachment/image/7ad7f27c83eac4db1f8e0473798de644.png') + ')'
        }"
      >
        <transition name="slide-fade">
          <div v-if="!openRedpack">
            <div class="Redpack-title">
              <img class="avator" :src="redpack_info.logo_pic" alt="" />
            </div>
            <div class="Redpack-text">{{ redpack_info.redpack_text }}</div>

            <div class="Redpack_bg_box">
              <div class="Redpack-btn rotate" @click.stop="openRedpackM"></div>
              <div class="Redpack-close" @click.stop="cloneRedpack">放弃领取</div>
              <div class="Redpack_bg"></div>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="open-redpack-box" v-if="openRedpack">
            <div class="Redpack-title Redpack-logo">
              <img class="avator" :src="redpack_info.logo_pic" alt="" />
            </div>
            <div class="Redpack-text open-text">{{ redpack_info.redpack_text }}</div>
            <div class="open-total">{{ redpack_info.amount }}<em style="font-size: 0.75rem;">元</em></div>
            <div class="Redpack-text open-text color-text">红包已通过微信发放成功，请注意查收！</div>
            <div class="Redpack_bg_box open-redpack_bg_box">
              <div class="Redpack_bg"></div>
            </div>
            <div class="Redpack-close open-redpack-clone" @click.stop="cloneRedpack">关闭页面</div>
          </div>
        </transition>
      </div>
    </van-popup>
    <van-popup v-model="showVerification" round :close-on-click-overlay="false">
      <div class="verification">
        <!-- 验证码弹窗 -->
        <div class="text">根据要求，您需要验证手机号才可以领取微信现金红包，感谢您的支持！</div>
        <div class="inputBox">
          <em class="name">手机号</em>
          <input type="number" placeholder="请输入手机号" id="phone" v-model="form.mobile" />
        </div>
        <div class="inputBox" v-if="imgcode">
          <em class="name">验证码</em>
          <input type="text" placeholder="请输入图形验证码" id="code" v-model="form.captcha" />
          <img class="getcodeImg" style="width: 100%; height: 2.5rem; z-index: 999;" :src="imgcode" @click="getimgdata()" />
        </div>
        <div class="inputBox">
          <em class="name">验证码</em>
          <input type="number" placeholder="请输入验证码" id="code" v-model="form.code" /><span class="getcodeClass" @click="VerificationCode" v-show="!cationCode">获取验证码</span
          ><span class="getcodeClass" v-show="cationCode">{{ count }}秒后重新获取</span>
        </div>
        <div class="bottomBox">
          <div class="btn1" @click="showVerification = false">取消</div>
          <div class="btn2" @click="alterAction">确认</div>
        </div>
      </div>
    </van-popup>
    <!-- 答题 start -->
    <van-popup v-model="showVideoAnswer" :close-on-click-overlay="false" position="bottom" :style="{ height: '100%' }">
      <div class="answer-page">
        <div class="header">答题赢{{ integral_name }}</div>
        <div class="answerContainer" v-if="subject != null">
          <div class="answerTitle">{{ subject.title }}</div>
          <div class="answerList">
            <div class="answerItem" v-for="item in answerfilter" :key="item.id" @click="reward(item.id)">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="successShow" style="background: transparent;" :close-on-click-overlay="false">
      <div class="successAlert">
        <div class="c1">答题成功</div>
        <div class="c2">恭喜你获得{{ integral_name }}</div>
        <div class="c3">{{ integral }}</div>
        <div class="btn" @click="cloneAnswer">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/videoAnswerSuccess@3x.png" alt="" />
        </div>
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
        <div class="btn" @click="cloneAnswer">我知道了</div>
      </div>
    </van-popup>
    <!-- 答题 end -->

    <!-- 短视频积分弹窗-#71249 start -->
    <van-overlay :show="videoShare.show" @click="videoShare.show = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="integral-71249" v-show="videoShare.show">
            <div class="integral-71249-box">
              <div class="integral-71249-box-title">观看视频成功</div>
              <div class="integral-71249-box-desc">恭喜你获得{{ videoShare.point_name }}！</div>
              <div class="integral-71249-box-num">{{ videoShare.points }}</div>
              <div style="color: #e46b00;margin-top: 0.75rem;" v-if="videoShare.days">奖励将在{{ videoShare.days }}天后发放</div>
              <div class="integral-71249-box-button">我知道了</div>
            </div>
            <div class="integral-71249-close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="videoShare.show = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>
    <!-- 短视频积分弹窗-#71249 end -->

    <!-- 评论弹窗组件 -->
    <comment-group
      v-model="showYzComment"
      v-on:onMore="onCommentMore"
      :loading="commentLoading"
      :finished="commentFinished"
      :length="commentTotal"
      v-on:sendComment="sendComment"
      v-on:delComment="delComment"
    >
      <comment-cell
        v-for="(item, index) in commentlist"
        :key="item.id"
        :index="index"
        :reply_num="item.reply_num"
        :avatar="item.head_image"
        :nickname="item.nick_name"
        :time="item.created_at"
        :content="item.content"
        :isAuthority="item.can_del == 1 ? true : false"
        v-on:getRely="getRely"
      >
        <comment-cell-item
          v-for="(itemChild, itemIndex) in item.append_arr"
          :key="itemChild.id"
          :childIndex="itemIndex"
          :index="index"
          :avatar="itemChild.head_image"
          :nickname="itemChild.nick_name"
          :time="itemChild.created_at"
          :content="itemChild.content"
          :isAuthority="itemChild.can_del == 1 ? true : false"
          :Responder="itemChild.reply_name"
        >
          <template v-slot:cell-item-other>
            <div class="cell-slot-box like-box" @click.stop="clickLikeItem(index, itemIndex, itemChild.is_support)">
              <i class="iconfont icon-fontclass-dianzan " :class="{ 'slot-active-color': itemChild.is_support }"></i>
              <div>{{ itemChild.support_num }}</div>
            </div>
          </template>
        </comment-cell-item>
        <template v-slot:cell-other>
          <div class="cell-slot-box like-box" @click.stop="clickLikeItem(index, '', item.is_support)">
            <i class="iconfont icon-fontclass-dianzan" :class="{ 'slot-active-color': item.is_support }"></i>
            <div>{{ item.support_num }}</div>
          </div>
        </template>
      </comment-cell>
    </comment-group>
  </div>
</template>

<script>
import video_detail_controller from "./video_detail_controller";

export default video_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.pcStyle {
  width: 375px !important;
}

.wrap {
  position: relative;

  .top-nav {
    position: fixed;
    top: 0;
    left: 50%;
    width: 100%;
    transform: translate(-50%, 0);
    z-index: 999;

    .navigation-bar {
      display: flex;
      height: 2.75rem;
      align-items: center;
      font-size: 23px;
      color: #fff;
      padding: 0 0.5rem;
      background-image: linear-gradient(0deg, rgba(3, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);

      .right-icons {
        display: inherit;

        i {
          font-size: 1.3rem;
        }

        .icon-fontclass-huiyuanzhongxin1 {
          margin-left: 1rem;
        }
      }
    }

    .tabs-style {
      // width: 15rem;
      margin: 0 auto;

      /deep/.van-tabs__wrap {
        .van-tabs__nav {
          background-color: transparent;
        }

        .van-tab {
          color: #fff;
          opacity: 0.6;
          font-size: 15px;
          padding: 0 8px;
        }

        .van-tab--active {
          opacity: 1;
        }

        .van-tabs__line {
          bottom: 22px;
          background-color: #fff;
          width: 20px;
        }
      }
    }
  }

  .noData {
    width: 100vw;
    height: 100vh;
    padding: 8rem 2rem 2rem;
    background: #f3f3f3;
    display: flex;
    flex-direction: column;
    align-items: center;

    .noData_imgs {
      width: 100%;
      margin: 0;
    }

    .text {
      padding: 1rem 0;
      color: #999;
      font-size: 1rem;
    }

    .btn {
      width: 16rem;
      height: 2.5rem;
      line-height: 2.5rem;
      border-radius: 2rem;
      font-size: 1rem;
      background-image: -webkit-linear-gradient(bottom, #ff8a66, #ff6260, #ff6260);
      color: #fff;
      text-align: center;
    }
  }
}

.live-box {
  height: 1.438rem;
  line-height: 1.438rem;
  position: absolute;
  top: 5rem;
  right: 1rem;
  background-color: #ff5757;
  border-radius: 0.875rem;
  overflow: hidden;
  color: #fff;
  z-index: 10;
  display: flex;
  padding-left: 0.5rem;

  .live-box-text {
    padding: 0 0.875rem;
  }

  .wave {
    position: relative;
  }

  .wave span {
    width: 2px;
    height: 5px;
    bottom: 5px;
    position: absolute;
    background: #fff;
    -webkit-animation: bodong 0.5s infinite ease;
  }

  .wave span:first-child {
    left: 0;
    -webkit-animation-delay: 0.3s;
  }

  .wave span:nth-child(2) {
    left: 5px;
    -webkit-animation-delay: 0.4s;
  }

  .wave span:nth-child(3) {
    left: 10px;
    -webkit-animation-delay: 0.6s;
  }

  @-webkit-keyframes bodong {
    0% {
      height: 2px;
      background: bule;
    }

    30% {
      height: 5px;
      background: bule;
    }

    60% {
      height: 8px;
      background: bule;
    }

    80% {
      height: 12px;
      background: bule;
    }

    100% {
      height: 5px;
      background: bule;
    }
  }
}

.my-video {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  visibility: visible;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
  }
  .video-style {
    object-fit: cover;
  }
}

.Redpack-box {
  width: 15.281rem;
  height: 25.313rem;
  overflow: hidden;
  background-size: 100% 100%;
  background-position: top left;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto;

  .Redpack-title {
    display: flex;

    .avator {
      margin: 2.8rem auto 0;
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 0.125rem;
      object-fit: contain;
    }
  }

  .Redpack-text {
    font-size: 1.125rem;
    text-align: center;
    color: #ceac74;
    padding: 0.5rem 1rem;
    font-weight: bold;
    width: 100%;
  }

  .Redpack_bg_box {
    position: absolute;
    height: 6.75rem;
    width: 100%;
    bottom: 0;
    left: 0;
    perspective: 25.313rem;

    .Redpack-btn {
      width: 4.75rem;
      height: 4.75rem;
      border-radius: 50%;
      overflow: hidden;
      background-color: #e5c185;
      position: absolute;
      z-index: 999;
      left: 50%;
      margin-left: -2.375rem;
      margin-top: -1.5rem;
      background-image: url("../../../assets/images/redEnvelope/open_btn.png");
      background-size: 100% 100%;
    }

    .rotate {
      -webkit-animation: anim 1s infinite alternate;
      -ms-animation: anim 1s infinite alternate;
      -moz-animation: anim 1s infinite alternate;
      -o-animation: anim 1s infinite alternate;
      animation: anim 1s infinite alternate;
    }

    @-webkit-keyframes anim {
      0% {
        -webkit-transform: rotateY(180deg);
      }

      100% {
        -webkit-transform: rotateY(360deg);
      }
    }

    @keyframes anim {
      0% {
        transform: rotateY(180deg);
      }

      100% {
        transform: rotateY(360deg);
      }
    }

    .Redpack_bg {
      overflow: hidden;
      position: relative;
      height: 110%;
      width: 100%;
    }

    .Redpack_bg::before {
      position: absolute;
      margin-top: calc(2.25rem * -1);
      margin-right: calc(3rem * -1);
      margin-bottom: calc(3rem * -1);
      margin-left: calc(8rem * -1);
      padding: 1.75rem 8rem;
      border-radius: 50%;
      box-shadow: 0 0 0 380px rgba(#f04333, 1);
      content: "";
    }
  }

  .Redpack-close {
    color: #fff;
    font-size: 0.75rem;
    position: absolute;
    bottom: 1.875rem;
    width: 100%;
    z-index: 99;
  }

  .open-redpack-clone {
    color: #000;
    bottom: 0.875rem;
  }
}

/* 可以设置不同的进入和离开动画 */

/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.35s ease;
}

.slide-fade-leave-active {
  // transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(100px);
  opacity: 0;
}

.open-redpack-box {
  width: 100%;
  height: 100%;

  .Redpack-logo {
    margin-top: 4.5rem;
    z-index: 2;
    position: relative;
  }

  .open-text {
    z-index: 2;
    position: relative;
    font-size: 0.75rem;
    color: #aeaeae;
    padding: 0 1rem;
    font-weight: 100;
  }

  .open-total {
    font-size: 2.375rem;
    color: #ceac74;
    padding: 1rem 1rem 0;
    font-weight: bold;
    z-index: 2;
    position: relative;
  }

  .color-text {
    color: #ceac74;
    font-size: 0.625rem;
  }

  .open-redpack_bg_box {
    height: 20.156rem;
    overflow: hidden;

    .Redpack_bg.Redpack_bg::before {
      position: absolute;
      margin-top: calc(1.375rem * -1);
      margin-left: calc(8rem * -1);
      padding: 1.75rem 8rem;
      border-radius: 50%;
      box-shadow: 0 0 0 380px rgba(#fff, 1);
      border: 2px solid #efca62;
      content: "";
    }
  }
}

.up-enter-active,
.up-leave-active {
  transition: all 0.5s;
}

.up-enter,
.up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.wrap {
  background: #000;
  width: 100%;
  height: 100%;

  .icon-search {
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 10px;
    font-size: 24px;
    z-index: 222;
  }

  .scroll-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.mack {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  opacity: 0.8;
  z-index: 98;
  display: none;
}

.works_wrap {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  height: 100%;
  visibility: visible;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  overflow: hidden;

  .play {
    position: absolute;
    z-index: 11;
    left: calc(55% - 2rem);
    top: calc(50% - 2rem);
    width: 2rem;
    height: 2rem;
  }
}

.swiper-slide .works_wrap .poster {
  /* background: #000000; */
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  visibility: visible;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide .works_wrap .poster .pic {
  width: 100%;
  height: auto;
  vertical-align: middle;
}

.swiper-slide .works_wrap .playWorks {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background-size: auto 50px;
  // background: #000;
}

.swiper-slide .works_wrap .playWorks-bg {
  background: #000;
}

.good-and-title {
  // position: absolute;
  // left: 0;
  // bottom: 5.875rem;
  // z-index: 99;
  // position: absolute;
  left: 0;
  bottom: 6.875rem;
  z-index: 99;
  display: flex;

  .member-name {
    text-align: left;
    text-indent: 0.625rem;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    padding-top: 0.875rem;
  }
}

.iphoneXStyle {
  padding-bottom: 20px;
}

.video-detail-box {
  position: absolute;
  z-index: 99;
  left: 0;
  bottom: 0;
  width: 100%;
  background-image: linear-gradient(0deg, rgba(3, 0, 0, 0.6) 0%, rgba(2, 0, 0, 0.2) 90%, rgba(0, 0, 0, 0) 100%);
  color: #fff;
  padding-top: 2rem;

  .detail-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 1rem;
    padding-right: 1rem;
    background-color: #000;

    .left-user-info {
      width: 9rem;
      display: flex;
      text-align: left;

      .avatar {
        margin-right: 0.5rem;
        width: 2.19rem;
        height: 2.19rem;
        border-radius: 50%;
        background: #fff;
      }

      .user {
        flex: 1;
        overflow: hidden;

        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .center-follow {
      .btn-follow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.13rem;
        height: 1.31rem;
        background-color: #e7a816;
        border-radius: 0.66rem;
      }

      .grey {
        background-color: #7b7b7b;
      }
    }

    .right-icon {
      // width: 7rem;
      display: flex;
      justify-content: space-between;

      .iconfont {
        font-size: 1.4rem;
      }

      .share-icon,
      .like-icon,
      .comment-icon {
        margin-left: 1rem;
      }
    }
  }
}

.good-box {
  display: flex;
  z-index: 10;
  // width: 16rem;
  // height: 5rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0 12px 12px 0;
  box-shadow: inset 0px 0px 1px 0px #fff;
  padding: 0.25rem;

  .good-img {
    margin-right: 0.35rem;
    width: 3rem;
    height: 3rem;
    flex: 0 0 3rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .text-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: left;
    // line-height: 1.75rem;
    max-width: 10rem;
    min-width: 5rem;
    font-weight: bold;
    justify-content: space-evenly;
  }

  .desc {
    line-height: 1.125rem;
    height: 1.125rem;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .money {
    display: flex;
    word-break: break-all;
    flex-wrap: wrap;
    // flex-direction: column;
  }

  .price {
    font-size: 13px;
    line-height: 13px;
    color: #f15353;
    margin-right: 0.5rem;
  }

  .old-price {
    text-decoration: line-through;
    color: #999;
    font-size: 10px;
    font-weight: 400;
  }

  .cart {
    flex: 0 0 1.25rem;
    width: 1.25rem;
    height: 1.25rem;
    line-height: 3.75rem;
    margin: 0 0.5rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.video-title {
  z-index: 10;
  width: 18rem;
  padding: 0.375rem 0 0 0.625rem;
  font-size: 13px;
  line-height: 20px;
  text-align: left;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.side-bar {
  position: absolute;
  z-index: 999;
  right: 0.5rem;
  bottom: 7vh;
  // width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  word-break: keep-all;
  flex-flow: column wrap-reverse;
  max-height: 60vh;

  .side-bar-child {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    padding-bottom: 6px;
    position: relative;

    .avatar {
      border-radius: 50%;
      display: block;
      background: none;
      border: 1px solid rgb(232, 232, 233);
      margin: 0 0 0.625rem 0;
    }

    .follow-box {
      text-align: center;
      position: absolute;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%) translateY(50%);
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 50%;
      background: rgb(252, 52, 93);
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 14px;
      }
    }

    .like {
      width: 40px;
      height: 40px;
      margin: 0;
      border-radius: 0.3rem;
    }

    .iconfont {
      font-size: 28px;
      line-height: 40px;
    }

    .wrap-arc {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border: 4px solid #fff;
      background: transparent;
      border-radius: 50%;

      .inline-arc {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #f54242;
      }
    }

    .side-bar-child-text {
      line-height: 28px;
      width: 100%;
      font-size: 11px;
    }
  }
}

.advertising-Box {
  position: absolute;
  left: 0.5rem;
  top: 5.875rem;
  z-index: 99;

  .advertising-Box-child {
    width: 3.75rem;
    height: 3.75rem;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .icon-adsystem_icon_cancle {
      position: absolute;
      top: -0.875rem;
      right: -1rem;
      color: #fff;
      padding: 0.25rem;
    }
  }

  .member-look-ads {
    margin-bottom: 0.75rem;
  }
}

.play-video {
  position: absolute;
  z-index: 9;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
}

.verification {
  width: 17.5rem;
  padding: 0 0.75rem;

  .text {
    padding: 1.725rem 2rem 2.125rem;
    color: #666;
    text-align: center;
    font-size: 0.75rem;
  }

  .inputBox {
    height: 2.625rem;
    line-height: 2.625rem;
    display: flex;
    border-bottom: 0.0625rem solid #ebebeb;
    text-align: left;
    align-items: center;
    margin-top: 0.625rem;

    .name {
      width: 3.875rem;
      color: #000;
    }

    input {
      border: none;
    }

    #phone {
      flex: 1;
    }

    #code {
      width: 40%;
    }

    .getcodeClass {
      display: inline-block;
      height: 1.25rem;
      line-height: 1.25rem;
      background-color: #f54242;
      color: #fff;
      border-radius: 0.625rem;
      padding: 0 0.625rem;
      font-size: 0.75rem;
    }

    .getcodeImg {
      display: inline-block;
      height: 1.25rem;
      line-height: 1.25rem;
      flex: 1;
    }
  }

  .bottomBox {
    padding-top: 2.5rem;
    padding-bottom: 1rem;
    display: flex;
    justify-content: space-around;

    .btn1,
    .btn2 {
      width: 6rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      color: #fff;
      font-size: 1rem;
      border-radius: 1.234rem;
    }

    .btn1 {
      background: #bcbcbc;
    }

    .btn2 {
      background: #f71515;
    }
  }
}

.answer-page {
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/videoAnswerBg@3x.png);
  background-size: cover;
  min-height: 100vh;

  .header {
    margin: 0 auto;
    padding-top: 1.8rem;
    font-size: 2.2rem;
    color: #e9e8e8;
  }
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

.cell-slot-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  margin-left: 0.625rem;

  .icon-fontclass-dianzan {
    font-size: 18px;
  }

  .slot-active-color {
    color: #f15353;
  }
}

.integral-71249 {
  .integral-71249-box {
    width: 22.906rem;
    height: 24.688rem;
    padding-top: 7.3rem;
    border-radius: 0.5rem;
    background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/integral-71249-box-bg.png);
    background-repeat: no-repeat;
    background-size: contain;

    .integral-71249-box-title {
      height: 3.063rem;
      line-height: 150%;
      font-size: 25px;
      font-weight: bold;
      color: #fff2c7;
    }

    .integral-71249-box-desc {
      margin-top: 2.6rem;
      padding-left: 0 3.8rem;
      font-size: 23px;
      color: #e46b00;
    }

    .integral-71249-box-num {
      margin-top: 0.4rem;
      font-size: 30px;
      color: #ee1717;
    }

    .integral-71249-box-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 10rem;
      height: 3rem;
      margin: 2rem auto 0;
      padding-bottom: 0.3rem;
      font-size: 19px;
      color: #fff;
      background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/integral-71249-box-button-bg.png);
      background-repeat: no-repeat;
      background-size: cover;
    }
  }

  .integral-71249-close {
    height: 3rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .icon-adsystem_icon_cancle {
      font-size: 3rem;
      color: #fff;
      width: 3rem;
      height: 3rem;
    }
  }
}
</style>
