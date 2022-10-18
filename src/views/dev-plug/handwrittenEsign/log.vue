<!-- 手签协议 -->
<template>
  <div id="handwrittenEsign-log">
    <c-title :hide="false" text="手签协议"></c-title>
    <van-sticky>
      <van-search v-model="keyword" placeholder="请输入协议名称" shape="round" @search="onSearch"> </van-search>
    </van-sticky>
    <van-tabs v-model="activeName" @click="handleClick" sticky :ellipsis="false" swipeable offset-top="54">
      <van-tab :title="items.name" v-for="(items, ind) in titleArr" :key="ind">
        <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad()"> -->
        <div class="list" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <div class="list-child" v-for="(item, index) in dataList[ind].list" :key="index" @click="toUrl('handwrittenEsignIndex', { id: item.id })">
            <div class="list-top">
              <div class="title">{{ item.title }}</div>
              <div class="status">{{ item.sign_sattus == 0 ? "未签" : "已签" }}</div>
            </div>
            <div class="list-bottom">
              <div style="color: #f14e4e;font-size: 14px;margin-right: 1.75rem;">￥{{ item.amount }}</div>
              <div style="color: #7d7d7d;font-size: 12px;" v-if="Number(item.point) > 0">奖励{{ item.point }}积分</div>
            </div>
          </div>
        </div>
        <van-empty
          v-if="!$store.state.isloadding && fun.isTextEmpty(dataList[ind].list)"
          class="custom-image"
          image="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/energytank_blank@2x.png"
          description="暂无数据"
        />
        <!-- </van-list> -->
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      keyword: "",
      activeName: 0,
      dataList: [],
      titleArr: [],
      isLoadMore: true,

      loading: false
    };
  },

  activated() {},
  created() {
    this.init();
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    toUrl(name, params = {}, query = {}) {
      this.$router.push(this.fun.getUrl(name, params, query));
    },
    init() {
      this.dataList = [];
      this.titleArr = [
        { id: 0, name: "全部" },
        { id: 1, name: "未签署" },
        { id: 2, name: "已签署" }
      ];
      this.isLoadMore = true;
      this.setNewArr();
    },
    setNewArr() {
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          loading: false,
          finished: false,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      this.handleClick();
    },
    onLoad() {},
    onSearch() {
      this.dataList[this.activeName].list = [];
      this.dataList[this.activeName].page = 1;
      this.handleClick();
    },
    handleClick() {
      if (!this.fun.isTextEmpty(this.dataList[this.activeName].list)) {
        this.isLoadMore = this.dataList[this.activeName].isLoadMore;
        return;
      }
      $http
        .get("plugin.hand-sign-protocol.frontend.controllers.protocol.index", { page: 1, "search[title]": this.keyword, "search[status]": this.activeName }, ".")
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.dataList[this.activeName].isLoadMore = true;
            this.dataList[this.activeName].page = 1;
            this.dataList[this.activeName].total_page = response.data.list.last_page;
            this.$set(this.dataList[this.activeName], "list", response.data.list.data);
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {
          "search[title]": this.keyword,
          "search[status]": this.activeName
        };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get("plugin.hand-sign-protocol.frontend.controllers.protocol.index", _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.list.data;
              that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接
            } else {
              that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
              that.dataList[that.activeName].isLoadMore = false;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#handwrittenEsign-log {
  .list {
    padding: 0.875rem;
    .list-child {
      text-align: left;
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      border-radius: 0.5rem;
      overflow: hidden;
      margin-bottom: 0.75rem;
      padding: 0.875rem 0.9375rem;
      .list-top {
        display: flex;
        justify-content: space-between;
        .title {
          margin-right: 1.75rem;
          flex: 1;
          line-height: 1.125rem;
          height: 2.25rem;
          font-size: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .status {
          color: #f14e4e;
          font-size: 14px;
        }
      }
      .list-bottom {
        padding-top: 0.9375rem;
        display: flex;
      }
    }
  }
}
.custom-image {
  /deep/.van-empty__image {
    width: 100%;
    height: auto;
  }
}
</style>
