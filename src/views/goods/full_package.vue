<!-- 满额包邮 -->
<template>
  <div id="full_package">
    <c-title :hide="false" text="满额包邮"></c-title>
    <van-sticky>
      <div class="flex-main top-category">
        <div class="category-child" :class="{ 'active-class': activeCat == item.id }" v-for="item in categoryList" :key="item.id" @click="changeCategory(item.id)">{{ item.name }}</div>
      </div>
      <div class="flex-main">
        <div class="sort-child" :class="{ 'active-class': activeSort == item.value }" v-for="item in sortOption" :key="item.value" @click="changeSort(item.value)">{{ item.name }}</div>
      </div>
    </van-sticky>

    <template v-for="(item, index) in goodList">
      <goodCell :item="item" :index="index" :cartList="cartList" :key="item.id" @add="addCart" @show="showGoodDetail" @change="changeCart"></goodCell>
    </template>

    <div class="bottom-fixed-button set-pc-style">
      <template v-if="freight && freight > 0">
        还差<em style="color: #f15053;"> {{ freight }} </em>元可免运费
      </template>
      <template v-if="freight == 0"> 免运费 </template>
      <div class="button" @click.stop="openCartListPopup">
        去结算<em class="carts-num">{{ cartsNum }}</em>
      </div>
    </div>

    <!-- 购物车列表弹窗 -->
    <yz-cart-list v-model="showCarList" :cardata="cartList" class="carlist" v-on:blur="changeCarList" v-on:plus="changeCarList" v-on:minus="changeCarList">
      <!-- 底部购物车 -->
      <div class="bottom-car set-pc-styleLeft">
        <div class="car-box">
          <div class="car-num" @click.stop="showCarList = false">
            <div class="car-num-box">
              <i class="iconfont icon-all_buycar"></i>
              <div class="carnum-style">{{ cartsNum }}</div>
            </div>

            <!-- <div class="small-price">{{ $i18n.t("money") }}</div> -->
            <template v-if="freight && freight > 0">
              还差<em style="color: #f15053;"> {{ freight }} </em>元可免运费
            </template>
            <template v-if="freight == 0"> 免运费 </template>
          </div>
          <div class="car-add" @click.stop="toOrder">去结算</div>
        </div>
      </div>
    </yz-cart-list>
    <!-- 购物车结算配送方式冲突 -->
    <van-popup v-model="showChoose" round style="width: 20rem;">
      <div class="delivery-wapper">
        <div class="block" @click.stop>
          <div class="choose-title">
            您的购物车配送方式有冲突，请选择其中一种配送方式~
          </div>

          <div class="choose-content">
            <van-radio-group v-model="radioChoose">
              <div v-for="(item, index) in dispatch_types" :key="index" style="padding: 0.5rem 0;">
                <van-radio :name="index.toString()" checked-color="#ff4949">
                  <div class="radio-title">{{ item.name }}({{ item.member_carts.length }}件)</div>
                </van-radio>
                <ul class="radio-list">
                  <li class="radio-item" v-for="(goods, i) in item.member_carts" :key="i">
                    <p>{{ goods.title }}</p>
                    <p v-if="goods.option_title" style="font-size: 12px; color: #666;">规格：{{ goods.option_title }}</p>
                  </li>
                </ul>
              </div>
            </van-radio-group>
          </div>

          <div class="buttons">
            <div class="button-item">
              <div class="button-content" @click="showChoose = false">返回</div>
            </div>
            <div class="button-item">
              <div class="button-content red" @click="toOrder">去结算</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 商品详情页弹窗 -->
    <yzGoodsPopup v-model="showgp" :goodsInfo="goodinfo" v-on:showgoodspecs="showgoodspecs"></yzGoodsPopup>
    <!-- 商品规格弹窗 -->

    <!-- v-on:addGoods="addGoods"
        v-on:reduceGoods="reduceGoods" -->
    <yz-specs :carts="categoryList" :goodsInfo="goodinfo" v-model="popupSpecs" v-on:closeSpecsPopup="close_yz_specs_popup"></yz-specs>
  </div>
</template>

<script>
import { scrollMixin } from "../../utils/mixin"; //引入加载更多
import yzGoodsPopup from "components/ui_components/yz_goodsPopup";
import yzSpecs from "components/ui_components/yz_specs";
import yzCartList from "components/ui_components/yz_cartList";
import goodCell from "./components/good-cell";
export default {
  mixins: [scrollMixin],
  data() {
    return {
      cartsNum: 0, //购物车数量
      cartList: [],
      categoryList: [], //顶部分类导航
      activeCat: null,
      goodList: [],
      sortOption: [
        {
          value: "id",
          name: "综合排序"
        },
        {
          value: "price",
          name: "价格最低"
        },
        {
          value: "discount",
          name: "优惠力度"
        }
      ],
      activeSort: "id",
      activity_gid: 0,
      activity_index: 0,
      showgp: false,
      popupSpecs: false,
      goodinfo: {},
      freight: null,
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      orderCart: [], //记录下单页传递的购物车id
      showCarList: false,
      // 购物车配送方式冲突
      dispatch_types: [],
      showChoose: false,
      radioChoose: ""
    };
  },
  created() {
    if (this.$route.query.cart_id) {
      let cartStr = this.$route.query.cart_id.split(","); //注意!!  [].split(',')会返回[""],此时再.map[Number]会返回[0]，要处理
      if (cartStr[0] === "") {
        cartStr = [];
      }
      this.orderCart = cartStr.map(Number);
    }

    this.getCategory();
  },
  activated() {
    this.initData();
  },

  components: { goodCell, yzCartList, yzGoodsPopup, yzSpecs },

  computed: {},

  mounted() {},

  methods: {
    initData() {
      this.showgp = false;
      this.popupSpecs = false;
      this.showCarList = false;
      this.showChoose = false;
    },
    getCategory() {
      //获取分类列表
      $http
        .get("goods.postage-included-category.index", {}, ".")
        .then(res => {
          if (res.result == 1) {
            this.categoryList = res.data;
            if (this.categoryList && this.categoryList.length > 0) {
              this.activeCat = this.categoryList[0].id;
              this.changeSort();
            }
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeCategory(_id) {
      this.activeCat = _id; //记录当前选择的分类
      this.changeSort();
    },
    changeSort(_sort) {
      if (_sort) this.activeSort = _sort; //记录当前选择的排序方式
      let _json = {
        category_id: this.activeCat,
        sort: _sort || "id"
      };
      this.goodList = [];
      $http
        .get("goods.postage-included-category.goods", _json, ".")
        .then(res => {
          if (res.result == 1) {
            this.goodList = res.data.data; //商品列表
            this.isLoadMore = true;
            this.page = 1;
            this.total_page = res.data.last_page;
            this.getCartList();
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCartList() {
      //获取购物车列表，该列表继承商城购物车，只返回通过接口postageIncludedCategory.member-cart.store添加的购物车数据
      $http
        .get("postageIncludedCategory.member-cart.index", {}, ".")
        .then(res => {
          if (res.result == 1) {
            this.cartList = res.data;
            this.setGoodTotal();
            this.getFreight();
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setGoodTotal() {
      this.cartsNum = 0;
      // 计算设置当前商品列表中是否有已加入购物车的数据，有则显示购物车数量
      for (let index = 0; index < this.cartList.length; index++) {
        this.cartsNum += this.cartList[index].total;
        for (let j = 0; j < this.goodList.length; j++) {
          if (index == 0 && this.goodList[j].total) {
            this.goodList[j].total = 0; //初始化置0
          }
          if (this.cartList[index].goods_id == this.goodList[j].id) {
            let _total = 0;
            if (this.cartList[index].option_id == 0) {
              // 无规格
              _total = this.cartList[index].total; //设置商品的购物车数量
            } else {
              // 有规格
              _total = this.goodList[j].total || 0;
              _total += this.cartList[index].total;
            }
            this.$set(this.goodList[j], "total", _total); //设置商品的购物车数量
            this.goodList[j].card_id = this.cartList[index].id; //设置商品的购物车id
          }
        }
      }
    },
    addCart(e) {
      console.log(e);
      this.activity_index = e.index;
      if (e.isSpecs) {
        this.showGoodDetail(e, true); //规格商品，显示规格弹窗
        return;
      }
      this.addMemberCart({ id: e.id, total: "1", index: e.index });
    },
    changeCarList(e) {
      let _total = e.name == "plus" ? e.total + 1 : e.name == "minus" ? e.total - 1 : e.total;
      this.changeCart({ cartId: e.id, num: _total });
    },
    showGoodDetail(e, _spec) {
      if (this.activity_gid == e.id) {
        if (!_spec) {
          this.showgp = true;
        } else {
          this.popupSpecs = true;
        }
        return;
      }

      this.activity_gid = e.id;
      $http
        .get("plugin.overseas.frontend.goods.get-goods-page", { id: Number(e.id) }, ".")
        .then(res => {
          if (res.result == 1) {
            this.goodinfo = res.data.get_goods;
            if (res.data.get_goods.content) {
              let str = this.goodinfo.content.replace(/src=\"http:/gi, 'src="https:');
              this.goodinfo.content = str;
            } else {
              this.goodinfo.content = "暂无该商品详情";
            }
            setTimeout(() => {
              if (!_spec) {
                this.showgp = true;
              } else {
                this.popupSpecs = true;
              }
            }, 200);
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addMemberCart(_data) {
      //添加到购物车，当前的加入购物车数据会影响到商城购物车的数据；如果商城购物车有，则修改数量；没有则加入购物车
      // 但当前页面只显示在当前操作的商品的购物车数据，
      if (!_data.id) return;
      let _json = {
        goods_id: _data.id,
        total: _data.total || 1,
        option_id: _data.option_id || 0
      };
      $http
        .get("postageIncludedCategory.member-cart.store", _json, ".")
        .then(res => {
          if (res.result == 1) {
            this.popupSpecs = false;
            this.showgp = false;
            this.$toast(res.msg);
            this.$set(this.goodList[_data.index], "total", _data.total);
          } else {
            this.$toast(res.msg);
          }
          this.getCartList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeCart(e) {
      // 更新购物车数量
      console.log(e);
      if (!e.cartId) {
        return;
      }
      if (Number(e.num) == 0) {
        //删除购物车
        this.destroyCart(e.cartId);
        return;
      }
      $http
        .get("cart.list.updateNumV2", { id: e.cartId, num: e.num }, ".")
        .then(res => {
          if (res.result == 1) {
            this.popupSpecs = false;
            this.showgp = false;
            if (e.index) this.$set(this.goodList[e.index], "total", e.num);
          }
          this.$toast(res.msg);
          this.getCartList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    destroyCart(_id) {
      $http
        .get("cart.list.destroy", { ids: _id }, ".")
        .then(res => {
          this.$toast(res.msg);
          this.getCartList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    showgoodspecs() {
      this.popupSpecs = true;
    },
    close_yz_specs_popup(_optionsId, goodsCount, clicktype, id) {
      console.log("规格弹窗关闭了=====", _optionsId, goodsCount, clicktype, id);
      this.popupSpecs = false;
      if (clicktype == 1) {
        //点击确认按钮
        if (id) {
          // 有购物车记录
          this.updateCart(id, goodsCount);
        } else {
          // 新加入购物车
          this.addMemberCart({ id: this.activity_gid, total: goodsCount, option_id: _optionsId, index: this.activity_index });
        }
      }
    },
    getFreight() {
      // 计算运费，
      let _cart_ids = [];
      this.cartList.forEach(item => {
        _cart_ids.push(item.id);
      });

      let _cartArrConcat = _cart_ids.concat(this.orderCart);
      let _cartArr = new Set(_cartArrConcat);
      _cartArr = [..._cartArr];
      $http
        .get("postageIncludedCategory.cart-list.index", { cart_ids: _cartArr.join(",") })
        .then(res => {
          if (res.result == 1) {
            // postage_included_msg为空时，说明符合包邮条件了
            this.freight = res.data.postage_included_msg && res.data.postage_included_msg != "" ? Number(res.data.postage_included_msg) : 0;
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    toOrder() {
      this.initData();
      //当前是否是从下单页跳转过来的
      let _cart_ids = [];
      let _cartArr = [];
      if (this.showChoose && !this.radioChoose) {
        Toast("请先选择配送方式");
        return;
      }

      if (this.showChoose) {
        // 配送方式有冲突
        for (let i = 0; i < this.dispatch_types[this.radioChoose].member_carts.length; i++) {
          _cartArr.push(this.dispatch_types[this.radioChoose].member_carts[i].id);
        }
      } else {
        this.cartList.forEach(item => {
          _cart_ids.push(item.id);
        });
        let _cartArrConcat = _cart_ids.concat(this.orderCart);
        _cartArr = new Set(_cartArrConcat);
        _cartArr = [..._cartArr]; //去重
      }

      this.$nextTick(() => {
        this.$router.push(
          this.fun.getUrl(
            "goodsorder",
            {},
            {
              tag: "-1",
              cart_ids: _cartArr.join(",")
            }
          )
        );
      });
    },
    // // 检查购物车商品列表是否有配送方式冲突
    checkGoods() {
      let _cart_ids = [];
      this.cartList.forEach(item => {
        _cart_ids.push(item.id);
      });

      let _cartArrConcat = _cart_ids.concat(this.orderCart);
      let _cartArr = new Set(_cartArrConcat);
      _cartArr = [..._cartArr];
      $http.get("plugin.overseas.frontend.memberCart.checkout", { cart_ids: _cartArr.join(",") }, "操作中").then(
        response => {
          if (response.result == 1) {
            if (response.data.need_choose == 1) {
              this.dispatch_types = response.data.dispatch_types;
              this.showChoose = true;
            } else {
              this.toOrder();
            }
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getMoreData() {
      // 加载更多商品列表分页数据
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page += 1;
        let _json = {
          category_id: this.activeCat,
          sort: _sort || "id",
          page: this.page
        };
        $http.get("goods.postage-included-category.goods", _json).then(res => {
          console.log(res);
          this.isLoadMore = true;
          if (res.result === 1) {
            let nextPageData = res.data.data;
            this.goodList = this.goodList.concat(nextPageData);
            this.getCartList();
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        });
      }
    },
    openCartListPopup() {
      this.showCarList = true;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#full_package {
  background: #fff;
  padding-bottom: 6rem;

  .flex-main {
    display: flex;
    height: 2.8125rem;
    align-items: center;
    padding: 0 0.9375rem;
    overflow-x: scroll;
    position: relative;
    font-size: 12px;
    background: #fff;
  }

  .top-category {
    .category-child {
      height: 1.5rem;
      line-height: 1.5rem;
      background-color: #e4e4e4;
      border-radius: 0.125rem;
      flex-shrink: 0;
      padding: 0 0.875rem;
      margin-right: 0.875rem;
      color: #939393;
    }

    .active-class {
      background-color: #f15053;
      color: #fff;
    }
  }

  .flex-main::after {
    height: 1px;
    position: absolute;
    z-index: 0;
    bottom: 0;
    left: 0;
    content: "";
    width: 100%;
    background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
  }

  .sort-child {
    color: #848484;
    margin-right: 2rem;
  }

  .active-class {
    color: #f15053;
  }

  .bottom-fixed-button {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3.125rem;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 1rem;
    background-color: #fff;
    box-shadow: 1px 1px 14px 0 rgba(184, 184, 184, 0.52);

    .button {
      margin-left: 0.875rem;
      width: 90px;
      height: 32px;
      line-height: 32px;
      background-color: #f15053;
      border-radius: 16px;
      font-size: 14px;
      color: #fff;
      position: relative;
    }

    .carts-num {
      padding: 0 0.25rem;
      min-width: 1.25rem;
      height: 1.25rem;
      line-height: 1.25rem;
      font-size: 14px;
      position: absolute;
      top: -8px;
      right: -5px;
      background-color: #ff5d5c !important;
      color: #fff;
      border-radius: 0.875rem;
      box-shadow: 1px 1px 6px #b74444;
    }
  }
}

.bottom-car {
  position: fixed;
  width: 100%;
  height: 4.5rem;
  left: 0;
  bottom: -1px;
  display: flex;
  align-items: center;
  background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0), #fff 19%);

  .car-box {
    border: 1px solid #f14e4e;
    border-radius: 1.5rem;
    display: flex;
    align-items: center;
    height: 3rem;
    line-height: 3rem;
    width: 90%;
    margin: 0 auto;
    overflow: hidden;

    .car-num-box {
      position: relative;
      width: 3rem;
      text-align: center;

      .carnum-style {
        position: absolute;
        height: 1rem;
        right: 0;
        top: 5px;
        line-height: 1rem;
        background: #f14e4e;
        border-radius: 1rem;
        color: #fff;
        padding: 0 0.25rem;
        font-size: 0.75rem;
      }
    }

    .car-num {
      min-width: 50%;
      text-align: left;
      color: #f14e4e;
      display: flex;
      padding-right: 10px;

      i {
        font-size: 1.5rem;
      }

      .small-price {
        font-size: 0.75rem;
      }

      font-size: 14px;
    }

    .car-add {
      flex: 1;
      text-align: center;
      background-color: #f14e4e;
      color: #fff;
    }
  }

  .endstyle {
    background: #d8d8d8;
    border-color: #d8d8d8;
    color: #fff;
    text-align: center;
    font-size: 1.25rem;
    display: block;
  }
}

.carlist {
  .bottom-car {
    position: relative;
  }
}
</style>
