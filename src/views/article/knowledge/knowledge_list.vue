<template>
  <div class="knowledge_search">
    <c-title :hide="false" :text="'知识库目录'"></c-title>
    <div class="search">
      <img :src="logo_url" style="width: 1.6rem; height: 1.6rem;" alt="">
      <van-search @click="linkto" :readonly="true" shape="round" style="padding: 0 10px; width: 100%;" placeholder="请输入搜索关键词" />
    </div>
    <div class="header-box">
      <div class="title">{{base.name}}</div>
      <div style="text-align: center;">
        <van-image round class="img" v-for="(img,i) in userList" :key="i" :src="img.avatar" />
      </div>
    </div>
    <collapse v-if="article_list && article_list.length>0" :base_id="this.$route.query.base_id" :list="article_list"></collapse>
    <div style="margin: 0 auto;" v-if="article_list.length <= 0">
      <van-empty description="暂无数据" />
    </div>
  </div>
</template>

<script>
import { Image as VanImage } from "vant";

export default {
  data() {
    return {
      article_list: [],
      base: {},
      logo_url: "",
      userList: [],
    };
  },
  components: {
    collapse: () => import("./components/index"),
    VanImage
  },
  activated() {
    this.userList = [];
    this.getdata();
  },
  methods: {
    linkto() {
      this.$router.push(this.fun.getUrl("knowledgeSearch", {}, {}));
    },
    getdata() {
      let base_id = this.$route.query.base_id;
      let {knowledge} = this.$store.state;
      if (knowledge.baseArticle&&knowledge.base_id==base_id) {
        let res = knowledge.baseArticle;
        this.logo_url = res.data.logo;
        this.article_list = res.data.article_list || [];
        this.article_list = this.article_list.filter(r => {
          return r.article_name != "";
        });
        this.base = res.data.base;
        if(res.data.manager_list) {
          this.userList.push(res.data.manager_list || {});
        }
        this.userList = this.userList.concat(res.data.member_list || []);
        return false;
      }
      $http.get("plugin.message-base.frontend.article.baseArticle", {
        base_id
      }).then(res => {
        this.logo_url = res.data.logo;
        this.article_list = res.data.article_list || [];
        this.article_list = this.article_list.filter(r => {
          return r.article_name != "";
        });
        this.base = res.data.base;
        if(res.data.manager_list) {
          this.userList.push(res.data.manager_list || {});
        }
        this.userList = this.userList.concat(res.data.member_list || []);
        this.$store.commit("setBaseArticle", {res,base_id});
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .knowledge_search {
    background-color: #eff0f1;
    text-align: left;
    width: 100%;
    min-height: 100vh;

    .search {
      width: 100%;
      padding: 0.6rem 0.8rem;
      display: flex;
      align-items: center;
      background-color: #fff;

      /deep/.van-search__content {
        border-radius: 15px;
      }
    }

    .header-box {
      margin: 0.6rem 0.8rem;
      border-radius: 5px;
      background-color: #fff;

      .title {
        font-size: 15px;
        text-align: center;
        padding: 1rem 0;
      }

      .img {
        margin-bottom: 1rem;
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }
</style>
