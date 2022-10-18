<template>
  <main id="ADDetails" :class="{ 'audio-page': pageType == 'audio' }" v-if="adContent">
    <c-title text="广告详情"></c-title>
    <div v-if="pageType == 'article'">
      <van-swipe>
        <van-swipe-item v-for="imageItem in adContent.images" :key="imageItem">
          <van-image :src="imageItem" width="100%" height="13.13rem" fit="cover"></van-image>
        </van-swipe-item>
      </van-swipe>

      <h1 class="content-title">{{ adContent.title }}</h1>
      <content-author-bar
        class="content-author"
        :avatar="adContent.avatar"
        :nickname="adContent.nickname"
        :self="Boolean(adContent.is_self)"
        @follow="followAuthor"
        :attention="adContent.is_attention"
        :attentionName="adContent.attention_name"
      >
        <reward-button slot="right" @click="showRewardPopup = true" :rewardName="adContent.reward_name"></reward-button>
      </content-author-bar>
      <div id="a_content" class="content" v-html="adContent.content"></div>
    </div>
    <audio-content-card class="content-audio" v-else :src="adContent.resources_url" :author="adContent" :title="adContent.title" @follow="followAuthor"></audio-content-card>
    <content-statistics-bar :data="adContent"></content-statistics-bar>
    <reward-button :fixed="true" right="0.88rem" bottom="5.94rem" @click="showRewardPopup = true" :rewardName="adContent.reward_name" v-if="pageType == 'audio'"></reward-button>
    <reward-popup
      :show="showRewardPopup"
      @close="showRewardPopup = false"
      :avatar="adContent.avatar"
      :nickname="adContent.nickname"
      :content-id="adContent.id"
      :rewardName="adContent.reward_name"
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
  </main>
</template>

<script>
import { Image as VanImage } from "vant";
import ContentAuthorBar from "./ScopedComponents/ContentAuthorBar";
import ContentStatisticsBar from "./ScopedComponents/ContentStatisticsBar";
import AudioContentCard from "./ScopedComponents/AudioContentCard";
import RewardButton from "./ScopedComponents/RewardButton";
import RewardPopup from "./ScopedComponents/RewardPopup";
import GoldenButton from "./ScopedComponents/GoldenButton";
export default {
  created() {
    this.fun.setWXTitle("广告详情");
    if (!this.$route.query.ad_id) {
      this.$toast("内容不存在");
      return;
    }
    this.adId = Number(this.$route.query.ad_id);
    this.getAdContentDetails();
  },
  data() {
    return {
      adId: null,
      adContent: null,
      pageType: "article",
      showRewardPopup: false,
      rewardType: [],
      attention: {
        showAwardPopup: false,
        awardCount: null,
        awardName: ""
      }
    };
  },
  methods: {
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
          // let shareUrl = location.href.replace(/mid=\d+/, "mid=" + window.localStorage.uid);
          // this.fun.wxShare(shareUrl, {}, {
          //   ad_id: this.adId
          // });
          if (res.result === 0) {
            this.$toast(res.msg);
            return;
          }
          switch (res.data.genre) {
            case 1:
            case 2:
              this.pageType = "article";
              break;
            case 3:
              this.pageType = "audio";
              break;
          }
          this.adContent = res.data;
        })
        .catch(() => {
          loading.clear();
        });
    },
    followAuthor() {
      if (this.adContent.is_attention) {
        this.unFollowAuthor();
        return;
      }
      let loading = this.$toast.loading({
        message: this.adContent.attention_name + "中",
        duration: 0
      });
      $http
        .post("plugin.new-media-advertising.frontend.media-advertisingt.attention", {
          advertisingt_id: this.adId
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
          this.$toast(this.adContent.attention_name + "成功");
          this.adContent.is_attention = true;
        });
    },
    unFollowAuthor() {
      let loading = this.$toast.loading({
        message: "取消" + this.adContent.attention_name + "中",
        duration: 0
      });
      $http
        .post("plugin.new-media-advertising.frontend.media-advertisingt.cancel-attention", {
          advertisingt_member: this.adContent.member_id
        })
        .then(res => {
          loading.clear();
          if (res.result == 0) {
            this.$toast(res.msg);
            return;
          }
          this.$toast("取消成功");
          this.adContent.is_attention = false;
        });
    }
  },
  components: {
    VanImage,
    ContentAuthorBar,
    ContentStatisticsBar,
    AudioContentCard,
    RewardButton,
    RewardPopup,
    GoldenButton
  }
};
</script>
<style scoped>
@import url("./common.css");

main {
  min-height: 100vh;
  background-color: white;
}

.audio-page {
  padding-top: 0.72rem;
  background-color: transparent;
}

.content-title {
  padding: 0.94rem 0.97rem 1.25rem;
  font-weight: bold;
  font-size: 1.25rem;
  color: #333;
  word-break: break-all;
  text-align: left;
}

.content-author {
  margin: 0 var(--newMediaMarginDistance);
}

.content {
  margin: 1rem var(--newMediaMarginDistance);
  line-height: 1.88rem;
  text-align: left;
  word-break: break-all;
  overflow-y: auto !important;
}

/* 音频 */
.content-audio {
  margin: 0 var(--newMediaMarginDistance);
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
