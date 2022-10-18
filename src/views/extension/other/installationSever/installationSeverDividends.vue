<!--  -->
<template>
  <div id="installationSeverDividends">
    <c-title :hide="false" text="分红记录"></c-title>
    <van-tabs v-model="activeName" @click="handleClick" sticky :ellipsis="false" swipeable>
      <van-tab :title="items.name" v-for="(items, ind) in titleArr" :key="ind">
        <ul class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <li v-for="(item, index) in dataList[ind].list" :key="index">
            <p>
              <span class="left">{{ item.order_sn || "" }}</span
              ><span class="red right">{{ item.amount || "" }}</span>
            </p>
            <p>
              <span class="time left">{{ item.created_at || "" }}</span
              ><span class="right">{{ item.price || "" }}</span>
            </p>
          </li>
        </ul>
        <yz-blank :datas="dataList[ind].list"></yz-blank>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
export default {
  data() {
    return {
      activeName: 0,
      dataList: [],
      titleArr: [],
      isLoadMore: true
    };
  },
  activated() {
    this.init();
  },
  created() {
    //
  },
  components: { yzBlank },
  computed: {},
  methods: {
    init() {
      this.dataList = [];
      this.titleArr = [
        {
          name: "预期佣金",
          code: "expect"
        },
        {
          name: "未结算佣金",
          code: "unsettle"
        },
        {
          name: "已结算佣金",
          code: "settle"
        },
        {
          name: "已提现佣金",
          code: "withdraw"
        },
        {
          name: "未提现佣金",
          code: "unwithdraw"
        },
        {
          name: "已失效佣金",
          code: "disabled"
        }
      ];
      this.isLoadMore = true;
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      this.activeName = this.$route.params.active;
      this.handleClick();
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }

      $http
        .post("plugin.live-install.frontend.worker.workerAmountList", { page: 1, amount_type: this.titleArr[that.activeName].code }, "")
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
            that.$dialog.alert({ message: response.msg });
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
        let _json = { amount_type: this.titleArr[that.activeName].code };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get("plugin.live-install.frontend.worker.workerAmountList", _json, "加载中").then(
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#installationSeverDividends {
  background: #fff;

  .red {
    color: #f0201f;
  }

  .time {
    color: #8e8e8e;
  }

  .content {
    font-size: 15px;
    padding-bottom: 1rem;

    li {
      padding: 1rem 1rem 0 1rem;
      line-height: 1rem;
      display: flex;
      flex-direction: column;

      p {
        display: flex;
        margin-bottom: 0.3rem;

        span {
          display: inline-block;
        }
      }

      .right {
        flex: 1;
        text-align: right;
      }
    }
  }

  .fixed-btn {
    position: fixed;
    right: 50%;
    transform: translateX(10rem);
    bottom: 3.875rem;
    background: #f14e4e;
    color: #fff;
    font-size: 0.75rem;
    width: 2.875rem;
    height: 2.875rem;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0.5rem;
    box-shadow: 0 0.094rem 0.219rem 0 rgba(131, 131, 131, 0.59);
  }

  .fh_dialog-style {
    text-align: left;

    .fh_dialog-style-main {
      padding: 0.875rem;
      line-height: 1.875rem;

      em {
        color: #f14e4e;
      }
    }
  }
}
</style>
