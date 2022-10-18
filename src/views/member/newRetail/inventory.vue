<!-- 我的库存 -->
<template>
  <div id="newRetail-inventory">
    <c-title :hide="false" text="我的库存"></c-title>
    <van-sticky :offset-top="40">
      <van-search v-model="searchValue" show-action shape="round" placeholder="请输入商品名称" @search="getGood">
        <template #action>
          <div @click="getGood">搜索</div>
        </template>
      </van-search>
    </van-sticky>
    <div class="group-box">
      <van-checkbox-group v-model="selectGoods">
        <van-checkbox :name="good" :disabled="Number(good.goods_stock) < 1" checked-color="#f14e4e" v-for="good in goodsList" :key="good.goods_id">
          <div class="good-info">
            <img class="good-img" :src="good.goods_thumb" alt="" />
            <div class="goods-main">
              <div class="good-title">{{ good.goods_title }}</div>
              <div class="goods-sku" v-if="good.option_title">规格：{{ good.option_title }}</div>
              <div class="good-other" @click.stop>
                <div class="good-num">库存：{{ good.goods_stock }}</div>
                <van-stepper v-if="Number(good.goods_stock) > 0" integer v-model="good.goods_num" theme="round" button-size="22" min="1" :max="good.goods_stock" />
              </div>
            </div>
          </div>
          <div class="Inventory_details-box" @click.stop="gotoUrl('newRetailInventoryDetails', { gid: good.goods_id, optionId: good.goods_option })">库存明细</div>
        </van-checkbox>
      </van-checkbox-group>
    </div>

    <div class="bottom-btn-box set-pc-style">
      <div class="btn" style="background-color: #ff9500;" @click.stop="agentSalePopup()">零售</div>
      <div class="btn" @click.stop="freeSend()">自主提货</div>
    </div>

    <van-popup v-model="showPrice" position="bottom" closeable :style="{ height: '65%' }">
      <div class="good-price-popup">
        <div class="h2">价格设置</div>
        <div class="good-list">
          <div class="good-list-child" v-for="(g, i) in selectGoods" :key="g.goods_id">
            <div class="popup-goods-info">
              <img class="good-img" :src="g.goods_thumb" alt="" />
              <div class="goods-main">
                <div class="good-title">{{ g.goods_title }}</div>
                <div class="goods-sku">x {{ g.goods_num }}</div>
                <input type="number" v-model="g.goods_price" placeholder="请输入单价金额" />
              </div>
            </div>
            <div class="popup-del-good" @click.stop="delSelectGood(i)">
              <i class="iconfont icon-ht_operation_delete"></i>
            </div>
          </div>
        </div>
        <div class="btn" @click.stop="confirmAgentSale">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      searchValue: "",
      goodsList: [],
      value: 1,
      selectGoods: [],
      showPrice: false,

      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  // activated() {
  //   this.getGood();
  // },
  components: {},
  computed: {},
  mounted() {
    this.getGood();
  },
  methods: {
    gotoUrl(name, params = {}, query = {}) {
      this.$router.push(this.fun.getUrl(name, params, query));
    },
    getGood() {
      $http
        .get("plugin.new-retail.frontend.index.getStock", { goods_name: this.searchValue }, "")
        .then(response => {
          if (response.result === 1) {
            this.goodsList = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.goodsList.forEach(tem => {
              tem.goods_num = 1;
              tem.goods_price = null;
            });
            this.selectGoods = [];
          } else {
            Toast(response.msg);
            this.$router.go(-1);
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
        $http
          .get("plugin.new-retail.frontend.index.getStock", { goods_name: this.searchValue, page: that.page }, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              nextPageData.forEach(tem => {
                tem.goods_num = 1;
                tem.goods_price = null;
              });
              that.goodsList = that.goodsList.concat(nextPageData); //进行数组拼接
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
    agentSalePopup() {
      console.log("ssss", this.selectGoods);
      if (this.selectGoods.length < 1) {
        Toast("请选择商品");
        return;
      }
      this.showPrice = true;
    },
    delSelectGood(index) {
      this.selectGoods.splice(index, 1);
      if (this.selectGoods.length < 1) {
        Toast("请选择商品");
        this.showPrice = false;
      }
    },
    confirmAgentSale() {
      if (this.selectGoods.length < 1) {
        Toast("请选择商品");
        return;
      }
      for (let i = 0; i < this.selectGoods.length; i++) {
        if (!this.selectGoods[i].goods_price || this.selectGoods[i].goods_price == "") {
          Toast("请填写单价");
          return;
        }
      }
      $http
        .post("plugin.new-retail.frontend.index.onlineRetail", { goods: this.selectGoods }, "")
        .then(response => {
          if (response.result === 1) {
            this.$router.push(this.fun.getUrl("newRetailRetailLink", { id: response.data.id }));
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    freeSend() {
      if (this.selectGoods.length < 1) {
        Toast("请选择商品");
        return;
      }
      let _goods = [];
      this.selectGoods.forEach(item => {
        _goods.push({
          goods_id: item.goods_id,
          goods_option: item.goods_option,
          goods_num: item.goods_num
        });
      });
      this.$router.push(this.fun.getUrl("goodsorder", {}, { orderType: "newRetail", tag: "-2", goodsId: 0, optionsId: 0, total: 0, goods: JSON.stringify(_goods), retail_state: "2" }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#newRetail-inventory {
  .group-box {
    padding: 0 0.875rem 8rem;
    background: #fff;

    /deep/.van-checkbox__label {
      flex: 1;
    }

    .good-info {
      display: flex;
      text-align: left;

      .good-img {
        flex-shrink: 0;
        width: 6.25rem;
        height: 6.25rem;
        background-color: #cfcfcf;
        border-radius: 0.313rem;
        overflow: hidden;
        margin: 0.75rem 0.75rem 0.75rem 0;
      }

      .goods-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.75rem 0;

        .good-title {
          font-size: 15px;
          line-height: 24px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .good-other {
          display: flex;
          justify-content: space-between;

          .good-num {
            font-size: 15px;
          }
        }
      }
    }

    .Inventory_details-box {
      height: 1.5rem;
      line-height: 1.5rem;
      border: 1px solid #f14e4e;
      color: #f14e4e;
      display: table;
      padding: 0 0.875rem;
    }
  }

  .goods-sku {
    color: #999;
    font-size: 12px;
  }

  .bottom-btn-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2.844rem;
    line-height: 2.844rem;
    text-align: center;
    background-color: #f14e4e;
    font-size: 18px;
    color: #fff;
    display: flex;

    .btn {
      width: 50%;
    }
  }

  .good-price-popup {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .h2 {
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      font-size: 18px;
    }

    .good-list {
      flex: 1;
      width: 100%;
      overflow: scroll;
      display: flex;
      flex-direction: column;
      padding-bottom: 3.2rem;

      .good-list-child {
        padding: 0.5rem 0.75rem;
        display: flex;
        align-items: center;

        .popup-goods-info {
          flex: 1;
          display: flex;

          .good-img {
            width: 5.125rem;
            height: 5.125rem;
            border-radius: 0.25rem;
            margin: 0 0.5rem 0 0;
          }

          .goods-main {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: left;
            flex: 1;

            .good-title {
              font-size: 14px;
              line-height: 16px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }

            input {
              border: none;
              line-height: 1.75rem;
              border-bottom: 1px solid #f1f1f1;
            }
          }
        }

        .popup-del-good {
          padding: 0.75rem 0 0.75rem 0.75rem;
          color: #f14e4e;
        }
      }
    }

    .btn {
      width: 90%;
      height: 2.188rem;
      line-height: 2.188rem;
      text-align: center;
      color: #fff;
      background-color: #f14e4e;
      border-radius: 1.094rem;
      overflow: hidden;
      margin: 0.625rem auto;
    }
  }
}
</style>
