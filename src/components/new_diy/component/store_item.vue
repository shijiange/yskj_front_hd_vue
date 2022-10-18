<template>
  <div>
    <div class="store-list" :class="plugin_active ? 'member-article-list' : ''" @click="toRouter(items)" v-for="(items, i) in storeList" :key="i">
      <div class="item-top">
        <div class="left">
          <div class="image">
            <img v-lazy="items.thumb" alt="" />
          </div>
          <div class="category" v-if="items.has_one_category" @click.stop="toClassify(items.has_one_category.id)">
            {{ items.has_one_category.name }}
          </div>
          <div class="category" v-if="!items.has_one_category">
            暂无分类
          </div>
        </div>
        <div class="right">
          <div class="title">{{ items.store_name }}</div>
          <div class="sale">
            <div class="grade">
              <i class="iconfont icon-card_collect_b"></i>
              <span>{{ items.average_score }}分</span>
            </div>
            <div class="num" v-if="datas.discount_list.indexOf('1') > -1">已售{{ items.order_total }}单</div>
            <div class="num" v-if="datas.discount_list.indexOf('1') < 0"></div>
            <div class="distance" @click.stop="goToAdress(items)" v-if="items.distance">{{ items.distance }}{{ items.unit }} <i class="iconfont icon-all_daohang"></i></div>
          </div>
          <div class="discounts" v-if="items.address" style="color: #666;">
            <span v-if="items.address.city">{{ items.address.city }}</span>
            <span v-if="items.address.detailed_address">{{ items.address.detailed_address }}</span>
          </div>
          <div class="discounts">
            <div class="discounts-list" v-if="datas.discount_list.indexOf('4') > -1 && items.has_many_coupon && items.has_many_coupon.length > 0">
              <div class="type">优惠</div>
              <div class="con" v-for="(coupon, index) in items.has_many_coupon" :key="index" v-if="index <= 2">
                {{ coupon.name }}
              </div>
            </div>
            <!-- point_deduct_switch 积分抵扣 store_love.deduction 爱心值抵扣  -->
            <div class="discounts-list" v-if="datas.discount_list.indexOf('3') > -1 && (items.store_point.point_deduct_switch != 0 || items.store_love.deduction == 1)">
              <div class="type">{{ items.goods_show && items.goods_show.search_class_name ? items.goods_show.search_class_name : "抵扣" }}</div>
              <div class="con" v-if="items.store_love.deduction == 1 ? true : false">
                {{ items.store_love.deduction_proportion }}
              </div>
              <div class="con" :class="{ store_deduction_style: items.goods_show && items.goods_show.store_deduction_style }" v-if="items.store_point.point_deduct_switch == 0 ? false : true">
                {{ items.store_point.max_point_deduct }}
              </div>
              <div class="con store_cash_back_style" v-if="items.store_point.commission_deduct && items.goods_show.store_cash_back">
                {{ items.store_point.commission_deduct }}
              </div>
            </div>
            <div class="discounts-list" v-if="datas.discount_list.indexOf('2') > -1 && (items.store_point.point_switch != 0 || items.store_love.award == 1)">
              <div class="type">赠送</div>
              <div class="con" v-if="items.store_point.point_switch == 0 ? false : true">
                {{ items.store_point.point }}
              </div>
              <div class="con" v-if="items.store_love.award == 1 ? true : false">
                {{ items.store_love.award_proportion }}
              </div>
            </div>
          </div>
          <div class="label" :class="{ 'shadow-box': items.dispatchs && items.dispatchs.length >= 4 }">
            <div class="label-list" v-if="items.dispatchs">
              <div class="label-title" v-for="dispatch in items.dispatchs" :key="dispatch">
                {{ dispatch }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods" v-if="datas.show_goods && items.recommend_goods && items.recommend_goods.length > 0">
        <div class="goods-list">
          <div class="goods-one" v-for="(good, i) in items.recommend_goods" :key="i" @click.stop="toGood(good.goods_id)">
            <div class="goods-image">
              <img v-lazy="good.thumb" alt="" />
            </div>
            <div class="goods-title">{{ good.title }}</div>
            <div class="goods_content_show" v-if="good.goods_content_show && datas.content_list">
              <!-- 商品内容显示 #81889-->
              <template v-for="contentChild in good.goods_content_show">
                <div
                  style="font-size:10px;color:#666;"
                  :key="contentChild.key"
                  v-if="
                    (datas.content_list.indexOf('8') > -1 && contentChild.key == 'integral') ||
                      (datas.content_list.indexOf('9') > -1 && contentChild.key == 'love') ||
                      (datas.content_list.indexOf('10') > -1 && contentChild.key == 'store-integral-fees')
                  "
                >
                  {{ contentChild.name }}{{ contentChild.value }}%
                </div>
              </template>
            </div>

            <div class="price" v-if="fun.isTextEmpty(good.goods_show)">{{ $i18n.t("money") }}{{ good.price }}</div>
            <div class="show_price_box" v-if="!fun.isTextEmpty(good.goods_show)">
              <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(item, i) in good.goods_show" :key="i">{{ item.name }}：{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["storeList", "datas", "plugin_active"],
  methods: {
    toClassify(id) {
      this.$router.push(this.fun.getUrl("o2oCategory", { id: id }));
    },
    // 跳转到店铺
    toRouter(item) {
      if (item.specify_show == 1) {
        this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: item.id, fromHome: 1 }));
      } else {
        this.$router.push(this.fun.getUrl("HomeSeller", { store_id: item.id, fromHome: 1 }));
      }
    },
    toGood(item) {
      if (item.id) {
        this.$router.push(this.fun.getUrl("goods", { id: item.id }));
      } else {
        this.$router.push(this.fun.getUrl("goods", { id: item }));
      }
    },
    //跳转地址
    goToAdress(items) {
      let point = this.fun.bd_decrypt(items.longitude, items.latitude);
      this.fun.goToWXAdress(point, items.store_name, items.address.detailed_address); //, items.address.city
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.store-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  padding: 10px;
  border-bottom: 2px solid #efefed;

  /* border-bottom: solid 1px #e6e6e6; */
  .item-top {
    display: flex;
    width: 100%;
  }

  .left {
    width: 93.75px;
    text-align: center;

    .image {
      width: 70px;
      height: 70px;

      /* border-radius: 50%; */
      margin: 0 10px;

      img {
        width: 100%;
        height: 100%;

        /* border-radius: 50%; */
      }
    }

    .category {
      margin-top: 10px;
      display: inline-block;

      /* background: #adadad; */

      /* color: #fff; */

      /* border-radius: 5px; */
      padding: 1px 5px;
    }
  }

  .right {
    width: 281.25px;

    .title {
      font-weight: 600;

      /* color: #000; */

      /* font-size: 14px; */
    }

    .sale {
      font-size: 12px;
      color: #666;
      display: flex;
      width: 100%;

      .grade {
        padding-right: 5px;

        i {
          color: #ffba00;
          font-size: 12px;
        }
      }

      .num {
        flex: 1;
      }

      .distance {
        text-align: right;
        width: 100px;
        padding-right: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        i {
          color: #ff2c29;
          font-size: 20px;
        }
      }
    }

    .discounts {
      margin-bottom: 5px;

      .discounts-list {
        display: flex;
        align-items: center;

        /* font-size: 12px; */

        /* justify-content: start; */
        overflow: hidden;

        .type {
          /* font-size: 12px; */

          /* color: #ff2c29; */
          font-weight: 600;
          padding-right: 10px;
        }

        .con {
          padding-right: 10px;

          /* color: #000; */
        }
      }
    }

    .label {
      font-size: 12px;

      .label-list {
        // flex-wrap: wrap;
        display: flex;
        align-items: center;
        width: 100%;
        overflow-x: scroll;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
        &::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }

        .label-title {
          margin-right: 10px;
          // margin-bottom: 5px;
          padding: 0 5px;
          flex-shrink: 0;

          /* background: #fff; */

          /* color: #666; */

          /* border: 1px solid #ff8400; */

          /* border-radius: 6px; */
        }
      }
    }
  }

  .goods {
    width: 100%;
    font-size: 12px;
    margin-top: 10px;
    box-sizing: border-box;

    .goods-list {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;
      overflow-x: scroll;

      .goods-one {
        margin-right: 10px;
        width: 90px;

        .goods-image {
          width: 90px;
          height: 90px;
          border-radius: 5px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
        }

        .goods-title {
          margin-top: 5px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .price {
          color: #ff2c29;
          font-weight: 600;
        }
      }

      /* 门店拼团 */
      .show_price_box {
        display: flex;
        flex-wrap: wrap;
      }

      .show_price {
        font-size: 11px;
        color: #ff2c29;
        border: solid #ff2c29 1px;
        padding: 1px 4px;
        margin-top: 5px;
      }

      .red_white {
        color: #fff;
        background: #ff2c29;
        margin-right: 5px;
      }

      .white_red {
        color: #ff2c29;
        background: #fff;
      }

      /* 门店拼团 */
    }
  }
}

.store-list.member-article-list {
  background: #fff;
  margin: 10px;
  border-radius: 5px;
  width: 94%;
}
</style>
