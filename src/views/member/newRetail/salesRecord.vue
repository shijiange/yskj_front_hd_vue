<!-- 销售记录 -->
<template>
  <div id="newRetail-salesRecord">
    <c-title :hide="false" text="销售记录"></c-title>
    <van-tabs v-model="activeName" sticky :offset-top="40" @click="getData">
      <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
        <ul class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <li class="li" v-for="(item, index) in dataList[ind].list" :key="index">
            <div class="li-left-main">
              <div class="li-left-child">{{ item.created_at }}</div>
              <div class="li-left-child" v-if="item.order_sn">订单编号：{{ item.order_sn }}</div>
              <div class="li-left-child">数量：{{ item.num }}</div>
              <div class="li-left-child">订单金额：{{ item.money }}</div>
            </div>
            <div class="buy-status">{{ item.state_type_name }}</div>
            <div class="li-btn" @click.stop="goLook(item.state_type, item.id)">查看 <i class="iconfont icon-member_right"></i></div>
          </li>
        </ul>
        <img v-if="dataList[ind] && fun.isTextEmpty(dataList[ind].list)" src="../../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem auto;" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: 0,
      dataList: [
        {
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        },
        {
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        }
      ],
      titleArr: ["代理套餐", "线上零售"],
      isLoadMore: true
    };
  },
  components: {},
  computed: {},
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
      }

      $http
        .post("plugin.new-retail.frontend.index.getSalesList", { page: 1, sales_type: that.activeName + 1 }, "")
        .then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.data);
          } else {
            Toast(response.msg);
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
        let _json = { sales_type: that.activeName + 1 };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get("plugin.new-retail.frontend.index.getSalesList", _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
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
    },
    goLook(state, id) {
      // state::1-未出售 2-出售中 3-已出售
      if (state == 1 || state == 2) {
        if (this.activeName == 0) {
          this.$router.push(this.fun.getUrl("newRetail_agencyPackage", { id: id }));
        }
        if (this.activeName == 1) {
          this.$router.push(this.fun.getUrl("newRetailRetailLink", { id: id }));
        }
      } else {
        this.$router.push(this.fun.getUrl("newRetailSalesRecordDetail", { id: id, mode: this.activeName }));
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#newRetail-salesRecord {
  .content {
    .li {
      text-align: left;
      padding: 0.5rem 0.875rem;
      display: flex;
      align-items: center;
      background: #fff;
      font-size: 15px;
      position: relative;

      .li-left-main {
        display: flex;
        flex-direction: column;
        flex: 1;
        color: #666;
        font-size: 13px;
      }

      .buy-status {
        margin: 0 0.875rem;
      }

      .li-btn {
        color: #f14e4e;
      }
    }

    .li::after {
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
