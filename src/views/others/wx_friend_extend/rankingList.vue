<template>
  <div>
    <page-container class="ranking" :themeColor="bgColor">
      <d-title>好友裂变排行榜</d-title>
      <div class="member-header" v-if="details.member">
        <div class="member-avatar">
          <img :src="details.member.avatar_image" class="member-avatar-img"/>
        </div>
        <div class="header-left">
          <p class="member-nickname van-ellipsis">{{details.member.nickname}}</p>
          <p class="member-rank">{{details.rank== -1 ? '未上榜' : 'NO.'+details.rank}}</p>
        </div>
      </div>
      <ul class="statistics-box" >
        <div class="statistics-count">邀请人数：<span class="value">{{details.invite_count}}</span> 人</div>
        <div class="more" @click="goMoreRecord">查看<van-icon name="arrow" /></div>
      </ul>
      <panel class="income-ranking">
        <div class="income-ranking-title" slot="title">
          <div class="income-ranking-title-main">邀请排行榜</div>
          <ul class="income-ranking-list-header">
            <li class="income-ranking-list-heaer-item">排行</li>
            <li class="income-ranking-list-heaer-item">会员</li>
            <li class="income-ranking-list-heaer-item">累计邀请人数</li>
          </ul>
          <div class="income-ranking-title-bg"></div>
        </div>
        <ul class="income-ranking-list" v-if="listData.length > 0">
          <li class="income-ranking-item" v-for="(logItem, index) in listData" :key="index">
            <div class="income-ranking-avatar">
              <img :src="logItem.has_one_member?logItem.has_one_member.avatar_image:''">
              <span class="income-ranking-rank">{{index+1}}</span>
            </div>
            <span class="income-ranking-nickname van-ellipsis">{{logItem.has_one_member ? logItem.has_one_member.nickname : ''}}</span>
            <span class="income-ranking-income-count van-ellipsis">{{logItem.active_num}}人</span>
            <div class="income-ranking-item-bg"></div>
          </li>
          <li v-show="!finished">
            <div class="income-ranking_view-more" @click="getData">
              查看更多
              <i class="iconfont icon-member-bottom"></i>
            </div>
          </li>
        </ul>
        <van-empty v-else description="空空如也" />
      </panel>

      <generate-poster-dialog
        ref="posterDialog"
        :activityId="activityId"
        :autoPoster="autoPoster"
        :issetPoster="issetPoster"
        :memberList="details.staff_data"
        @generatePoster="issetPoster=true"
      ></generate-poster-dialog>

      <action-bar
        :activityId="activityId"
        :service="connectServiceMethods"
        :active="true"
        button-text="分享海报邀请好友"
        @clickButton="clickButton"
      ></action-bar>
    </page-container>
  </div>
</template>

<script>
import DTitle from "@/components/other/common/dtitle";
import PageContainer from "@/components/other/active_group/PageContainer";
import Panel from "@/components/other/active_group/Panel";
import ActionBar from "@/components/other/active_group/ActionBar";
import GeneratePosterDialog from "@/components/other/active_group/generatePosterDia";
export default {
  data () {
    return {
      activityId: '',
      bgColor: '',
      page: 1,
      loading: false,
      finished: false,
      details: {},
      listData: [],
      autoPoster: 0,
      issetPoster: 0,
      connectServiceMethods: {},
    };
  },

  activated () {
    this.initData();
    this.activityId = this.$route.query.id;
    this.getData();
  },
  methods: {
    getData () {
      if (this.finished) {
        return false;
      }
      $http.get("plugin.customer-increase.frontend.activity.activityMemberRank", {id: this.activityId, page: this.page}, "loading")
        .then(res => {
          if (res.result != 1) {
            return this.$toast(res.msg);
          }
          this.bgColor = res.data.bg_color;
          this.issetPoster = res.data.isset_poster;
          this.autoPoster = res.data.auto_poster;

          let {current_page, last_page, per_page, data} = res.data;
          if (current_page >= last_page || data.length < per_page) {
            this.finished = true;
          }
          this.details = res.data;
          this.listData = this.page > 1 ? this.listData.concat(data) : data;
          this.page++;

          //* 客服
          let cservice = res.data.chat_data;
          if (cservice) {
            this.$set(this.connectServiceMethods, "online", cservice.url);
            this.$set(this.connectServiceMethods, "tel", cservice.mobile);
            this.$set(this.connectServiceMethods, "qrcode", cservice.qrcode);
          }
        });
    },
    goMoreRecord () {
      this.$router.push(this.fun.getUrl('invitationRecord', {}, {id: this.activityId}));
    },

    // 海报
    clickButton (isActive) {
      if (!isActive) {
        // 活动关闭状态
        return false;
      }
      this.$refs["posterDialog"].showDialog();
    },

    initData () {
      this.activityId = '';
      this.page = 1;
      this.loading = false;
      this.finished = false;
      this.details = {};
      this.listData = [];
      this.autoPoster = 0;
      this.issetPoster = 0;
      this.connectServiceMethods = {};
    },
  },

  components: {
    DTitle,
    PageContainer,
    Panel,
    ActionBar,
    GeneratePosterDialog
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.member-header {
  display: flex;
  align-items: center;
  padding: 0.94rem;
  .member-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3.75rem;
    height:3.75rem;
    border-radius: 50%;
    overflow: hidden;
    border: 0.1875rem solid #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .header-left {
    margin-left: 0.5rem;
    text-align: left;
    .member-nickname {
      max-width: 10rem;
      font-size: 1.25rem;
      font-weight: bold;
      color: white;
    }
    .member-rank {
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.2rem 0.5rem;
      font-size: 0.75rem;
      color: #fff;
      background-color: #f14e4e;
      border-radius: 0.13rem;
    }

  }
}

/* 统计 */
.statistics-box {
  display: flex;
  margin: 1.41rem 0.94rem 0.97rem;
  padding: 1.26rem 0.91rem;
  color: #333;
  font-size: 0.94rem;
  background-color: white;
  border-radius: 0.56rem;
  text-align: left;

  .statistics-count {
    flex: 1;
    font-size: 0.94rem;
    .value {
      color: #ff2c29;
    }
  }
  .more {
    font-size: 0.85rem;
    color: #595959;
  }
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
  display: grid;
  grid-template-columns: 4rem 1fr 6rem;
  margin: 0.75rem 0 0.32rem;
  font-size: 0.81rem;
  font-weight: bold;
  color: #333;
}

.income-ranking-list-heaer-item {
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
  display: grid;
  grid-template-columns: 4rem 1fr 6rem;
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

.income-ranking-nickname,
.income-ranking-income-count {
  flex-grow: 3;
  line-height: 57px;
  text-align: center;
  font-size: 0.81rem;
}

.income-ranking-nickname {
  padding: 0 0.47rem;
  width: 8.5rem;
  color: #ff8401;
}

.income-ranking-income-count {
  color: #f14e4e;
}

.income-ranking_view-more {
  padding-top: 0.75rem;
  color: #f14e4e;
  text-align: center;
  font-size: 0.8125rem;
  cursor: default;
}
</style>