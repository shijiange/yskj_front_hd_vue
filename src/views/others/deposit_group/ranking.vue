<template>
  <scoped-page-container class="ranking" :themeColor="themeColor">
    <d-title>定金阶梯排行榜</d-title>
    <div class="member-header" v-if="member">
      <div class="member-avatar">
        <van-image
          :src="member.avatar_image"
          class="member-avatar-img"
          width="3.75rem"
          height="3.75rem"
          round
        ></van-image>
        <div class="member-rank">{{ member.rank_no }}</div>
      </div>
      <div class="van-ellipsis member-nickname">{{ member.nickname }}</div>
    </div>
    <ul class="statistics-grid" v-if="member">
      <li class="statistics-item">
        <div class="statistics-count">{{ member.buy_count }}人</div>邀请人数
      </li>
      <li class="statistics-item">
        <div class="statistics-count">￥{{ member.commission_sum }}</div>分销收益
      </li>
    </ul>
    <scoped-panel class="income-ranking">
      <div class="income-ranking-title" slot="title">
        <div class="income-ranking-title-main">收益排行榜</div>
        <ul class="income-ranking-list-header">
          <li class="income-ranking-list-heaer-item">排行</li>
          <li class="income-ranking-list-heaer-item">会员</li>
          <li class="income-ranking-list-heaer-item">收益</li>
        </ul>
        <div class="income-ranking-title-bg"></div>
      </div>
      <ul class="income-ranking-list">
        <li class="income-ranking-item" v-for="logItem in rankingList" :key="logItem.id">
          <div class="income-ranking-avatar">
            <img :src="logItem.has_one_members.avatar_image" />
            <span class="income-ranking-rank">{{ logItem.rank_no }}</span>
          </div>
          <span class="income-ranking-nickname van-ellipsis">{{ logItem.has_one_members.nickname }}</span>
          <span class="income-ranking-income-count van-ellipsis">累计收益￥{{ logItem.commission_sum }}</span>
          <div class="income-ranking-item-bg"></div>
        </li>
      </ul>
      <div
        class="income-ranking_view-more"
        @click="loadMoreRankingData"
        v-show="rankList.length>10&&rankingList.length<rankList.length"
      >
        查看更多
        <i class="iconfont icon-member-bottom"></i>
      </div>
      <div v-if="rankList.length==0" style="text-align: center; color: #999; font-size: 13px;">暂无记录~</div>
    </scoped-panel>
    <scoped-action-bar button-text="推广赚更多佣金" @clickButton="displaySharePoster"></scoped-action-bar>
    <scoped-poster-popup
      :image="poster.image"
      :show="poster.showPopup"
      :generating="poster.generating"
      :shareCommission="shareCommission"
    ></scoped-poster-popup>
  </scoped-page-container>
</template>

<script>
import { Image as VanImage, Toast } from "vant";
import DTitle from "@/components/other/common/dtitle";
import ScopedPageContainer from "./Components/ScopedPageContainer.vue";
import ScopedPanel from "./Components/ScopedPanel.vue";
import ScopedActionBar from "./Components/ScopedActionBar";
import ScopedPosterPopup from "./Components/ScopedPosterPopup";
export default {
  data() {
    return {
      activityId: null,
      member: null,
      themeColor: null,
      rankList: [],
      rankingList: [],
      showSharePoster: false,
      poster: {
        showPopup: false,
        generating: false,
        image: null
      },
      shareCommission: 0
    };
  },
  activated() {
    this.activityId = this.$route.query.activity_id;
    $http
      .get("plugin.deposit-ladder.frontend.index.rankList", {
        id: this.activityId
      })
      .then(({ msg, result, data }) => {
        if (result == 0) {
          Toast(msg);
          return;
        }
        const { member, rankList, theme_color, commission, share } = data;
        this.fun.wxShare("", {}, { title: share.share_title, description: share.share_desc, imgUrl: share.share_img_src });
        this.themeColor = theme_color;
        this.member = member;
        this.rankList = rankList;
        this.rankingList = rankList.slice(0, 10);
        this.shareCommission = commission;
      });
    this.fun.setWXTitle("定金阶梯排行榜");
  },
  methods: {
    loadMoreRankingData() {
      this.rankingList.push(...this.rankList.slice(this.rankingList.length, this.rankingList.length + 10));
    },
    displaySharePoster() {
      this.poster.generating = true;
      $http
        .get("plugin.deposit-ladder.frontend.index.poster", {
          id: this.activityId
        })
        .then(({ data: { poster }, msg, result }) => {
          if (result == 0) {
            Toast(msg);
            this.poster.generating = false;
            return;
          }
          this.poster.image = poster;
          this.poster.generating = false;
          this.poster.descriptionShow = true;
        })
        .catch(() => {
          this.poster.generating = false;
        });
    }
  },
  components: {
    DTitle,
    ScopedPageContainer,
    VanImage,
    ScopedPanel,
    ScopedActionBar,
    ScopedPosterPopup
  }
};
</script>

<style scoped>
.member-header {
  display: flex;
  align-items: center;
  padding: 0.94rem;
}

.member-avatar {
  position: relative;
}

.member-rank {
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  padding: 0.2rem 0.4rem;
  margin: 0 auto;
  color: white;
  font-size: 0.75rem;
  background-color: #f14e4e;
  border-radius: 1.25rem;
}

.member-avatar-img {
  border: 0.1875rem solid #fff;
}

.member-nickname {
  margin-left: 0.59rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
}

/* 统计 */
.statistics-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 0.565rem));
  justify-content: space-between;
  column-gap: 0.565rem;
  margin: 1.41rem 0.94rem 0.97rem;
  text-align: left;
}

.statistics-item {
  padding: 1.06rem 0.91rem;
  color: #333;
  font-size: 0.94rem;
  background-color: white;
  border-radius: 0.56rem;
}

.statistics-count {
  margin-bottom: 0.81rem;
  font-size: 1.25rem;
  color: #fec400;
  font-weight: bold;
}

.income-ranking {
  margin: 0 0.94rem;
}

.income-ranking-title-bg {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.3;
  height: 4.5rem;
  width: 100%;
  background: var(--page-main-color);
}

.income-ranking-title-main {
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--page-main-color);
  font-size: 1.13rem;
  font-weight: bold;
}

.income-ranking-list-header {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  margin: 0.75rem 0 0.32rem;
  font-size: 0.81rem;
  color: #333;
}

.income-ranking-list-heaer-item {
  flex-grow: 3;
  flex-shrink: 0;
  text-align: center;
}

.income-ranking-list-heaer-item:first-child {
  flex-grow: 0.4;
  width: 3.5625rem;
}

.income-ranking-list {
  margin-top: 1rem;
}

.income-ranking-item {
  display: flex;
  align-content: center;
  position: relative;
  margin-top: 0.75rem;
  padding: 0.31rem 0.59rem 0.34rem 0.66rem;
  border-radius: 0.31rem;
}

.income-ranking-item-bg {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-color: var(--page-main-color);
}

.income-ranking-item:nth-of-type(n + 4) {
  opacity: 1;
  background-color: #f5f5f5;
}

.income-ranking-avatar {
  position: relative;
  height: 3.5625rem;
}

.income-ranking-avatar img {
  padding: 0.5rem;
  width: 2.5625rem;
  height: 2.5625rem;
  background-image: url("../../../assets/images/deposit_group/deposit_group_ranking_fourth.png");
  background-position: 0.25rem 0;
  background-size: 3rem;
  border-radius: 50%;
  background-repeat: no-repeat;
  box-sizing: content-box;
}

.income-ranking-item:nth-child(1) .income-ranking-avatar img {
  background-image: url("../../../assets/images/deposit_group/deposit_group_ranking_first_bg.png");
}

.income-ranking-item:nth-child(2) .income-ranking-avatar img {
  background-image: url("../../../assets/images/deposit_group/deposit_group_ranking_second_bg.png");
}

.income-ranking-item:nth-child(3) .income-ranking-avatar img {
  background-image: url("../../../assets/images/deposit_group/deposit_group_ranking_third_bg.png");
}

.income-ranking-rank {
  position: absolute;
  bottom: 0.5625rem;
  right: 0;
  min-width: 1.25rem;
  height: 1.25rem;
  line-height: 1.25rem;
  text-align: center;
  color: white;
  font-size: 0.69rem;
  background-color: #f14e4e;
  border-radius: 50%;
}

.income-ranking-rank {
  flex-grow: 0.3;
  flex-shrink: 0;
}

.income-ranking-nickname,
.income-ranking-income-count {
  flex-grow: 3;
  line-height: 57px;
  text-align: center;
}

.income-ranking-nickname {
  padding: 0 0.47rem;
  width: 8.5rem;
  color: #ff8401;
  font-size: 0.94rem;
}

.income-ranking-income-count {
  font-size: 0.75rem;
  color: #f14e4e;
}

.income-ranking_view-more {
  padding-top: 0.75rem;
  color: #f14e4e;
  text-align: center;
  font-size: 0.8125rem;
}
</style>