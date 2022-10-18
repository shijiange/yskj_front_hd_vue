<!-- 0.1元拼 group-work -->
<template>
  <div id="group-work-index">
    <c-title :hide="false" :text="pluginTitle"></c-title>
    <van-sticky>
      <div class="top-box">
        <van-search v-model="searchTitle" @search="search" placeholder="搜索活动" shape="round" />
        <div class="top-box-title" @click.stop="showExplain = true">活动说明</div>
      </div>
    </van-sticky>
    <van-swipe :autoplay="2000">
      <van-swipe-item v-for="(image, index) in banner" :key="index">
        <img class="swipe-img-style" v-lazy="image.image" @click="toUrl(image.url)" />
      </van-swipe-item>
    </van-swipe>
    <van-tabs v-model="activeName" @change="getTab" sticky offset-top="52" swipeable swipe-threshold="4" v-if="activeName !== null">
      <van-tab :title="item.title" v-for="(item, index) in category" :key="item.id">
        <template v-if="dataList[index]">
          <van-list v-model="loading" :finished="dataList[index].isFinished" finished-text="没有更多了" @load="getMore">
            <group-cell
              v-for="itemChild in dataList[index].list"
              :key="itemChild.id"
              :title="itemChild.title"
              :price="itemChild.specs_price"
              :thumb="itemChild.thumb"
              :total="itemChild.specs_person"
              :id="itemChild.id"
              v-on:click="gotoUrl(itemChild.id)"
            ></group-cell>
          </van-list>
        </template>
      </van-tab>
    </van-tabs>

    <van-popup v-model="showExplain" :style="{ width: ' 90%', height: '70%' }" closeable round>
      <div class="explain-box">
        <div class="explain-title">活动说明</div>
        <div class="explain-text" style="flex: 1;" v-html="explainData"></div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import groupCell from "./component/group-cell";
export default {
  data() {
    return {
      paramsId: null,
      pluginTitle: "",
      searchTitle: "",
      category: [],
      banner: [],
      showExplain: false,
      explainData: "",

      activeName: null,
      dataList: [],
      loading: false,
      isLoadMore: true
    };
  },

  activated() {},

  components: { groupCell },

  computed: {},

  created() {
    this.paramsId = this.$route.params.id ? this.$route.params.id : 0;
    this.getData(true);
  },

  methods: {
    search() {
      this.initList();
      this.getData(false);
    },
    getTab() {
      this.getData(false);
    },
    getData(tag) {
      if (!tag && this.dataList[this.activeName].list.length > 0) {
        return;
      }
      let category_id = (this.category[this.activeName] && this.category[this.activeName].id) || 0;
      if (tag) {
        category_id = this.paramsId; //后台可复制带id的链接进入，当前标签页显示对应的位置
      }
      this.loading = true;
      $http
        .get(
          "plugin.group-work.frontend.controllers.page.index",
          {
            "search[title]": this.searchTitle,
            "search[category_id]": category_id
          },
          "加载中"
        )
        .then(response => {
          this.loading = false;
          if (response.result === 1) {
            if (tag) {
              this.pluginTitle = response.data.costum_name;
              this.fun.setWXTitle(response.data.costum_name);
              this.banner = response.data.banner_list;
              this.explainData = response.data.explain;
              this.category.push({
                title: "全部",
                id: 0
              });
              this.category = [...this.category, ...response.data.category_list];
              this.initList();
            }

            if (response.data.page_list.last_page == 1) this.dataList[this.activeName].isFinished = true;
            this.dataList[this.activeName].list = response.data.page_list.data;
            this.dataList[this.activeName].total_page = response.data.page_list.last_page;
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid() },
              {
                title: response.data.share_title,
                imgUrl: response.data.share_thumb,
                description: response.data.share_description
              }
            );
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initList() {
      this.dataList = [];
      this.category.forEach((val, index) => {
        this.dataList.push({
          isFinished: false,
          page: 1,
          total_page: 0,
          list: []
        });
        if (val.id == this.paramsId) {
          this.activeName = index;
        }
      });
    },
    getMore() {
      if (!this.isLoadMore || this.dataList[this.activeName].isFinished) {
        return;
      }
      let index = this.activeName;
      this.isLoadMore = false;
      this.dataList[index].page += 1;
      $http
        .get(
          "plugin.group-work.frontend.controllers.page.index",
          {
            page: this.dataList[index].page,
            "search[title]": this.searchTitle,
            "search[category_id]": (this.category[index] && this.category[index].id) || 0
          },
          "加载中"
        )
        .then(response => {
          this.isLoadMore = true;
          if (response.result === 1) {
            if (response.data.page_list.current_page >= response.data.page_list.last_page) this.dataList[index].isFinished = true;
            this.dataList[index].list = this.dataList[index].list.concat(response.data.page_list.data);
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          this.isLoadMore = true;
          console.log(err);
        });
    },
    gotoUrl(id) {
      this.$router.push(this.fun.getUrl("groupWorkGood", { id: id }));
    },
    toUrl(_url) {
      if (_url) window.location.href = _url;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#group-work-index {
  .top-box {
    display: flex;
    align-items: center;
    background: #fff;

    .van-search {
      flex: 1;
    }

    .top-box-title {
      padding: 0 0.75rem;
      color: #666;
      font-size: 12px;
    }
  }

  .van-swipe {
    a {
      display: block;
      width: 100%;

      img {
        display: block;
      }
    }
  }

  .swipe-img-style {
    width: 100%;
    max-height: 50vh;
    object-fit: contain;
  }

  .explain-box {
    padding: 0 0.875rem 0.875rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .explain-title {
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      font-size: 18px;
    }

    .explain-text {
      overflow: scroll;
    }

    /deep/img {
      max-width: 100%;
    }
  }
}
</style>
