<!-- 我的奖品 -->
<template>
  <div id="my_prize">
    <c-title :hide="false" text="我的奖品"></c-title>
    <van-tabs v-model="activeName" @click="handleClick" sticky offset-top="40px" animated>
      <van-tab v-for="(items, ind) in titleArr" :key="ind" :title="items">
        <div class="ul" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <!-- 我的抽奖 -->
          <div class="li" v-for="(item, index) in dataList[ind].list" :key="index" @click.stop="gotoUrl('orderdetail', { order_id: item.order_id, orderType: 'luck-draw' })">
            <div class="top-box flex-style">
              <div>{{ item.created_at }}</div>
              <div class="color-text">{{ item.status_name }}</div>
            </div>
            <div class="good-box flex-style">
              <img :src="item.goods_thumb" alt="" class="good-img" />
              <div class="good-other flex-style">
                <div class="tt flex-style">
                  <div class="good-title">{{ item.goods_name }}</div>
                  <div class="num">x{{ item.goods_total }}</div>
                </div>
                <div class="tt flex-style">
                  <div class=""></div>
                  <div class="num">{{ $i18n.t("money") }}{{ item.goods_money }}</div>
                </div>
              </div>
            </div>
            <div class="order-btn">
              <div class="btn" v-if="item.status == 2 || item.status == 3" @click.stop="confirmBtn(item.order_id, 0)">查看物流</div>
              <div class="btn btn-bg" v-if="item.status == 2" @click.stop="confirmBtn(item.order_id, 1)">确认收货</div>
            </div>
          </div>
        </div>
        <yz-blank v-else text="暂无数据" :isBtn="false"></yz-blank>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { scrollMixin } from "utils/mixin";
import { Toast } from "vant";
import yzBlank from "components/ui_components/yz_blank";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: 0,
      dataList: [],
      titleArr: ["全部", "待发货", "待收货", "已完成"],
      isLoadMore: true
    };
  },

  activated() {
    this.dataList = [];
    this.setNewArr();
  },

  components: { yzBlank },

  computed: {},

  methods: {
    gotoUrl(_name, _params) {
      this.$router.push(this.fun.getUrl(_name, _params));
    },
    confirmBtn(order, status) {
      if (status == 0) {
        //查看物流
        this.$router.push(
          this.fun.getUrl("logistics", {
            id: order,
            fromGrab: 1,
            api: "plugin.luck-draw.frontend.index.express"
          })
        );
      } else {
        this.publicMessage(order, { api: "order.operation.receive" }, "确认收货");
      }
    },
    publicMessage(order, btn, text) {
      let _text = text || "";
      if (!btn.api) {
        return;
      }
      this.$dialog
        .confirm({ message: `确定${_text}?` })
        .then(() => {
          var that = this;
          let json = {
            order_id: order
          };
          let urls = btn.api || "";
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.dataList = [];
                that.setNewArr();
                that.$notify({
                  background: "#f0f9eb",
                  message: `${_text}成功`,
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    setNewArr() {
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      console.log("dataList:::", this.dataList);
      this.handleClick();
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }
      $http
        .post("plugin.luck-draw.frontend.index.myPrize", { state: this.activeName }, "")
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
        let _url = "plugin.luck-draw.frontend.index.myPrize";
        let _json = {
          state: this.activeName
        };

        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get(_url, _json, "加载中").then(
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
#my_prize {
  .flex-style {
    display: flex;
    justify-content: space-between;
  }

  .color-text {
    color: #f14e4e;
  }

  .ul {
    padding: 0.875rem;

    .li {
      padding: 0.75rem;
      background-color: #fff;
      border-radius: 10px;
      overflow: hidden;
      font-size: 10px;
      color: #666;
      margin-bottom: 0.75rem;

      .top-box {
        width: 100%;
        line-height: 1.5rem;
        padding-bottom: 0.5rem;
      }

      .good-box {
        .good-img {
          width: 3.125rem;
          height: 3.125rem;
          background-color: #666;
          border-radius: 0.125rem;
          margin: 0 0.75rem 0 0;
        }

        .good-other {
          flex: 1;
          flex-direction: column;

          .good-title {
            font-size: 14px;
            padding-right: 1rem;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }

      .order-btn {
        padding-top: 0.75rem;
        display: flex;
        flex-direction: row-reverse;

        .btn {
          padding: 0 0.75rem;
          height: 1.5rem;
          line-height: 1.5rem;
          border-radius: 0.75rem;
          border: solid 1px #b4b4b4;
          margin-left: 0.875rem;
        }

        .btn-bg {
          background: #f14e4e;
          border-color: #f14e4e;
          color: #fff;
        }
      }
    }
  }
}
</style>
