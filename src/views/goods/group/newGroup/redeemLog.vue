<template>
  <div id="redeemLog">
    <c-title :hide="false" text="兑换明细"></c-title>
      <ul class="logbox">
        <li v-for="(item, index) in list" :key="index">
          <div class="lis">
            <div class="time">{{ item.created_at }}</div>
            <div class="total">兑换数量:{{ item.pearl }}</div>
          </div>
        </li>
      </ul>
  </div>
</template>
<script>
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      list: [],
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    init() {
      this.page = 1;
      this.total_page = 0;
    },
    getData() {
      $http
        .post("plugin.zhp-group-lottery.frontend.pearl.exchange-pearl-log", { activity_id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.list = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
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
          .get("plugin.zhp-group-lottery.frontend.pearl.exchange-pearl-log", { page: that.page, activity_id: this.$route.params.id }, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
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

<style lang="scss" scoped>
.logbox {
  background: #fff;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 1rem;

    .lis {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }
}
</style>
