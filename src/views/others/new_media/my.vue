<template>
  <div id="newMediaMy" class="my">
    <c-title text="新媒体" style="position: relative; z-index: 999;"></c-title>
    <img class="head-img" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/new_media/my_head_bg.png" />
    <div class="page-main" v-if="memberInfo">
      <div class="user">
        <van-image class="user-avatar" :src="memberInfo.avatar" width="2.8rem" height="2.8rem" round fit="cover"></van-image>
        {{ memberInfo.nickname }}
      </div>
      <div class="flow">
        <div class="flow-value">
          我的流量:
          <span>{{ memberInfo.stream }}</span>
        </div>
        <ul class="flow-relative">
          <li class="flow-relative-item">
            <router-link :to="fun.getUrl('newMediaRechange')">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/new_media/recharge_flow.png" />
              <div>充值流量值</div>
            </router-link>
          </li>
          <li class="flow-relative-item">
            <router-link :to="fun.getUrl('newMediaExchange')">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/new_media/exchange_flow.png" />
              <div>兑换流量值</div>
            </router-link>
          </li>
          <li class="flow-relative-item">
            <router-link :to="fun.getUrl('newMediaPoints')">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/new_media/check_details.png" />
              <div>查看明细</div>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="tabs tabs_border" @click="switchTab">
        <div class="tab" :class="[currentShowTab == 1 ? 'tab-active' : '']" data-name="1">我看过的</div>
        <div class="tab" :class="[currentShowTab == 2 ? 'tab-active' : '']" data-name="2">我发布的</div>
      </div>
      <div class="statistics" v-show="currentShowTab == 2">
        <ul class="statistics-list">
          <li class="statistics-item">
            <div>{{ memberInfo.read_count }}</div>
            {{ myViewContentTypes.read_name }}人数
          </li>
          <li class="statistics-item">
            <div>{{ memberInfo.like_count }}</div>
            {{ myViewContentTypes.like_name }}人数
          </li>
          <li class="statistics-item">
            <div>{{ memberInfo.collect_count }}</div>
            {{ myViewContentTypes.favorites_name }}人数
          </li>
          <li class="statistics-item">
            <div>{{ memberInfo.comment_count }}</div>
            {{ myViewContentTypes.comment_name }}人数
          </li>
          <li class="statistics-item">
            <div>{{ memberInfo.share_count }}</div>
            {{ myViewContentTypes.share_name }}人数
          </li>
          <li class="statistics-item">
            <div>{{ memberInfo.attention_count }}</div>
            粉丝
          </li>
        </ul>
      </div>
      <div class="my-view" v-show="currentShowTab == 1">
        <ul class="record-type" @click="myViewSwtichType">
          <li
            class="record-type-item"
            :class="{ 'record-type-item_active': myViewCurrentSelectedTypeName == typeName }"
            v-for="(typeItem, typeName) in myView.liveTypesObj"
            :key="typeName"
            :data-name="typeName"
            :data-value="typeItem.value"
          >
            {{ typeItem.text }}
          </li>
          <li class="record-type-item" :class="{ 'record-type-item_active': myViewCurrentSelectedTypeName == 'live' }" data-name="live">直播</li>
        </ul>
        <div class="record-empty" hidden>Empty~</div>
        <van-list
          class="record-list ad-articles"
          @load="getMyContents"
          :finished="myView.pagination.finished"
          v-model="myView.pagination.loading"
          :immediate-check="false"
          v-show="myViewCurrentSelectedTypeName !== 'attention_name' && myViewCurrentSelectedTypeName !== 'live'"
        >
          <ad-article-item class="ad-article-item" v-for="(contentItem, index) in myView.contents" :key="index" :data="contentItem" @click="routeToArticleDetails(contentItem)"></ad-article-item>
        </van-list>

        <LiveList :id="1" :nameSet="memberInfo.name_set" v-if="myViewCurrentSelectedTypeName == 'live'"></LiveList>
        <van-list class="follow-list" v-show="myViewCurrentSelectedTypeName === 'attention_name'" @load="getFans" :finished="myView.fansPagination.finished" v-model="myView.fansPagination.loading">
          <fans-item v-for="fanItem in myView.fans" :key="fanItem" :data="fanItem"></fans-item>
        </van-list>
      </div>

      <div class="tabs" @click="switchSubTab" v-show="currentShowTab == 2">
        <div class="tab" :class="[currentShowSubTab === 0 ? 'tab-active' : '']" :data-name="0">广告审核</div>
        <div class="tab" :class="[currentShowSubTab === 1 ? 'tab-active' : '']" :data-name="1">普通区</div>
        <div class="tab" :class="[currentShowSubTab === 2 ? 'tab-active' : '']" :data-name="2">广告专区</div>
      </div>
      <div class="my-publish" v-show="currentShowTab == 2">
        <div class="my-publish_title">
          <span>{{ myPublishTitle }}</span>
          <van-popover v-model="showSubTypePopover" trigger="click" :actions="myPublish.contentTypes" placement="bottom-end" v-show="currentShowSubTab != 2" @select="myPublishSelectContentType">
            <template #reference>
              <span class="my-publish_sub-type">
                {{ myPublish.selectedContentType.text }}
                <i class="iconfont" :class="[showSubTypePopover ? 'icon-member-top' : 'icon-member-bottom']"></i>
              </span>
            </template>
          </van-popover>
        </div>

        <van-list class="content-list" @load="getMypublish" :finished="myPublish.pagination.finished" v-model="myPublish.pagination.loading">
          <div class="content-item" v-for="contentItem in myPublish.contents" :key="contentItem.id" @click="gotoDetails(contentItem)">
            <div class="content_cast-time" v-if="currentShowSubTab == 2">投放时间: {{ contentItem.start_time }} - {{ contentItem.end_time }}</div>
            <van-image :src="contentItem.cover_picture" width="5rem" height="5rem" radius="0.3rem" />
            <div class="content-info">
              <div class="content-title">
                <span class="content_review-status" :class="[contentItem.reviewStatusClassName]" v-if="currentShowSubTab === 0">{{ contentItem.reviewStatusString }}</span>
                {{ contentItem.title }}
              </div>
              <div class="content-type">{{ contentItem.typeString }}</div>
              <div class="content-flow" v-if="contentItem.type == 2">{{ contentItem.stream_all }}流量值/小时 时长{{ contentItem.duration }}</div>
            </div>
            <ul class="content-statistics" v-if="currentShowSubTab > 0">
              <li class="content-statistics-item">
                <i class="iconfont icon-massage_order"></i>
                {{ contentItem.read_count }}
              </li>
              <li class="content-statistics-item">
                <i class="iconfont icon-fontclass-dianzan"></i>
                {{ contentItem.like_count }}
              </li>
              <li class="content-statistics-item">
                <i class="iconfont icon-fontclass-pingfen"></i>
                {{ contentItem.favorites_count }}
              </li>
              <li class="content-statistics-item">
                <i class="iconfont icon-fontclass-pinglun"></i>
                {{ contentItem.comment_count }}
              </li>
              <li class="content-statistics-item">
                <i class="iconfont icon-share"></i>
                {{ contentItem.share_count }}
              </li>
            </ul>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import { Image as VanImage, Popover as VanPopover } from "vant";
import AdArticleItem from "./ScopedComponents/AdArticleItem";
import FansItem from "./ScopedComponents/FansItem";
import LiveList from "./ScopedComponents/LiveList";

function getContentReviewStatusString(status) {
  switch (status) {
    case 0:
      return "待审核";
    case 1:
      return "审核通过";
    case 2:
      return "审核驳回";
  }
}
function getContentReviewClassName(status) {
  switch (status) {
    case 0:
      return "wait";
    case 1:
      return "pass";
    case 2:
      return "reject";
  }
}
function getContentTypeString(type) {
  switch (type) {
    case 1:
      return "图文";
    case 2:
      return "文章";
    case 3:
      return "音频";
    case 4:
      return "视频";
  }
}
export default {
  data() {
    return {
      memberInfo: null,
      showSubTypePopover: false,
      currentShowTab: 1,
      currentShowSubTab: 0,
      myViewContentTypes: [],
      myViewCurrentSelectedTypeName: "read_name",
      myView: {
        contents: [],
        pagination: {
          finished: false,
          loading: false,
          pages: 1
        },
        fans: [],
        fansPagination: {
          finished: false,
          loading: false,
          pages: 1
        },
        liveTypesObj: {
          read_name: {
            text: "阅读记录",
            value: 3
          },
          like_name: {
            text: "点赞记录",
            value: 1
          },
          favorites_name: {
            text: "收藏记录",
            value: 1
          },
          comment_name: {
            text: "评论记录",
            value: 6
          },
          share_name: {
            text: "分享记录",
            value: 4
          },
          attention_name: {
            text: "关注记录",
            value: 2
          }
        },
        liveTypes: [],
        liveSelectedType: {
          text: ""
        },
        liveShowSelectType: false
      },
      myPublish: {
        contents: [],
        selectedContentType: {
          value: -1,
          text: "全部"
        },
        contentTypesObj: [
          {
            text: "全部",
            value: 0
          },
          {
            text: "图文",
            value: 1
          },
          {
            text: "视频",
            value: 4
          },
          {
            text: "音频",
            value: 3
          },
          {
            text: "文章",
            value: 2
          }
        ],
        contentTypes: [],
        pagination: {
          finished: false,
          loading: false,
          pages: 1
        }
      }
    };
  },
  mounted() {
    this.fun.setWXTitle("新媒体");
    let loading = this.$toast.loading({
      duration: 0
    });
    $http
      .get("plugin.new-media-advertising.frontend.member.my-behavior")
      .then(res => {
        loading.clear();

        if (res.result == 0) {
          this.$toast(res.msg);
          return;
        }

        this.memberInfo = res.data;

        for (const key in res.data.name_set) {
          if (this.myView.liveTypesObj[key]) {
            this.myView.liveTypesObj[key]["text"] = res.data.name_set[key] + "记录";
          }
        }
        this.myViewContentTypes = res.data.name_set;
        this.getMyViewRecords();
      })
      .catch(() => {
        loading.clear();
      });
  },
  methods: {
    gotoDetails(contentItem) {
      if (contentItem.is_open != 1) return this.$toast("广告已下架");
      let query = {
        ad_id: contentItem.id
      };
      let route = "newMediaAdDetails";
      switch (Number(contentItem.genre)) {
        case 4:
          route = "newMediaAdVideo";
          query["page"] = 1;
          query["content_type"] = this.currentShowCategory;
          query["tab_type"] = this.currentShowTab;
          break;
      }
      this.$router.push(this.fun.getUrl(route, {}, query));
    },
    switchTab({ target: { dataset } }) {
      if (dataset.name) {
        this.currentShowTab = Number(dataset.name);
        if (this.currentShowTab == 2 && this.myPublish.contents.length == 0) {
          this.getMypublish();
        }
      }
    },
    myViewSwtichType({ target: { dataset } }) {
      if (dataset.name) {
        this.myViewCurrentSelectedTypeName = dataset.name;
        if (dataset.name == "attention_name") {
          if (this.myView.fans.length == 0) {
            this.getFans();
          }
          return;
        }
        if (dataset.name == "live") {
          // if (this.myView.fans.length == 0) {
          //   this.getLives();
          // }
          return;
        }
        this.myView.pagination = {
          finished: false,
          loading: true,
          pages: 1
        };
        this.myView.contents = [];
        this.getMyViewRecords();
      }
    },
    getMyViewRecords() {
      let loadRecordLoading = this.$toast.loading({
        duration: 0
      });
      $http
        .get("plugin.new-media-advertising.frontend.member.get-my-behavior-list", {
          page: this.myView.pagination.pages,
          behavior_type: this.getBehaviorCode(this.myViewCurrentSelectedTypeName)
        })
        .then(({ data: { data, current_page, last_page }, result, msg }) => {
          this.myView.pagination.loading = true;
          loadRecordLoading.clear();
          if (result == 0) {
            this.$toast(msg);
            return;
          }
          this.myView.pagination.pages++;
          if (current_page == last_page) {
            this.myView.pagination.finished = true;
          }
          this.myView.contents.push(...data);
        })
        .catch(() => {
          loadRecordLoading.clear();
        });
    },
    getBehaviorCode(behaviorType) {
      return {
        favorites_name: 5,
        read_name: 3,
        like_name: 1,
        comment_name: 6,
        share_name: 4,
        attention_name: 2,
        reward_name: 7
      }[behaviorType];
    },
    getFans() {
      let getFansLoading = this.$toast.loading({
        duration: 0
      });
      $http
        .get("plugin.new-media-advertising.frontend.member.get-my-behavior-list", {
          page: this.myView.fansPagination.pages,
          behavior_type: 2
        })
        .then(({ data: { data, last_page, current_page }, result, msg }) => {
          getFansLoading.clear();
          this.myView.fansPagination.loading = false;
          this.myView.fansPagination.pages++;
          if (last_page == current_page) {
            this.myView.fansPagination.finished = true;
          }
          this.myView.fans.push(...data);
        })
        .catch(() => {
          getFansLoading.clear();
        });
    },
    myViewLiveSelectedType(e) {
      this.myView.liveSelectedType = e;
      this.myView.pagination = {
        finished: false,
        loading: true,
        pages: 1
      };
      this.myView.contents = [];
      this.getLives();
    },
    routeToArticleDetails(contentItem) {
      let query = {
        ad_id: contentItem.id
      };
      let route = "newMediaAdDetails";
      switch (Number(contentItem.genre)) {
        case 4:
          route = "newMediaAdVideo";
          query["page"] = 1;
          query["content_type"] = this.currentShowCategory;
          query["tab_type"] = this.currentShowTab;
          break;
      }
      this.$router.push(this.fun.getUrl(route, {}, query));
    },
    switchSubTab({ target: { dataset } }) {
      if (dataset.name !== undefined) {
        this.currentShowSubTab = Number(dataset.name);
        this.myPublish.selectedContentType = {
          value: -1,
          text: "全部"
        };
        this.reGetMyPublish();
      }
    },
    myPublishSelectContentType(e) {
      this.myPublish.selectedContentType = e;
      this.reGetMyPublish();
    },
    getMypublish() {
      let loading = this.$toast.loading({
        duration: 0
      });
      let query = {
        page: this.myPublish.pagination.pages,
        advertisingt_type: this.currentShowSubTab
      };
      if (this.myPublish.selectedContentType.value !== -1) {
        if (this.currentShowSubTab == 0) {
          query["check_type"] = this.myPublish.selectedContentType.value;
        }
        if (this.currentShowSubTab == 1) {
          query["genre"] = this.myPublish.selectedContentType.value;
        }
      }
      $http
        .get("plugin.new-media-advertising.frontend.media-advertisingt.get-advertisingt-list", query)
        .then(({ data: { data, current_page, last_page }, result, msg }) => {
          loading.clear();
          this.myPublish.pagination.loading = false;
          if (result == 0) {
            this.$toast(msg);
            return;
          }
          if (current_page == last_page) {
            this.myPublish.pagination.finished = true;
          }
          for (const dataItem of data) {
            dataItem["reviewStatusString"] = getContentReviewStatusString(dataItem.check_type);
            dataItem["reviewStatusClassName"] = getContentReviewClassName(dataItem.check_type);
            dataItem["typeString"] = getContentTypeString(dataItem.genre);
          }
          this.myPublish.contents.push(...data);
        })
        .catch(() => {
          loading.clear();
        });
    },
    reGetMyPublish() {
      this.myPublish.pagination = {
        finished: false,
        loading: true,
        pages: 1
      };
      this.myPublish.contents = [];
      this.getMypublish();
    },
    changeMethod(key) {
      if (key == 0) {
        this.myPublish.contentTypes = [
          {
            text: "全部",
            value: -1
          },
          {
            text: "待审核",
            value: 0
          },
          {
            text: "审核通过",
            value: 1
          },
          {
            text: "审核驳回",
            value: 2
          }
        ];
      } else if (key == 1) {
        this.myPublish.contentTypes = [
          {
            text: "全部",
            value: 0
          },
          {
            text: "图文",
            value: 1
          },
          {
            text: "视频",
            value: 4
          },
          {
            text: "音频",
            value: 3
          },
          {
            text: "文章",
            value: 2
          }
        ];
      } else {
        this.myPublish.contentTypes = [];
      }
    }
  },
  computed: {
    myPublishTitle() {
      switch (this.currentShowSubTab) {
        case 0:
          this.changeMethod(0);
          return "广告审核";
        case 1:
          this.changeMethod(1);
          return "普通区";
        case 2:
          this.changeMethod();
          return "广告专区";
      }
      return "";
    }
  },
  components: {
    AdArticleItem,
    FansItem,
    VanImage,
    VanPopover,
    LiveList
  }
};
</script>

<style>
#newMediaMy .living-box {
  margin: 0 !important;
}
</style>
<style scoped>
@import url("./common.css");

.my {
  position: relative;
}

.head-img {
  width: 100%;
  height: 10.88rem;
  object-fit: cover;
}

.page-main {
  position: absolute;
  z-index: 999;
  width: 100%;
  top: 5.44rem;
  padding-bottom: 6.25rem;
}

.user {
  display: flex;
  align-items: center;
  margin: 0 1.4rem;
  color: white;
  font-size: 1.14rem;
  text-align: left;
  word-break: break-all;
}

.user-avatar {
  flex-shrink: 0;
  margin-right: 0.6rem;
}

.flow {
  margin: 1.19rem 0.94rem 0;
  padding: 0.96rem;
  text-align: left;
  font-size: 0.94rem;
  color: #303030;
  background-color: white;
  border-radius: 0.64rem;
}

.flow-value span {
  color: #ef3532;
}

.flow-relative {
  display: flex;
  justify-content: space-around;
  margin-top: 1.03rem;
  text-align: center;
  font-size: 0.75rem;
  color: #747474;
}

.flow-relative-item a {
  display: block;
}

.flow-relative-item img {
  width: 2.7rem;
  height: 2.5rem;
}

.tabs {
  margin-top: 0.64rem;
}

.my-view,
.my-publish {
  padding: 0 0.94rem;
}

.contents-empty {
  min-height: calc(100vh - 21rem);
  background: white;
}

.record-type {
  display: flex;
  align-items: center;
  padding: 0.75rem 0 0;
  margin-bottom: 6px;
  width: 100%;
  line-height: 0.75rem;
  font-size: 0.75rem;
  overflow: auto hidden;
}

.record-type-item {
  flex-shrink: 0;
  padding: 0.4rem 0.5rem;
  margin-right: 0.53rem;
  min-width: 3.4rem;
  color: #717171;
  background-color: #f3f3f3;
  border-radius: 1rem;
}

.record-type-item_active {
  color: white;
  background-color: var(--newMediaPrimaryColor);
}

.record-empty {
  margin-top: 5.66rem;
  font-size: 0.8rem;
  color: #717171;
}

.record-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: 0.3125rem;
}

.statistics {
  padding: 0.78rem 0.94rem;
  background-color: white;
}

.statistics-list {
  display: grid;
  grid-template-columns: repeat(3, 33.3%);
  row-gap: 1.7rem;
  padding: 0.98rem;
  background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/new_media/my_statistics_bar_bg.png") #fd644b center;
  background-size: cover;
  border-radius: 0.64rem;
}

.statistics-item {
  position: relative;
  text-align: center;
  font-size: 0.8rem;
  color: white;
}

.statistics-item:nth-child(2)::before,
.statistics-item:nth-child(5)::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 1.56rem;
  width: 0.06rem;
  background: white;
}

.statistics-item:nth-child(2)::after,
.statistics-item:nth-child(5)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 1.56rem;
  width: 0.06rem;
  background: white;
}

.statistics-item span {
  padding-bottom: 0.72rem;
  font-size: 1.13rem;
}

.my-publish_title {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin: 0.9rem 0;
  font-size: 0.88rem;
  color: #484848;
}

.my-publish_sub-type {
  color: #404040;
  font-size: 0.75rem;
}

.content-list {
  text-align: left;
}

.content-item {
  margin-bottom: 0.63rem;
  padding: 0.56rem 0.5rem;
  background-color: white;
  border-radius: 0.3rem;
}

.content-info {
  display: inline-block;
  vertical-align: top;
  margin-left: 0.63rem;
  width: calc(100% - 5rem - 0.63rem);
  word-break: break-all;
}

.content_cast-time {
  margin-bottom: 0.56rem;
  font-size: 0.63rem;
  color: #aeaeae;
}

.content-title {
  margin-top: 0.1rem;
  line-height: 1.4rem;
  font-size: 0.8rem;
  color: #1e1e1e;
}

.content_review-status {
  margin-right: 0.38rem;
  padding: 0.18rem 0.44rem;
  line-height: 0.7rem;
  color: white;
  font-size: 0.7rem;
  border-radius: 0.13rem;
  background-color: #a1a1a1;
}

.content_review-status.reject {
  background-color: #a1a1a1;
}

.content_review-status.wait {
  background-color: #ff9d57;
}

.content_review-status.pass {
  background-color: #ee2e2b;
}

.content-type {
  display: inline-block;
  padding: 0.22rem 0.63rem;
  margin-top: 0.4rem;
  line-height: 0.63rem;
  font-size: 0.63rem;
  color: #7c7c7c;
  background-color: #eee;
  border-radius: 0.2rem;
}

.content-flow {
  margin-top: 0.5rem;
  font-size: 0.63rem;
  color: #ee2e2b;
}

.content-statistics {
  display: grid;
  grid-template-columns: repeat(5, calc(100% / 5));
  align-content: center;
  justify-content: space-between;
  row-gap: 0.44rem;
  margin-top: 0.44rem;
  font-size: 0.63rem;
  color: #4f4f4f;
  text-align: center;
}

.content-statistics i {
  padding-right: 0.1rem;
  font-size: 0.94rem;
  color: #979797;
}

/* 内容项 */
.ad-articles {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.ad-article-item {
  margin-bottom: 0.31rem;
  padding-bottom: 0.66rem;
  width: 49%;
  border-radius: 0.31rem;
  background-color: white;
  overflow: hidden;
}
</style>
