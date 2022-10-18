<!--分类优化-->
<template>
  <div id="carcontent2">
    <div class="branch" v-if="list.goo && list.set.cat_adv_img">
      <a :href="list.set.cat_adv_url | href_filters"><img style="width: 100%;" :src="list.set.cat_adv_img"/></a>
    </div>
    <!-- 分类下拉框 -->
    <div class="catagoryBox">
      <van-collapse v-model="activeName">
        <van-collapse-item title="标题1" name="1">
          <dl>
            <dt
              v-for="(Secondary, index) in list"
              :key="index"
              :class="Secondary.id == secondaryId ? 'addClass' : 'removeClass'"
              @click.stop="chooseSecondary(Secondary)"
            >
              {{ Secondary.name }}
            </dt>
          </dl>
          <template v-if="list.set.cat_level == '3' && !fun.isTextEmpty(threeInfo)">
            <p class="threeTitle">三级分类</p>
            <dl>
              <dt
                v-for="(three, indexs) in threeInfo"
                :key="indexs"
                :class="three.id == threeId ? 'addClass' : 'removeClass'"
                @click="chooseThree(three.id)"
              >
                {{ three.name }}
              </dt>
            </dl>
          </template>
          <p v-if="fun.isTextEmpty(list)">暂无其他分类</p>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="goodsList" ref="foodsWrapper" style="overflow: hidden;">
      <div class="coverLayer" v-if="this.activeName == '1'" @click="change"></div>
      <div>
        <div class="goodWrapper">
          <ul class="list" v-for="(good, indexs) in list.goods_list" :key="indexs">
            <div class="img">
              <img :src="good.thumb" />
            </div>
            <li class="goods-info">
              <ul class="info-class">
                <li class="info_a" style="-webkit-box-orient: vertical;">
                  {{ good.title | escapeTitle }}
                </li>
                <li class="info_b">已售{{ good.show_sales }}{{ good.sku }}</li>
                <li class="info_c">
                  <span class="price" v-show="!good.has_option"
                    ><small>{{ $i18n.t('money') }}</small
                    >{{ good.price }}</span
                  >
                  <span class="price" v-show="good.has_option"
                    ><small>{{ $i18n.t('money') }}</small>
                    <small v-if="good.max_price != good.min_price">{{ good.min_price }}-{{ good.max_price }}</small>
                    <small v-if="good.max_price == good.min_price">{{ good.max_price }}</small>
                  </span>
                  <div class="select" v-if="good.has_option != 1">
                    <transition name="fade">
                      <i
                        v-if="goodsCarts[good.id]"
                        class="iconfont icon-life-game-sign"
                        @click.stop="numberLeft(good.id)"
                      ></i>
                    </transition>
                    <input
                      type="tel"
                      title="number"
                      v-if="goodsCarts[good.id] && !goodsCarts[good.id].option_str"
                      @click.stop
                      v-model.lazy="goodsCartsTotal[good.id].total"
                      @blur="changeCount(goodsCarts[good.id].id, goodsCartsTotal[good.id].total)"
                    />
                    <span v-if="goodsCarts[good.id] && goodsCarts[good.id].option_str" @click.stop>{{
                      goodsCartsTotal[good.id].total
                    }}</span>
                    <i @click.stop="numberRight(good.id)" class="iconfont icon-life-game-plus"></i>
                  </div>
                  <div class="select optionClass" v-if="good.has_option == 1">
                    <p @click.stop="addGood(good)">可选规格</p>
                    <i v-if="!fun.isTextEmpty(goodsCartsTotal[good.id])">{{ [good.id].total }}</i>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <div class="space"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Fun from '../fun';
import { Toast } from 'vant';
import BScroll from 'better-scroll';

export default {
  props: ['list'],
  data() {
    return {
      toi: Fun.getKey('i'),
      types: Fun.getTyep(),
      allLoaded: false,
      topStatus: '',
      advimg: window.localStorage.adv_img,
      // ...
      carts: [],
      cartIDs: [],
      goodsCarts: [], //购物车转为goods key的数组
      goodsCartsTotal: [],
      activeName: [], //分类折叠面板
      secondaryId: '', //二级分类id
      threeId: '', //三级分类ID
      threeInfo: [] //三级商品列表
    };
  },
  mounted() {},
  methods: {
    _initScroll() {
      if (!this.foodScroll) {
        this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true
        });
      } else {
        this.foodScroll.refresh();
      }
    },
    numberLeft(_id) {
      console.log(_id);
      this.goodsCartsTotal[_id].total = Number(this.goodsCartsTotal[_id].total) - 1;
      if (this.goodsCartsTotal[_id].total <= 0) {
        //小于等于0 清空该商品购物车数量
        this.destroyData(this.goodsCarts[_id].id);
        return;
      } else {
        this.changeCount(this.goodsCarts[_id].id, this.goodsCartsTotal[_id].total);
      }
    },
    numberRight(_id) {
      let that = this;
      if (!this.fun.isTextEmpty(this.goodsCartsTotal[_id])) {
        this.goodsCartsTotal[_id].total = Number(this.goodsCartsTotal[_id].total) + 1;
      }

      // if (this.goodsCartsTotal[_id].total >= 51) {
      //   Toast("该商品每周最多可购买50件");
      //   this.goodsCartsTotal[_id].total = 1;
      //   return;
      // }
      $http.get('member.member-cart.store', { goods_id: _id, total: 1 }, '').then(
        function(response) {
          if (response.result === 1) {
            this.$store.commit("setCartNum", response.data.cart_num);
            Toast(response.msg);
            that.updateData();
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    changeCount(_id, _num) {
      console.log(_id, _num);
      if (_num < 0) {
        this.destroyData(_id);
        return;
      }
      let that = this;
      let json = {
        id: _id,
        num: _num,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };

      $http.get('member.member-cart.updateNumV2', json, '').then(
        function(response) {
          if (response.result === 1) {
            Toast(response.msg);
          } else {
            Toast(response.msg);
            that.goodsCartsTotal[_id].total = 1;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    updateData() {
      //更新购物车数据
      $http.get('member.member-cart.index', {}).then(response => {
        if (response.result == 1) {
          this.getCart(response.data);
        } else {
          console.log(response.msg);
        }
      });
    },
    destroyData(_cid) {
      //清除该购物车商品id
      let that = this;
      $http.get('member.member-cart.destroy', { ids: _cid }).then(response => {
        if (response.result == 1) {
          that.updateData();
        } else {
          console.log(response.msg);
        }
      });
    },
    change() {
      //关闭分类折叠面板
      this.activeName = [];
    },
    chooseSecondary(sInfo) {
      this.secondaryId = sInfo.id;
      if (!this.fun.isTextEmpty(sInfo.has_many_children)) {
        this.threeInfo = [];
        this.threeInfo = sInfo.has_many_children;
        this.chooseThree(sInfo.has_many_children[0].id);
      } else {
        this.threeId = null;
        this.threeInfo = [];
        this.getData(sInfo.id);
      }
    },
    chooseThree(_tid) {
      this.threeId = _tid;
      this.getData(_tid);
    },
    getData(_id) {
      let that = this;
      let jsons = {
        category_id: _id,
        goods_page: 1
      };
      $http.get('goods.category.get-goods-list-by-category-id', jsons).then(response => {
        if (response.result == 1) {
          console.log(response.data.data);
          that.list.goods_list = response.data.data;
          setTimeout(() => {
            that.activeName = [];
          }, 1000);
        } else {
          console.log(response.msg);
        }
      });
    },
    /**
     * 如果传了商品，通过商品id获取购物车数量
     * @param goods
     */
    getCart(goods) {
      var that = this;
      that.carts = goods;
      that.goodsCarts = [];
      that.cartIDs = [];
      that.carts.forEach(item => {
        that.$set(that.goodsCarts, item.goods_id, item);
        if (goods && goods.id === item.goods_id) {
          goods.buyNum = item.total;
        }
        that.cartIDs.push(item.id);
      });
      that.goodsCartsTotal = that.calculateTotal(that.carts);
      that.$nextTick(() => {
        that._initScroll();
      });
    },
    //不同规格的同一商品求和
    calculateTotal(arr) {
      let newArr = [];
      let temp = {};
      let newArr2 = [];
      for (let i in arr) {
        let key = arr[i].goods_id;
        if (temp[key]) {
          let good_id = temp[key].goods_id;
          temp[key].goods_id = good_id;
          temp[key].total = temp[key].total + arr[i].total;
        } else {
          temp[key] = {};
          temp[key].goods_id = arr[i].goods_id;
          temp[key].total = arr[i].total;
        }
      }
      for (let k in temp) {
        newArr.push(temp[k]);
      }
      newArr.forEach(item => {
        this.$set(newArr2, item.goods_id, item);
      });
      return newArr2;
    }
  },
  watch: {
    list: function(newVal, oldVal) {
      if (!this.fun.isTextEmpty(newVal)) {
        this.secondaryId = newVal[0].id;
        if (newVal.set.cat_level == '3' && !this.fun.isTextEmpty(newVal[0].has_many_children)) {
          this.threeInfo = [];
          this.threeId = null;
          this.threeInfo = newVal[0].has_many_children;
          this.threeId = newVal[0].has_many_children[0].id;
        } else {
          this.threeInfo = [];
          this.threeId = null;
        }
        this.activeName = [];
        this.getCart(newVal.member_cart);
      } else {
        this.secondaryId = [];
        this.threeInfo = [];
        this.threeId = null;
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#carcontent2 {
  color: #686868;
  margin-bottom: 3.75rem;
  margin-top: 3%;
  display: flex;
  flex-direction: column;
  height: 100%;

  .branch {
    margin: 0 3%;
  }

  .catagoryBox {
    position: relative;
    height: 2.8125rem;
    z-index: 999;

    .threeTitle {
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: left;
    }

    dl {
      display: flex;
      flex-wrap: wrap;

      dt {
        height: 2.1875rem;
        line-height: 2.1875rem;
        padding: 0 1rem;
        border: solid 0.0625rem rgb(229, 229, 229);
        border-radius: 0.25rem;
        margin-right: 0.625rem;
        margin-bottom: 0.625rem;
      }

      .addClass {
        border: solid 0.0625rem rgb(255, 73, 73);
        color: #f15353;
      }
      // dt:first-of-type {
      //   margin-left: 0;
      // }
    }
  }

  .goodsList {
    background: #fff;
    position: relative;
    flex: 1;

    .coverLayer {
      //遮盖层
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      z-index: 99;
    }

    .goodWrapper {
      height: 100%;
      padding-left: 0.75rem;
    }

    .goodWrapper::after {
      display: block;
      background: transparent;
      content: ' ';
      width: 100%;
      height: 3.625rem;
    }

    .space {
      width: 100%;
      height: 3.625rem;
    }

    .list {
      display: flex;
      padding: 0.75rem 0.75rem 0.75rem 0;
      border-bottom: solid 0.0625rem #ebebeb;

      .img {
        width: 4rem;
        height: 4rem;
        background-color: #ccc;
        overflow: hidden;
        margin-right: 0.625rem;

        img {
          width: 100%;
        }
      }

      .goods-info {
        width: 12.0625rem;
        text-align: left;

        .info-class {
          .info_a {
            margin-bottom: 0.25rem;
            line-height: 1.25rem;
            font-size: 0.9375rem;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            color: #000;
          }

          .info_b {
            color: #8c8c8c;
            line-height: 1.25rem;
            // margin-bottom: 0.125rem;
          }

          .info_c {
            display: flex;
            justify-content: space-between;

            .price {
              color: #f15353;
              font-size: 14px;
              font-weight: bold;
              line-height: 1.5rem;

              small {
                font-size: 12px;
              }
            }

            .standard {
              button {
                height: 1.5rem;
                width: 2.5rem;
                background-color: #f15353;
                border: none;
                border-radius: 0.75rem;
                color: #fff;
              }
            }

            .select {
              display: flex;

              span {
                outline: none;
                border: none;
                display: inline-block;
                width: 1.5rem;
                height: 1.5rem;
                line-height: 1.5rem;
                font-size: 14px;
                text-align: center;
              }

              input {
                outline: none;
                border: none;
                display: inline-block;
                width: 1.5rem;
                height: 1.5rem;
                line-height: 1.5rem;
                font-size: 14px;
                text-align: center;
              }

              i:first-child {
                background-color: #ccc;
              }

              i:last-child {
                background-color: #f15353;
              }

              i {
                width: 1.5rem;
                height: 1.5rem;
                text-align: center;
                line-height: 1.5rem;
                border-radius: 0.75rem;
                color: #fff;
                font-size: 16px;
              }
            }

            .optionClass {
              i {
                width: 1rem;
                height: 1rem;
                line-height: 1rem;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
