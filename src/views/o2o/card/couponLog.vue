<!-- 消费券记录列表 -->
<template>
  <div id="couponLog">
    <c-title :hide="false" text="使用记录"></c-title>
    <div class="log-list">
      <div class="list" v-for="item in list" :key="item.id">
        <div class="list-top flexjc">
          <div>{{ item.type == 1 ? `${pageConfig.name}会员赠送` : "购物抵扣" }}</div>
          <div class="size12 color-red">{{ item.type == 1 ? "+" : "-" }}{{ item.amount }}</div>
        </div>
        <div class="list-bottom flexjc">
          <div class="size12">{{ item.type == 1 && item.has_one_order ? "" : item.has_one_order.order_sn }}</div>
          <div class="size12 color-999">{{ item.created_at }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      pageConfig: {},
      list: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  activated() {
    this.getData();
  },

  components: {},

  computed: {},

  methods: {
    getData() {
      $http
        .get("plugin.universal-card.api.home.getConsumeCouponLog", {}, "")
        .then(res => {
          if (res.result == 1) {
            this.pageConfig = res.data.set;
            this.list = res.data.list.data;
            this.isLoadMore = true;
            this.total_page = res.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page += 1;
        $http.get("plugin.universal-card.api.home.getConsumeCouponLog", { page: this.page }).then(res => {
          console.log(res);
          this.isLoadMore = true;
          if (res.result === 1) {
            var nextPageData = res.data.list.data;
            this.list = this.list.concat(nextPageData);
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
            console.log(res.msg);
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#couponLog {
  .log-list {
    background: #fff;
    padding: 0 0.875rem;

    .list {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding: 0.5rem 0;
      height: 3.5rem;
      position: relative;

      .flexjc {
        display: flex;
        justify-content: space-between;
      }

      .size12 {
        font-size: 12px;
      }

      .color-red {
        color: #ff4949;
      }

      .color-999 {
        color: #999;
      }
    }

    .list::after {
      height: 1px;
      position: absolute;
      z-index: 0;
      bottom: 0;
      left: 0;
      content: "";
      width: 100%;
      background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
    }
  }
}
</style>
