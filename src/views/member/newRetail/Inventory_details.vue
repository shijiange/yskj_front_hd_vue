<!--  -->
<template>
  <div id="newRetail-Inventory_details">
    <c-title :hide="false" text="库存明细"></c-title>
    <div class="list-row" v-for="item in list" :key="item.id">
      <div class="list-col text-left">{{ item.state_name }}</div>
      <div class="list-col text-right" :class="{ 'red-color': Number(item.change_num) > 0 }">{{ Number(item.change_num) > 0 ? `+${item.change_num}` : item.change_num }}</div>
      <div class="list-col text-left text-time font-color">{{ item.created_at }}</div>
      <div class="list-col text-right text-time ">剩余: {{ item.stock_new }}</div>
    </div>
    <yz-blank :datas="list"></yz-blank>
  </div>
</template>

<script>
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
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
    this.getData();
  },

  components: { yzBlank },

  computed: {},

  mounted() {},

  methods: {
    getData() {
      $http
        .get("plugin.new-retail.frontend.index.getStockDetail", { goods_id: this.$route.params.gid, goods_option: this.$route.params.optionId }, "...")
        .then(response => {
          if (response.result === 1) {
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
        .catch(error => {
          console.log(error);
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
        let _url = "plugin.new-retail.frontend.index.getStockDetail";
        let _json = { goods_id: this.$route.params.gid, goods_option: this.$route.params.optionId };

        _json.page = that.page;
        $http
          .get(_url, _json, "加载中")
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
<style lang="scss" rel="stylesheet/scss" scoped>
#newRetail-Inventory_details {
  .list-row {
    width: 100%;
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    padding: 0.375rem 0.875rem;
    background: #fff;
    position: relative;

    .list-col {
      width: 50%;
      line-height: 1.375rem;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
    }

    .text-right {
      text-align: right;
    }

    .text-left {
      text-align: left;
    }

    .text-time {
      font-size: 10px;
    }

    .font-color {
      color: #999;
    }

    .red-color {
      color: #f14e4e;
    }

    &::after {
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
