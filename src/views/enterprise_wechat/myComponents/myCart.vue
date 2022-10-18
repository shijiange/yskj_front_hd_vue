<template>
  <div id="goods-cart">
    <van-list
      v-if="cartList.length > 0"
      class="list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
    >
      <div class="shop-goods" v-for="(item, index) in cartList" :key="index">
        <div class="shop-head">
          <i class="iconfont icon-fontclass-dianpu"></i>
          <p class="shop-name">{{item.name}}</p>
        </div>
        <div class="goods"  v-for="(good, index) in item.carts" :key='index'>
          <div class="left-goods-img">
            <img :src="good.goods_thumb" alt="" />
          </div>
          <div class="right-goods-info">
            <div class="goods-title">{{ good.goods_title|escapeTitle }}</div>
            <div class="goods-spec">
                <span class="option_str over-2" :style="{backgroundColor: good.goods_option_title ? '' : '#fff'}">
                  {{ good.goods_option_title }}
                </span>
            </div>
            <div class="price">
              <span v-if="good.style_type == 'point-mall'">
                {{ good.point_goods.point }}{{integral}}
              </span>
              <span v-else-if="good.style_type == 'lease-toy'">
                <span>{{$i18n.t("money")}}{{ good.goods_price }}</span>
                <span>(押金：{{good.lease_goods.goods_deposit}})</span>
              </span>
              <span v-else>
                {{$i18n.t("money")}}
                {{ good.goods_price }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <van-empty v-else description="空空如也" style="background: #fff;"></van-empty>
  </div>
</template>

<script>
export default {
  data() {
    return {
      strUrl: 'plugin.wechat-chat-sidebar.frontend.controller.customer.cart.index',
      getConfig: {client: 'work',type: 17}, //企业微信公共参数
      cartList: [],
      loading: false,
      finished: true,
    };
  },
  mounted () {
    this.getData();
  },

  methods: {
    async getData () {
      try {
        let res = await $http.get(this.strUrl, {...this.getConfig}, "loading");
        if (res.result === 1) {
          this.cartList = res.data.list;
        } else {
          this.$toast(res.msg);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },

  components: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#goods-cart {
  .over-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .shop-goods {
    padding: 0.3rem 0.875rem;
    background-color: #fff;
    margin-bottom: 0.625rem;

    .shop-head {
      display: flex;
      align-items: center;

      .icon-fontclass-dianpu {
        font-size: 26px;
        color: #f14e4e;
      }

      .shop-name {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .goods {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0.5rem 0;

      .left-goods-img {
        width: 4.375rem;
        height: 4.375rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .right-goods-info {
        padding: 0 0.625rem;
        text-align: left;
        line-height: 20px;
        flex: 1;

        .goods-title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          word-break: break-word;
          color: #333;
        }

        .goods-spec {
          font-size: 12px;
          color: #666;

          .option_str {
            background-color: #f9f9f9;
            border-radius: 4px;
            padding: 5px;
            vertical-align: middle;
            color: #666;
          }
        }

        .price {
          font-weight: bold;
          color: #f14e4e;
        }
      }
    }

    .goods::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #e4dede;
      transform: scaleY(0.5);
    }
  }
}
</style>
