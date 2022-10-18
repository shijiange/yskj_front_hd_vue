<template>
  <div class="knowledge_list">
    <c-title :hide="false" :text="'知识库搜索'"></c-title>
    <div class="search-box">
      <div class="search">
        <img :src="logo_url" style="width: 1.6rem; height: 1.6rem;" alt="">
        <van-search @search="search" shape="round" style="padding: 0 10px; width: 100%;" v-model="keyword" placeholder="请输入搜索关键词">
        </van-search>
      </div>
      <div class="keyWorkds-box van-ellipsis">推荐：<span @click="clickKeyword(key)" class="key" v-for="(key, ind) in keyWorkds" :key="ind">{{key}}<span v-if="ind < (keyWorkds.length - 1)">、</span></span></div>
    </div>
    <van-list :finished="finished" finished-text="没有更多了" @load="onLoad">
      <list :list="list"></list>
    </van-list>
  </div>
</template>


<script type="text/javascript">

export default {
  components: {
    list: () => import("./components/list.vue")
  },
  data() {
    return {
      keyword: "",
      list: [],
      logo_url: "",
      last_page: "",
      finished: false,
      loading: false,
      current_page: 1,
      keyWorkds: [],
    };
  },
  mounted() {
    this.init();
    this.keyword = this.$route.query.keyword || "";
  },
  methods: {
    init() {
      this.list = [];
      this.current_page = 1;
      this.finished = false;
      this.loading = false;
    },
    search() {
      this.init();
      this.onLoad();
    },
    clickKeyword(text) {
      this.keyword = text;
      this.search();
    },
    onLoad() {
      if (this.finished || this.loading) return;
      let keyword = this.keyword;
      this.loading = true;
      $http.get("plugin.message-base.frontend.article.index", { keyword, page: this.current_page }).then(res => {
        if (res.result == 1) {
          this.keyWorkds = res.data.keyword || this.keyWorkds;
          this.current_page += 1;
          let { data, logo, current_page, last_page } = res.data;
          this.logo_url = logo;
          let list = keyword == "" ? data : data.filter(r => {
            let str = eval(`/${keyword}/g`);
            let newstr = `<span style="color:#e44848;">${keyword}</span>`;
            r.article_name = r.article_name.replace(str, newstr);
            return r;
          });
          this.list = this.list.concat(list);
          if (current_page >= last_page) this.finished = true;
        }
        this.loading = false;
      });
    }
  },
};
</script>
<style lang="scss" scoped>
  .knowledge_list {
    width: 100%;
    min-height: 100vh;
    text-align: left;
    background-color: #eff0f1;

    .search-box {
      background-color: #fff;
      padding: 0.6rem 0.8rem;
    }

    .search {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 0.3rem;
    }

    .keyWorkds-box {
      font-size: 12px;

      .key {
        color: rgb(58, 117, 244);
      }
    }
  }

</style>
