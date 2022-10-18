<!-- 库存明细 -->
<template>
  <div id="warehouse-farm-Inventory">
    <c-title :hide="false" text="圈仓"></c-title>
    <div class="top-box">
      <div style="font-size: 18px;padding-bottom:4px;font-weight: 600;">{{ stock != null ? stock : "---" }}</div>
      <div style="color: #666666;font-size: 12px;">商品总计数量</div>
    </div>

    <div class="page-title">库存明细</div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="list">
          <div class="list-item" v-for="(item, index) in list" :key="index">
            <div class="list-item-top">
              <div class="name">{{ item.remark }}</div>
              <div class="num">{{ item.nums }}</div>
            </div>
            <div class="list-item-bottom">
              <div class="time">{{ item.created_at }}</div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      stock: null,
      refreshing: false,
      loading: false,
      finished: false,
      page: 1
    };
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    onLoad() {
      this.getData();
    },
    getData() {
      $http
        .get("plugin.warehouse.frontend.controllers.stock.records", { page: this.page }, ".")
        .then(response => {
          this.refreshing = false;
          this.loading = false;
          if (response.result === 1) {
            this.list = this.list.concat(response.data.list.data);
            this.stock = response.data.stock;
            this.page = this.page + 1;
            if (response.data.list.current_page == response.data.list.last_page) {
              this.finished = true;
            }
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onRefresh() {
      this.loading = true;
      this.list = [];
      this.finished = false;
      this.page = 1;
      this.getData();
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#warehouse-farm-Inventory {
  .top-box {
    padding: 1.125rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .page-title {
    height: 2.25rem;
    line-height: 2.25rem;
    background: #f1f1f1;
    padding: 0 1rem;
    text-align: left;
    color: #828282;
  }
  .list {
    background: #fff;
    min-height: 20vh;
    .list-item {
      border-bottom: 1px solid #f1f1f1;
      display: flex;
      flex-direction: column;
      text-align: left;
      height: 3.5rem;
      padding: 0.625rem 1rem;
      justify-content: space-between;
      .list-item-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;

        .name {
          color: #3a3a3a;
          width: 60%;
          overflow: hidden; /*超出部分隐藏*/
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /*规定段落中的文本不进行换行 */
        }
        .num {
          color: #f14e4e;
          font-weight: 600;
        }
      }
      .list-item-bottom {
        .time {
          color: #666666;
          font-size: 10px;
        }
      }
      &:last-child {
        border: none;
      }
    }
  }
}
</style>
