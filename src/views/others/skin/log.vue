<!-- 测肤记录 -->
<template>
  <div id="skin_log">
    <c-title :hide="false" :text="'测肤记录'"></c-title>
    <div class="member-info">
      <img :src="myInfo.avatar_image || require('../../../assets/images/loading.jpg')" alt="" class="avator" />
      <div class="name">{{ myInfo.nickname || "-" }}</div>
      <div class="num-box">
        <div>
          <div class="num">{{ myInfo.last || "-" }}</div>
          <div class="num-text">最近颜值评分</div>
        </div>
        <div>
          <div class="num">{{ myInfo.higher || "-" }}</div>
          <div class="num-text">颜值巅峰</div>
        </div>
      </div>
    </div>

    <div class="log-list">
      <div class="list-child" v-for="(item, index) in list" :key="item.id" @click.stop="gotoResult(item.id)">
        <img :src="item.check_img_src" alt="" class="avator" />
        <div class="child-main">
          <div class="time">{{ item.created_at }}</div>
          <div class="status">已完成</div>
        </div>
        <div class="del-icon" @click.stop="delLog(item.id, index)">
          <i class="iconfont icon-ht_operation_delete"></i>
        </div>
      </div>
      <p v-show="fun.isTextEmpty(list)" class="blank">暂无记录</p>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
export default {
  mixins: [scrollMixin],
  data() {
    return {
      myInfo: {},
      list: [],
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  components: { cTitle },

  computed: {},

  mounted() {
    this.getData();
  },

  methods: {
    delLog(_id, i) {
      $http.get("plugin.skin-check.api.skin-check.del-log", { report_id: _id }, "...").then(
        response => {
          if (response.result === 1) {
            Toast("删除成功");
            return this.list.splice(i, 1);
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    gotoResult(id) {
      this.$router.push(this.fun.getUrl("skinResult", { id: id }));
    },
    getData() {
      $http.get("plugin.skin-check.api.skin-check.check-log", {}, "...").then(
        response => {
          if (response.result === 1) {
            this.myInfo = response.data.member;
            this.myInfo.higher = response.data.higher.composite_score;
            this.myInfo.last = response.data.last.composite_score;
            this.list = response.data.log.data;
            this.isLoadMore = true;
            this.total_page = response.data.log.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get("plugin.skin-check.api.skin-check.check-log", { page: that.page }, "...")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.log.data;
              that.list = that.list.concat(nextPageData); //进行数组拼接
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#skin_log {
  padding: 0 1rem 70px;
  background: -moz-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #ffbec8), color-stop(25%, #fff));
  background: -webkit-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -o-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -ms-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: linear-gradient(to bottom, #ffbec8 0%, #fff 25%);
  min-height: calc(100vh - 50px);

  .member-info {
    margin-top: 2.5rem;
    background-color: #fff;
    box-shadow: 0 1px 3px 0 rgba(255, 190, 200, 0.43);
    border-radius: 0.625rem;

    .avator {
      width: 3.125rem;
      height: 3.125rem;
      overflow: hidden;
      border-radius: 50%;
      margin-top: -1.5625rem;
    }

    .name {
      color: #333;
      font-weight: bold;
    }

    .num-box {
      display: flex;
      justify-content: space-around;
      padding: 0.875rem 0;

      .num {
        font-size: 1.125rem;
        color: #fe5a73;
        font-weight: bold;
      }

      .num-text {
        color: #333;
      }
    }
  }

  .log-list {
    margin: 0.875rem 0;
    background-color: #fff;
    box-shadow: 0 1px 3px 0 rgba(255, 190, 200, 0.43);
    border-radius: 0.625rem;
    padding: 0 0.875rem;

    .list-child {
      display: flex;
      align-items: center;
      padding: 0.875rem 0;
      border-bottom: 1px solid #f2f2f2;

      .avator {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        flex-shrink: 0;
        margin: 0 0.5rem 0 0;
      }

      .child-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;

        .time {
          color: #333;
          font-weight: bold;
        }

        .status {
          font-size: 0.75rem;
          color: #666;
        }
      }

      .del-icon {
        padding: 0 0.5rem;

        .iconfont {
          font-size: 1.25rem;
          color: #fe5a73;
        }
      }
    }

    .list-child:last-child {
      border: none;
    }
  }

  .blank {
    padding: 2rem 0;
    text-align: center;
    color: #999;
  }
}
</style>
