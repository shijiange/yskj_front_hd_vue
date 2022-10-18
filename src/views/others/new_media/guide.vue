<template>
  <main>
    <c-title text="新媒体"></c-title>
    <van-search
      shape="round"
      placeholder="搜索广告"
      v-model="adTitle"
      @search="searchAd"
      @clear="searchAd"
    >
      <template #action>
        <div @click="searchAd">搜索</div>
      </template>
    </van-search>
    <div class="tabs" @click="switchTab">
      <div class="tab" :class="[currentShowTab == 1 ? 'tab-active' : '']" data-name="1">普通区</div>
      <div class="tab" :class="[currentShowTab == 2 ? 'tab-active' : '']" data-name="2">广告专区</div>
    </div>
    <section v-show="currentShowTab == 1">
      <ul class="categories" @click="swtichCategory">
        <li
          class="category-item"
          :class="{ 'category-item_active': currentShowCategory == category.value }"
          v-for="(category, categoryIndex) in categories"
          :key="categoryIndex"
          :data-value="category.value"
        >{{ category.text }}</li>
      </ul>
    </section>
    <section>
      <van-list
        class="ad-articles"
        @load="getAdContents"
        :finished="contentLoadFinished"
        v-model="contentLoading"
      >
        <ad-article-item
          class="ad-article-item"
          v-for="(contentItem, index) in contents"
          :key="index"
          :data="contentItem"
          @click="routeToArticleDetails(contentItem)"
          :immediate-check="false"
        ></ad-article-item>
      </van-list>
      <LiveTabList v-if="currentShowCategory == 5" v-show="currentShowTab == 1"></LiveTabList>
    </section>
    <shortcut-menu right="0.9rem" :navs="shortcutNavs"></shortcut-menu>
  </main>
</template>

<script>
import AdArticleItem from "./ScopedComponents/AdArticleItem";
import ShortcutMenu from "./ScopedComponents/ShortcutMenu";
import LiveTabList from "./ScopedComponents/LiveTabList";
export default {
  data() {
    return {
      adTitle: "",
      currentShowTab: 1,
      shortcutNavs: [
        {
          text: "我的",
          link: "newMediaMy",
          icon: "icon-fontclass-huiyuanzhongixn",
          hidden: false
        },
        {
          text: "发布",
          link: "newMediaPublish",
          query: { publish_type: 1 },
          icon: "icon-customform_add",
          hidden: false
        }
      ],
      contents: [],
      contentLoadFinished: false,
      contentLoading: false,
      contentLoadPages: 1,
      categories: [
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
        },
        {
          text: "直播",
          value: 5
        }
      ],
      currentShowCategory: 1
    };
  },
  created() {
    this.fun.setWXTitle("新媒体");
    // this.getAdContents();
  },
  methods: {
    searchAd() {
      this.contentLoadFinished = false;
      this.contentLoading = true;
      this.contents = [];
      this.contentLoadPages = 1;
      this.getAdContents();
    },
    switchTab({ target: { dataset } }) {
      if (dataset.name) {
        this.currentShowTab = Number(dataset.name);
        this.currentShowCategory = this.categories[0].value;
        this.contentLoadFinished = false;
        this.contentLoading = true;
        this.contents = [];
        this.contentLoadPages = 1;
        this.getAdContents();
      }
    },
    getAdContents() {
      if (this.currentShowCategory === 5 && this.currentShowTab == 1) {
        return;
      }
      let contentLoading = this.$toast.loading({
        message: "加载中",
        duration: 0,
        overlay: true
      });
      let requestParams = {
        advertisingt_type: this.currentShowTab,
        title: this.adTitle,
        page: this.contentLoadPages
      };
      if (this.currentShowTab === 1) {
        requestParams['genre'] = this.currentShowCategory;
        // if (this.currentShowCategory == 4) {
        //   requestParams['type'] = 1;
        // }
      }
      $http.get("plugin.new-media-advertising.frontend.media-advertisingt.get-list", requestParams).then(({ data: { is_release, list: { data: contents, last_page, current_page } } }) => {
        contentLoading.clear();
        this.contentLoading = false;
        contents.forEach(item => {
          item['page'] = this.contentLoadPages;
        });
        this.contentLoadPages++;
        if (last_page == current_page) {
          this.contentLoadFinished = true;
        }
        this.shortcutNavs[1]['hidden'] = !is_release;
        this.contents.push(...contents);
      }).catch(() => {
        contentLoading.clear();
        this.contentLoading = false;
      });
    },
    swtichCategory({ target: { dataset } }) {
      if (!dataset.value || dataset.value == this.currentShowCategory) return;
      this.currentShowCategory = Number(dataset.value);
      this.contentLoadFinished = false;
      if(this.currentShowCategory==5){
        this.contentLoading = false;
      }else{
        this.contentLoading = true;
      }
      this.contents = [];
      this.contentLoadPages = 1;
      this.getAdContents();
    },
    routeToArticleDetails(contentItem) {
      let query = {
        ad_id: contentItem.id
      };
      let route = "newMediaAdDetails";
      switch (Number(contentItem.genre)) {
      case 4:
        route = "newMediaAdVideo";
        query['page'] = contentItem.page;
        query['content_type'] = this.currentShowCategory;
        query['tab_type'] = this.currentShowTab;
        break;
      }
      this.$router.push(this.fun.getUrl(route, {}, query));
    }
  },
  watch: {
    currentShowCategory(newV) {
      if (newV == 5) {
        this.shortcutNavs[1]['hidden'] = true;
      } else {
        this.shortcutNavs[1]['hidden'] = false;
      }
      this.shortcutNavs[1]['query']['publish_type'] = newV;
    },
    currentShowTab(newV) {
      if (newV == 2) {
        this.shortcutNavs[1]['hidden'] = false;
        this.shortcutNavs[1]['query']['publish_type'] = 5;
      }
    },
    contentLoading(newV){
      if(newV){
        if(this.currentShowCategory==5){
          this.contentLoading=false;
        }
      }
    }
  },
  components: {
    AdArticleItem,
    ShortcutMenu,
    LiveTabList
  }
};
</script>

<style scoped>
@import url("./common.css");

/* 分类 */
.categories {
  display: flex;
  flex-wrap: nowrap;
  margin-top: 0.75rem;
  padding: 0 var(--newMediaMarginDistance) 0.25rem;
  width: 100%;
  overflow: auto hidden;
}

.categories::-webkit-scrollbar {
  height: 0.125rem;
  background-color: transparent;
}

.categories::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
}

.category-item {
  padding: 0.41rem 1.16rem;
  min-width: 3.875rem;
  color: #717171;
  font-size: 0.75rem;
  background-color: white;
  border-radius: 1rem;
}

.category-item_active {
  color: white;
  background-color: var(--newMediaPrimaryColor);
}

.category-item:not(:last-child) {
  margin-right: 0.94rem;
}

/* 内容项 */
.ad-articles {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0.75rem var(--newMediaMarginDistance) 0;
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