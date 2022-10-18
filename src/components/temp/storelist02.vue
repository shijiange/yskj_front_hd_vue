<!-- 门店列表样式2 -->
<template>
  <div id="storelist02">
    <div class="list-02">
      <div class="list-top">
        <div class="store-img">
          <div class="img-mask" v-if="items.operating_state === 1"></div>
          <div class="img-text" v-if="items.operating_state === 1">商家休息中</div>
          <img class="store-logo" v-lazy="items.thumb" />
        </div>
        <div class="store-info">
          <div class="store-name text-ellipsis">{{ items.store_name }}</div>
          <div class="store-score">
            <div class="left">
              <van-rate v-model="items.average_score" size="10px" color="#ffd21e" readonly allow-half />
              <div class="score">{{ items.average_score }}分</div>
            </div>
            <div class="right">已售{{ items.order_total }}单</div>
          </div>
          <div class="store-address">
            <div class="left">
              <div class="category text-ellipsis" @click.stop="toClassify(items.has_one_category.id)">{{ items.has_one_category.name || "暂无分类" }}</div>
              <div class="line"></div>
              <div class="address text-ellipsis">
                <template v-if="items.address.city">{{ items.address.city }}</template>
                <template v-if="items.address.detailed_address">{{ items.address.detailed_address }}</template>
              </div>
            </div>

            <div class="right" @click.stop="goToAdress(items)">
              <template v-if="items.distance">{{ items.distance }}{{ items.unit }} </template><i class="iconfont icon-fontclass-daohang"></i>
            </div>
          </div>
          <div class="" :class="{ 'shadow-box': items.dispatchs && items.dispatchs.length > 4 }">
            <div class="dispatch-box" v-if="items.dispatchs">
              <div class="dispatch-item" v-for="dispatch in items.dispatchs" :key="dispatch">{{ dispatch }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="discount-box">
        <p class="discount-item" v-if="items.has_many_coupon && items.has_many_coupon.length > 0">
          <span class="red">优惠</span>
          <span style="margin-left: 0.5rem;" v-for="(coupon, index) in items.has_many_coupon" :key="index" v-if="index <= 2">{{ coupon.name }}</span>
        </p>
        <p class="discount-item" v-if="items.store_point.point_switch != 0 || items.store_love.award == 1">
          <span class="red">赠送</span>
          <span style="margin-left: 0.5rem;" v-if="items.store_point.point_switch == 0 ? false : true">{{ items.store_point.point }}</span>
          <span style="margin-left: 0.5rem;" v-if="items.store_love.award == 1 ? true : false">{{ items.store_love.award_proportion }}</span>
        </p>
        <p class="discount-item" v-if="items.store_point.point_deduct_switch != 0 || items.store_love.deduction == 1">
          <span class="red">{{ items.goods_show && items.goods_show.search_class_name ? items.goods_show.search_class_name : "抵扣" }}</span>
          <span style="margin-left: 0.5rem;" v-if="items.store_love.deduction == 1 ? true : false">{{ items.store_love.deduction_proportion }}</span>
          <span
            style="margin-left: 0.5rem;"
            :class="{ store_deduction_style: items.goods_show && items.goods_show.store_deduction_style }"
            v-if="items.store_point.point_deduct_switch == 0 ? false : true"
            >{{ items.store_point.max_point_deduct }}</span
          >
          <span style="margin-left: 0.5rem;" class="store_cash_back_style" v-if="items.store_point.commission_deduct && items.goods_show.store_cash_back">{{
            items.store_point.commission_deduct
          }}</span>
        </p>
        <p class="discount-item" v-if="items.store_full_reduction && items.store_full_reduction.length != 0">
          <span class="red">满减</span>
          <span style="margin-left: 0.5rem;" v-for="(reduction, index) in items.store_full_reduction" :key="index" v-if="index <= 2">{{ reduction }}</span>
        </p>
        <p class="discount-item" v-if="items.store_full_package">
          <span class="red">包邮</span>
          <span style="margin-left: 0.5rem;">{{ items.store_full_package }}</span>
        </p>
      </div>

      <div class="goods-box" v-if="items.recommend_goods && items.recommend_goods.length > 0">
        <div class="good-item" v-for="(good, i) in items.recommend_goods" :key="i" @click.stop="toGood(good.goods_id)">
          <div class="good-img">
            <img v-lazy="good.thumb" alt />
          </div>
          <p class="good-title">{{ good.title }}</p>
          <p class="good-price" v-if="fun.isTextEmpty(good.goods_show)">{{ $i18n.t("money") }}{{ good.price }}</p>
          <div class="show_price_box" v-if="!fun.isTextEmpty(good.goods_show)">
            <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(item, i) in good.goods_show" :key="i">{{ item.name }}:{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["items"],
  data() {
    return {};
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    //跳转至分类
    toClassify(id) {
      this.$router.push(this.fun.getUrl("o2oCategory", { id: id }));
    },
    goToAdress(items) {
      let point = this.fun.bd_decrypt(items.longitude, items.latitude);
      this.fun.goToWXAdress(point, items.store_name, items.address.detailed_address); //, items.address.city
    },
    toGood(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#storelist02 {
  background: #f5f5f5;
  padding: 0.625rem 0 0;

  .list-02 {
    margin: 0 0.625rem;
    background: #fff;
    overflow: hidden;
    border-radius: 8px;
    padding: 0.625rem;

    .list-top {
      width: 100%;
      display: flex;

      .store-img {
        width: 7.5rem;
        height: 5.25rem;
        background-color: #d5d5d5;
        border-radius: 5px;
        position: relative;
        overflow: hidden;

        .store-logo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .img-mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: inline-block;
          background-color: rgba(59, 64, 67, 0.6);
        }

        .img-text {
          text-align: center;
          color: #fff;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
          width: 100%;
        }
      }
    }

    .store-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 0.5rem;
      // overflow: hidden;
      justify-content: space-between;

      .store-name {
        font-size: 16px;
        color: #303030;
        text-align: left;
      }

      .store-score,
      .store-address {
        display: flex;
        justify-content: space-between;
        font-size: 10px;

        .left {
          display: flex;
          align-items: center;

          .score {
            color: #969696;
            margin-left: 0.5rem;
          }
        }

        .right {
          color: #ee7d07;
        }
      }

      .store-address {
        display: flex;
        overflow: hidden;

        .left {
          overflow: hidden;

          .category {
            max-width: 3rem;
            color: #f08316;
          }

          .address {
            max-width: 6.25rem;
            color: #464646;
          }
        }

        .right {
          display: flex;
          align-items: center;
          color: #969696;

          i {
            color: #ec544a;
            // font-size: 20px;
          }
        }
      }

      .shadow-box {
        width: 100%;
        position: relative;
        // box-shadow: inset -15px 0px 10px -15px #000;
        &::before {
          content: "";
          position: absolute;
          top: -3px;
          right: -14px;
          width: 22px;
          height: 22px;
          background-size: 100% 100%;
          background-image: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/input-shadow.png);
          z-index: 10;
          // border-top-left-radius: 100%;
          // border-bottom-left-radius: 100%;
          // background: -webkit-linear-gradient(left, transparent, rgba(59, 64, 67, 0.6)); /* Safari 5.1 - 6.0 */
          // background: -o-linear-gradient(right, transparent, #333); /* Opera 11.1 - 12.0 */
          // background: -moz-linear-gradient(right, transparent, #333); /* Firefox 3.6 - 15 */
          // background: linear-gradient(to right, transparent, rgba(59, 64, 67, 0.5)); /* 标准的语法 */
        }
      }

      .dispatch-box {
        display: flex;
        width: 100%;
        overflow-x: scroll;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */

        .dispatch-item {
          height: 15px;
          line-height: 15px;
          background-color: #f08316;
          border-radius: 2px;
          padding: 0 6px;
          margin-right: 6px;
          flex-shrink: 0;
          font-size: 10px;
          color: #fff;
        }
        // &::before {
        //   height: 100%;
        //   width: 10px;
        //   content: "";
        //   background: #000;
        // }
      }

      .dispatch-box::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }

    .discount-box {
      display: flex;
      flex-wrap: wrap;

      .discount-item {
        margin-right: 8px;
        // height: 0.938rem;
        // line-height: 0.938rem;
        margin-top: 0.5rem;
        color: #282828;
        font-size: 10px;

        .red {
          border-radius: 2px;
          background-color: #ec544a;
          padding: 0 6px;
          color: #fff;
          position: relative;
          height: 1rem;
          line-height: 1rem;
          display: inline-block;

          &::after {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            right: -5px;
            border-top: 8px solid transparent;
            border-left: 6px solid #ec544a;
            border-bottom: 8px solid transparent;
          }
        }
      }
    }

    .goods-box {
      margin: 0.5rem 0 0;
      display: flex;
      // width: 17.4rem;
      overflow-x: scroll;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
      .good-item {
        width: 6rem;
        margin-right: 0.56rem;
        font-size: 15px;
        text-align: left;
        display: flex;
        flex-direction: column;

        .good-img {
          width: 6rem;
          height: 6rem;
          border-radius: 5px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
        }

        .good-title {
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
        }

        .good-price {
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 11px;
          color: #ff2c29;
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

      .store_deduction_style {
        background: #ff2c29;
        color: #fff;
        padding: 0 5px;
        font-size: 10px;
      }

      .store_cash_back_style {
        border: 1px solid #ff2c29;
        color: #ff2c29;
        padding: 0 5px;
        font-size: 10px;
      }

      /* 门店拼团 */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }
  }

  .text-ellipsis {
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /* 规定段落中的文本不进行换行 */
  }

  .line {
    width: 1px;
    height: 50%;
    background: #bbb;
    margin: 0 5px;
  }
}
</style>
