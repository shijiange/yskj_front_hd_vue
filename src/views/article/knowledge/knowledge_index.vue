<template>
  <div class="knowledge_index">
    <c-title :hide="false" :text="'知识库'"></c-title>
    <div class="search">
      <van-search shape="round" style="padding: 0;" :readonly="true" :placeholder="keyword" @click="link()" />
    </div>
    <van-swipe  class="my-swipe" :stop-propagation="false" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,i) in images" :key="i">
          <img :src="item.image_url" alt="" >
      </van-swipe-item>
    </van-swipe>
    <div style="padding-bottom: 15px;" v-if="list.data && list.data.length > 0">
      <div class="list-box">
        <div class="title">
          <div class="title-l"></div>
          <div class="title-text" style="display: flex; justify-content: space-between; width: 90%;">
            <span>推荐知识库</span><span style="font-weight: normal; color: #29ba9c;" @click.stop="linkWhole">查看更多></span></div>
        </div>
        <template v-for="item in list.data">
          <div class="recommend" @click="lintk(item.id)" :key="item.id">
            <van-image class="img" width="5.7rem" height="3.4rem" :src="item.image_url" />
            <div class="recommend_comotent">
              <div class="recom_tent_tit van-ellipsis">{{item.name}}</div>
              <div class="ptag">{{item.desc}}</div>
            </div>
          </div>
        </template>
      </div>
      <div class="list-box" v-if="new_list && new_list.length > 0">
        <div class="title">
          <div class="title-l"></div>
          <div class="title-text">最新文档</div>
        </div>
        <list :list="new_list" />
      </div>
      <div class="list-box" v-if="hot_list && hot_list.length > 0">
        <div class="title">
          <div class="title-l"></div>
          <div class="title-text">热门文档</div>
        </div>
        <list :list="hot_list" />
      </div>
    </div>
  </div>
</template>

<script>
import list from "./components/list.vue";
import { Image as VanImage } from "vant";
export default {
  components: {
    list,VanImage
  },
  data() {
    return {
      data: {},
      images:[],
      new_list: [],
      hot_list: [],
      list: [],
      keyword: "",
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    lintk(id) {
      this.$router.push(this.fun.getUrl("knowledgeList", {}, { base_id:id }));
    },
    link() {
      this.$router.push(this.fun.getUrl("knowledgeSearch"));
    },
    linkWhole() {
      this.$router.push(this.fun.getUrl("knowledgeWhole"));
    },
    getdata(){
      $http.get("plugin.message-base.frontend.base.firstPage", {
        show_type: 2
      },"loading").then(res => {
        if (res.result == 1) {
          let {new_list,hot_list,list,slide,keyword} = res.data;
          this.new_list = new_list;
          this.hot_list = hot_list;
          this.list = list;
          this.images = slide;
          this.keyword = keyword;
        }else {
          this.$toast(res.msg);
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
  .my-swipe {
    width: 100%;
    height: 160px;
    overflow: hidden;

    img {
      width: 100%;
      object-fit: contain;
    }
  }

  .el-input__inner:focus {
    outline: none;
  }

  .knowledge_index {
    min-height: 100vh;
    text-align: left;

    .search {
      background-color: #fff;
      padding: 0.6rem 0.8rem;
    }

    .list-box {
      .title {
        display: flex;
        align-items: center;
        margin-top: 10px;

        .title-l {
          width: 0.2rem;
          height: 0.9rem;
          background-color: #29ba9c;
          border-radius: 0.1rem;
          margin: 0 10px;
        }

        .title-text {
          color: #3f3f3f;
          font-weight: bold;
        }
      }

      .recommend {
        background-color: #fff;
        display: flex;
        padding: 0.5rem;
        border-radius: 5px;
        margin: 10px;

        .img {
          flex: 0 0 5.7rem;
        }

        .recommend_comotent {
          flex: 1;
          margin-left: 0.5rem;
          word-break: break-all;
          max-width: 71%;

          .recom_tent_tit {
            line-height: 24px;
            font-size: 14px;
            color: #303030;
          }

          .ptag {
            font-size: 11px;
            color: #838383;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            word-break: break-all;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>
