<template>
  <div id="collection-goods">
      <van-list
        v-if="collectionList.length > 0"
        class="list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadMore"
      >
        <div class="tbs" v-for="(item, index) in collectionList" :key="index" v-if="item.goods">
          <div class="li2" v-if="item.goods.thumb"><img :src="item.goods.thumb" /></div>
          <div class="li2" v-if="!item.goods.thumb"><img src="../../../assets/images/img_default.png" /></div>
          <div class="li3">
            <div class="product-name">{{ item.goods.title | escapeTitle }}</div>
            <p class="product-price">
              {{ $i18n.t("money") }}
              <span v-if="item.vip_level_status && item.vip_level_status.status == 1" class="product-price-span">{{ item.vip_level_status.word }}</span>
              <span v-else>{{ item.goods.price }}</span>
            </p>
          </div>
        </div>
      </van-list>
      <van-empty v-else description="空空如也" style="background: #fff;"></van-empty>
  </div>
</template>

<script>
export default {
  data() {
    return {
      strUrl: "plugin.wechat-chat-sidebar.frontend.controller.customer.customer.favorite",
      getConfig: { client: "work", type: 17 }, //企业微信公共参数
      collectionList: [],
      json: {
        page: 1
      },
      loading: false,
      finished: false
    };
  },

  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      if (this.finished && this.loading) {
        return;
      }
      this.loading = true;
      try {
        let res = await $http.get(this.strUrl, { ...this.json, ...this.getConfig }, "loading");
        this.loading = false;
        if (res.result === 1) {
          if (this.json.page >= res.data.last_page || res.data.data.length < res.data.per_page) {
            this.finished = true;
          }
          this.collectionList = this.json.page > 1 ? this.collectionList.concat(res.data.data) : res.data.data;
          this.json.page = ++this.json.page;
        } else {
          this.finished = true;
          this.$toast(res.msg != "" ? res.msg : "暂无数据");
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    loadMore() {
      this.getData();
    }
  },

  components: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#collection-goods {
  .tbs {
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    padding: 0.5rem 0.875rem;

    .li2 {
      width: 4.375rem;
      height: 4.375rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }

    .li3 {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 4.375rem;
      text-align: left;
      margin-left: 0.625rem;
      box-sizing: border-box;

      .product-name {
        font-size: 13px;
        font-weight: bold;
        color: #333;
        overflow: hidden;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-align: left;
        line-height: 1.13rem;
      }

      .product-price {
        color: #f15353;
        text-align: left;
        margin: 0;
        font-size: 12px;

        .product-price-span {
          font-size: 0.75rem;
          background: #f15353;
          color: white;
          padding: 0.2rem 0.5rem;
          border-top-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      }
    }
  }

  .tbs::after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 50%;
    width: 92%;
    height: 1px;
    transform: translateX(-50%);
    background-color: #eff0f1;
  }
}
</style>
