<template>
  <div class="knowledge_list">
    <c-title :hide="false" :text="'全部知识库'"></c-title>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <template v-for="item in list">
        <div class="recommend" @click="lintk(item.id)" :key="item.id">
          <van-image class="img" width="5.7rem" height="3.4rem" :src="item.image_url" />
          <div class="recommend_comotent">
            <div class="recom_tent_tit van-ellipsis">{{item.name}}</div>
            <div class="ptag">{{item.desc}}</div>
          </div>
        </div>
      </template>
    </van-list>
  </div>
</template>


<script type="text/javascript">
import { Image as VanImage } from "vant";

export default {
  components: {
    VanImage
  },
  data() {
    return {
      list: [],
      logo_url: "",
      last_page: "",
      finished: false,
      loading: false,
      current_page: 1
    };
  },
  methods: {
    link() {
      this.$router.push(this.fun.getUrl("knowledgeSearch"));
    },
    lintk(id) {
      this.$router.push(this.fun.getUrl("knowledgeList", {}, { base_id:id }));
    },
    init() {
      this.list = [];
      this.current_page = 1;
      this.finished = false;
      this.loading = false;
    },
    onLoad() {
      if (this.finished ) return;
      $http.get("plugin.message-base.frontend.base.index", { page: this.current_page }).then(res => {
        if (res.result == 1) {
          this.current_page += 1;
          let { data, logo, current_page, last_page } = res.data;
          this.logo_url = logo;
          this.list = this.list.concat(data);
          this.loading = false;
          if (current_page >= last_page) this.finished = true;
        }

      });
    }
  },

  created() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
  .knowledge_list {
    width: 100%;
    min-height: 100vh;
    text-align: left;
    background-color: #eff0f1;
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
</style>
