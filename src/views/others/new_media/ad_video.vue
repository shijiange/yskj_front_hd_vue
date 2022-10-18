<template>
  <div id="ADVideo">
    <c-title text="广告详情" style="z-index: 4;"></c-title>
    <div class="iconfont video-play-button icon-member_look" v-show="!videoPlaying" @click="clickVideo"></div>
    <video
      class="video"
      ref="video"
      :src="showAdContent.resources_url"
      :poster="showAdContent.cover_picture"
      loop
      webkit-playsinline="true"
      controlslist="nodownload"
      playsinline="true"
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
      preload="metadata"
      @canplay="videoCanPlay"
      @error="videoLoadError"
      @click="clickVideo"
      v-if="showAdContent"
    >
      <source :src="showAdContent.resources_url" type="video/mp4" />
    </video>
    <van-swipe class="video-swipe" vertical :show-indicators="false" @change="swipeChange" :initial-swipe="showVideoIndex" :loop="false">
      <van-swipe-item class="video-swipe-item" v-for="(videoItem, index) in videos" :key="index" @click="clickVideo"></van-swipe-item>
    </van-swipe>
    <d-fixed-container bottom="7.16rem" right="0.66rem" :fixed="false" style="position: absolute; z-index: 9; bottom: 7.16rem; right: 0.66rem; text-align: right;" v-if="showAdContent">
      <div class="slidebar">
        <div class="video-author">
          <van-image class="video-author_avatar" :src="showAdContent.avatar" round width="3.44rem" height="3.44rem"></van-image>
          <div class="video-author_follow iconfont icon-life-game-plus" @click="followAuthor" v-if="!showAdContent.is_attention"></div>
          <div class="video-author_follow iconfont icon-record_go" @click="unFollowAuthor" v-if="showAdContent.is_attention"></div>
        </div>

        <content-statistics-bar class="slidebar-list" :data="showAdContent" :fixed="false" direction="column" width="100%!important" :reload="reloadStatistics"></content-statistics-bar>
      </div>
    </d-fixed-container>
    <RewardButton right="0.98rem" bottom="2.4rem" absolute @click="showRewardPopup = true" :rewardName="showAdContent.reward_name" :zIndex="9" style="z-index: 4;" v-if="showAdContent" />
    <d-fixed-container bottom="1.4rem" left="1.04rem" :zIndex="9" v-if="adContent">
      <a class="view-ad_button" :href="adContent.link" v-show="adContent.link" style="position: relative; z-index: 9;">点击查看</a>
    </d-fixed-container>
    <reward-popup
      :show="showRewardPopup"
      @close="showRewardPopup = false"
      :avatar="showAdContent.avatar"
      :nickname="showAdContent.nickname"
      :content-id="showAdContent.id"
      v-if="showAdContent"
      :rewardName="showAdContent.reward_name"
      :rewardCredits="adContent.reward_button"
    ></reward-popup>
    <van-popup v-model="attention.showAwardPopup" class="award-popup" position="center">
      <div class="award-popup-content">
        <h1>恭喜获得关注奖励</h1>
        <div class="award-content">
          <span>{{ attention.awardCount }}</span>
          {{ attention.awardName }}
        </div>
        <golden-button class="award-confirm" @click="attention.showAwardPopup = false">确认</golden-button>
      </div>
      <img class="award-popup-decoration" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/new_media/award_popup_bg1.png" />
    </van-popup>
  </div>
</template>

<script>
import DFixedContainer from "@/components/other/common/DFixedContainer";
import RewardButton from "./ScopedComponents/RewardButton";
import RewardPopup from "./ScopedComponents/RewardPopup";
import GoldenButton from "./ScopedComponents/GoldenButton";
import { Image as VanImage } from "vant";
import ContentStatisticsBar from "./ScopedComponents/ContentStatisticsBar";
let videoLoading = null;
export default {
  mounted() {
    this.fun.setWXTitle("广告详情");
    if (!this.$route.query.ad_id) {
      this.$toast("内容不存在");
      return;
    }
    this.adId = Number(this.$route.query.ad_id);
    this.getAdContentDetails();
  },
  deactivated() {
    this.pauseVideo(this.showVideoIndex);
  },
  data() {
    return {
      adId: null,
      adContent: null,
      showRewardPopup: false,
      showVideoIndex: 0,
      videos: [],
      showAdContent: null,
      reloadStatistics: false,
      videoPlaying: false,
      attention: {
        showAwardPopup: false,
        awardCount: null,
        awardName: ""
      }
    };
  },
  methods: {
    swipeChange(index) {
      if (videoLoading) {
        videoLoading.clear();
        videoLoading = null;
      }
      this.pauseVideo();
      this.showAdContent = this.videos[index];
      this.reloadStatistics = true;
      videoLoading = this.$toast.loading({
        message: "视频加载中",
        duration: 0
      });
      this.$nextTick(() => {
        this.reloadStatistics = false;
        this.videoPlaying = false;
        this.clickVideo();
      });
    },
    playVideo() {
      if (this.$refs["video"]) {
        this.$refs["video"].play();
      } else {
        this.$nextTick(() => {
          this.$refs["video"].play();
        });
      }
      if (videoLoading) {
        videoLoading.clear();
        videoLoading = null;
      }
    },
    pauseVideo() {
      if (this.$refs["video"]) {
        this.$refs["video"].pause();
      }
      if (videoLoading) {
        videoLoading.clear();
        videoLoading = null;
      }
    },
    clickVideo() {
      if (this.videoPlaying) {
        this.pauseVideo();
      } else {
        this.playVideo();
      }
      this.videoPlaying = !this.videoPlaying;
    },
    getVideoList() {
      $http
        .get("plugin.new-media-advertising.frontend.media-advertisingt.get-list", {
          page: this.$route.query.page,
          advertisingt_type: this.$route.query.tab_type,
          genre: this.$route.query.content_type
        })
        .then(
          ({
            data: {
              list: { data }
            },
            result,
            msg
          }) => {
            if (result == 0) {
              this.$toast(msg);
              return;
            }
            this.videos = data;

            data.forEach((item, index) => {
              if (item.id == this.adContent.id) {
                this.showVideoIndex = index;
              }
            });
          }
        );
    },
    videoCanPlay() {
      this.videoPlaying = false;
      this.clickVideo();
      if (videoLoading) {
        videoLoading.clear();
        videoLoading = null;
      }
    },
    videoLoadError() {
      if (videoLoading) {
        videoLoading.clear();
        videoLoading = null;
      }
      this.$toast("视频加载失败");
    },
    getAdContentDetails() {
      let loading = this.$toast.loading({
        message: "加载中",
        duration: 0
      });
      $http
        .get("plugin.new-media-advertising.frontend.media-advertisingt.advertisingt-info", {
          advertisingt_id: this.adId
        })
        .then(res => {
          loading.clear();
          if (res.result === 0) {
            this.$toast(res.msg);
            return;
          }
          this.adContent = res.data;
          this.showAdContent = res.data;
          this.getVideoList();
        })
        .catch(() => {
          loading.clear();
        });
    },
    followAuthor() {
      if (this.showAdContent.is_attention) {
        this.unFollowAuthor();
        return;
      }
      let loading = this.$toast.loading({
        message: this.showAdContent.attention_name + "中",
        duration: 0
      });
      $http
        .post("plugin.new-media-advertising.frontend.media-advertisingt.attention", {
          advertisingt_id: this.showAdContent.id
        })
        .then(res => {
          loading.clear();
          if (res.result == 0) {
            this.$toast(res.msg);
            return;
          }
          if (res.data.is_reward) {
            this.attention.awardName = res.data.rewardName;
            this.attention.awardCount = res.data.rewardValue;
            this.attention.showAwardPopup = true;
          }
          this.$toast(this.showAdContent.attention_name + "成功");
          this.showAdContent.is_attention = true;
        });
    },
    unFollowAuthor() {
      let loading = this.$toast.loading({
        message: this.showAdContent.attention_name + "关注中",
        duration: 0
      });
      $http
        .post("plugin.new-media-advertising.frontend.media-advertisingt.cancel-attention", {
          advertisingt_member: this.showAdContent.member_id
        })
        .then(res => {
          loading.clear();
          if (res.result == 0) {
            this.$toast(res.msg);
            return;
          }
          this.$toast("取消成功");
          this.showAdContent.is_attention = false;
        });
    }
  },
  components: {
    VanImage,
    DFixedContainer,
    RewardButton,
    RewardPopup,
    ContentStatisticsBar,
    GoldenButton
  }
};
</script>

<style scoped>
#ADVideo {
  position: relative;
  height: calc(100vh - 2.5rem);
  background: black;
  overflow: hidden;
}

.video-swipe {
  position: absolute;
  top: 2.5rem;
  left: 0;
  z-index: 2;
  width: 100%;
  height: calc(100vh - 2.5rem);
}

.video {
  position: absolute;
  z-index: 0;
  left: 0;
  right: 0;
  top: 2.5rem;
  bottom: 0;
  margin: auto;
  width: 100%;
  height: calc(100vh - 2.5rem);
}

.view-ad_button {
  display: block;
  width: 12.8rem;
  height: 2.2rem;
  line-height: 2.2rem;
  color: white;
  text-align: center;
  font-size: 0.8rem;
  border-radius: 0.3rem;
  background: rgba(0, 0, 0, 0.3);
}

.view-ad_button:active {
  filter: brightness(95%);
}

.video-play-button {
  position: absolute;
  z-index: 9;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  height: 70px;
  font-size: 70px;
  color: rgba(255, 255, 255, 0.8);
}

.video-author {
  position: relative;
  height: 4rem;
  width: 3.44rem;
}

.video-author_avatar {
  border: 0.13rem solid #fff;
}

.video-author_follow {
  margin: 0 auto;
  width: 1.1rem;
  height: 1.1rem;
  line-height: 1.1rem;
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  text-align: center;
  border-radius: 50%;
  background-color: #ef3532;
  transform: translateY(-0.9rem);
}

.slidebar {
  display: inline-block;
  height: 22.5rem;
  text-align: center;
}

.slidebar-list {
  margin-top: 1.94rem;
  color: white;
  font-size: 0.75rem;
  line-height: 0.75rem;
}

.slidebar-item:not(:last-child) {
  margin-bottom: 1.38rem;
}

.slidebar-icon {
  margin-bottom: 0.56rem;
  font-size: 1.13rem;
  line-height: 1.13rem;
}

/* 奖励 */
.award-popup {
  width: 84%;
  height: 80%;
  text-align: center;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/new_media/award_popup_bg2.png");
  background-color: transparent;
  background-size: contain;
  background-position: top center;
  background-repeat: no-repeat;
}

.award-popup-content {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  padding: 0.94rem;
  width: 12.5rem;
  height: 14.06rem;
  color: white;
  font-size: 1.06rem;
  background-image: linear-gradient(0deg, #eb160a 0%, #f96822 100%);
  border-radius: 0.64rem;
  box-sizing: border-box;
}

.award-popup-decoration {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  width: 92%;
}

.award-popup h1 {
  margin-top: 2.48rem;
  line-height: 1.06rem;
}

.award-content {
  margin-top: 2.26rem;
  line-height: 1.06rem;
}

.award-content span {
  font-weight: bold;
  font-size: 1.88rem;
}

.award-confirm {
  margin: 2.32rem auto 0;
}
</style>
