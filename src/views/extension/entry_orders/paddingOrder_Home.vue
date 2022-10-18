<!-- 挂单商品首页 -->
<template>
  <div id="PO_home">
    <div class="search">
      <div class="back"
           @click="goback"><i class="fa fa-angle-left"></i></div>
      <div class="search-box"
           @click="gotoSearch">
        <form @submit.prevent
              action="#">
          <input type="search"
                 placeholder="请输入内容"
                 v-model="inputs" />
        </form>
        <i class="iconfont icon-sousuo1"
           style="color: #ccc;"></i>
      </div>
      <div style="position: absolute; right: 1rem;">
        <i class="fa fa-th-large"
           v-show="view"
           @click="$store.commit('views')"></i>
        <i class="fa fa-th-list"
           v-show="!view"
           @click="$store.commit('views')"></i>
      </div>
    </div>
    <div class="Countdown">
      <!-- 活动信息 -->
      <h2 style="padding: 0 1.2rem 0.625rem; color: #ff9800;">{{!fun.isTextEmpty(activity)?activity.activity_name:'暂无活动'}}</h2>
      <h2 class="title-text">
        <p v-if="!fun.isTextEmpty(activity)">活动时间:{{activity.start_time}}至{{activity.end_time}}</p>
      </h2>
    </div>
    <!--商品列表 -->
    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <c-goodsList :goods="goodsInfo"
                   text="搜索结果"
                   class="osll"
                   :loading="loading"></c-goodsList>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import cGoodsList from "../../../components/goodsList";
import { scrollMixin } from "../../../utils/mixin";
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      isLoading:false,
      banner: [],
      activity: {},
      goodsInfo: [],
      loading: false,

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.into();
    this.getActivityInfo();
    this.getGoodsInfo();
  },
  computed: {
    ...mapState(["view"])
  },
  methods: {
    ...mapMutations(["views"]),
    into() {
      this.banner = [];
      this.goodsInfo = [];
      this.activity = {};
    },
    getActivityInfo() {
      // 获取挂单货单的信息
      let that = this;
      $http
        .get("plugin.pending-order.frontend.wholesale-area.index", {}, "")
        .then(
          function(response) {
            if (response.result == 1) {
              that.activity = response.data.activity;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    goback() {
      this.$router.go(-1);
    },
    getGoodsInfo() {
      // 获取挂单货单的信息
      let that = this;
      $http
        .get("plugin.pending-order.frontend.wholesale-area.goods-list", {}, "")
        .then(
          function(response) {
            if (response.result == 1) {
              that.isLoadMore = true;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.loading = false;
              that.goodsInfo.push(...response.data.data);
              console.log(that.goodsInfo);
              that.isLoading = false;
            } else {
              that.isLoading = false;
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        console.log("没有更多");
        that.loading = true;
        return;
      } else {
        that.page += 1;
        $http
          .get(
            "plugin.pending-order.frontend.wholesale-area.goods-list",
            { page: that.page },
            "加载中..."
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.goodsInfo = that.goodsInfo.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //下拉刷新
    loadTop() {
      this.goodsInfo = [];
      this.getGoodsInfo();
      // this.$refs.loadmore.onTopLoaded();
    },
    gotoSearch() {
      this.$router.push(this.fun.getUrl("search", {}, { fromPage: 1 }));
    }
  },
  components: {
    cGoodsList
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#PO_home {
  .search {
    height: 2.8125rem;
    line-height: 2.8125rem;
    position: relative;
    display: flex;
    overflow: hidden;
    background: #fff;
    border-bottom: 0.0625rem solid #f5f5f5;

    .el-button.el-button--default {
      float: left;
      width: 10%;
      border: none;
      padding-top: 1rem;
    }

    .el-input.el-input-group.el-input-group--append {
      float: left;
      width: 80%;
      margin-left: 2%;
      height: 2.8125rem;
    }

    .el-input-group__append .el-button.el-button--default {
      background: #f2f2f2;
      padding-top: 0.375rem;
      border-radius: 1.875rem;
      padding-right: 1.8125rem;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .el-input.el-input-group.el-input-group--append .el-input-group__append {
      background: #f5f5f5;
    }

    .el-col-1 {
      color: #666;
      font-size: 16px;
    }

    .el-input-group__append .el-button.el-button--default {
      background: #f2f2f2;
      padding-top: 0.375rem;
      border-radius: 1.875rem;
      padding-right: 1.8125rem;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .el-input.el-input-group.el-input-group--append .el-input-group__append {
      background: #f5f5f5;
    }

    .el-col-1 {
      width: 2.8125rem;
      position: absolute;
      right: 0;
      color: #666;
      font-size: 16px;
    }

    .back {
      width: 2.8125rem;

      i {
        line-height: 2.8125rem;
        font-size: 1.5rem;
      }
    }

    .search-box {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 75%;
      margin-top: 0.5rem;
      padding: 0 0.625rem;
      background-color: #f2f2f2;
      height: 1.75rem;
      line-height: 1.75rem;
      border-radius: 0.875rem;

      input {
        flex: 1;
        line-height: 1.75rem;
        border: none;
        color: #333;
      }

      i {
        position: absolute;
        right: 1rem;
        flex: 0 0 1.5rem;
      }
    }
  }

  .Countdown {
    padding: 0.875rem 0;
    background: #fff;

    .title-text p {
      display: block; /* 设置为块级元素会独占一行形成上下居中的效果 */
      position: relative; /* 定位横线（当横线的父元素） */
      color: #333; /* 居中文字的颜色 */
      text-align: center;
      font-weight: 400;
      padding: 0 5rem;
    }

    .title-text p::before,
    .title-text p::after {
      content: "";
      position: absolute; /* 定位背景横线的位置 */
      top: 50%;
      background: #ccced0; /* 背景横线颜色 */
      width: 15%; /* 单侧横线的长度 */
      height: 1px;
    }

    .title-text p::before {
      left: 2%; /* 调整背景横线的左右距离 */
    }

    .title-text p::after {
      right: 2%;
    }
  }
}
</style>