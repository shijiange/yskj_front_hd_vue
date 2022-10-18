<!-- 零售链接 -->
<template>
  <div id="newRetail-retailLink">
    <c-title :hide="false" text="我的库存"></c-title>
    <div class="main">
      <div class="ewm-bg">
        <img class="img-box" :src="info.url" alt="" />
      </div>
      <div class="btn-box">
        <div class="btn-child" @click.stop="ImgPreview">保存二维码</div>
        <div class="btn-child red-color" @click.stop="showWechatshar = true">分享好友</div>
      </div>
    </div>
    <div class="remaining-time" v-if="info.remaining_time">等待支付，剩余时间<van-count-down :time="fun.getTimeDifference(info.remaining_time)" /></div>
    <div class="order-box">
      <div class="box-title">包含商品</div>
      <div class="good-info" v-for="good in info.goods" :key="good.goods_id">
        <img class="good-img" :src="good.goods_thumb" alt="" />
        <div class="goods-main">
          <div class="good-title">{{ good.goods_title }}</div>
          <div class="good-other">
            <div class="goods-sku">
              <template v-if="good.goods_option">规格：{{ good.option_title }}</template> X{{ good.goods_num }}
            </div>
            <div class="good-num">{{ $i18n.t("money") }}{{ good.goods_price }}</div>
          </div>
        </div>
      </div>
      <div class="order-price">
        合计：
        <div class="order-price-red">{{ info.money }}{{ $i18n.t("元") }}</div>
      </div>
    </div>
    <div style="height: 4rem;"></div>
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>

<script>
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import { Toast, ImagePreview } from "vant";
export default {
  data() {
    return {
      info: {},
      showWechatshar: false
    };
  },

  // activated: {},

  components: { yzWechatShareImg },

  computed: {},

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      let that = this;
      $http
        .get("plugin.new-retail.frontend.index.getSalesRecord", { id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
            this.fun.wxShare(
              "",
              {},
              {
                link:
                  that.fun.getSiteRoot() +
                  "/addons/yun_shop/?menu#/goodsorder?i=" +
                  that.fun.getKeyByI() +
                  "&mid=" +
                  that.fun.getKeyByMid() +
                  "&sales_id=" +
                  that.info.id +
                  "&retail_state=3&orderType=newRetail&tag=-2"
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    ImgPreview() {
      ImagePreview([this.info.url]);
      Toast("请长按进行保存！");
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#newRetail-retailLink {
  .main {
    background: #fff;

    .ewm-bg {
      width: 100%;
      display: block;
      background-color: #fff;
      padding: 2.25rem 0;

      .img-box {
        background:
          linear-gradient(#f14e4e, #f14e4e) left top,
          linear-gradient(#f14e4e, #f14e4e) left top,
          linear-gradient(#f14e4e, #f14e4e) right top,
          linear-gradient(#f14e4e, #f14e4e) right top,
          linear-gradient(#f14e4e, #f14e4e) right bottom,
          linear-gradient(#f14e4e, #f14e4e) right bottom,
          linear-gradient(#f14e4e, #f14e4e) left bottom,
          linear-gradient(#f14e4e, #f14e4e) left bottom;
        background-repeat: no-repeat;
        background-size: 2px 20px, 20px 2px;
        width: 10.563rem;
        height: 10.563rem;
        padding: 0.5rem;
      }
    }

    .btn-box {
      display: flex;
      justify-content: space-around;
      padding-bottom: 0.875rem;

      .btn-child {
        width: 8.75rem;
        height: 2.188rem;
        line-height: 2.188rem;
        border-radius: 0.313rem;
        border: solid 0.063rem #f14e4e;
        font-size: 16px;
        color: #f14e4e;
      }

      .red-color {
        background: #f14e4e;
        color: #fff;
      }
    }
  }

  .order-box {
    width: 90%;
    background: #fff;
    border-radius: 0.313rem;
    overflow: hidden;
    margin: 0.875rem auto;

    .box-title {
      height: 2.188rem;
      line-height: 2.188rem;
      text-align: center;
      background-color: #f14e4e;
      color: #fff;
    }

    .good-info {
      display: flex;
      text-align: left;
      padding: 0.75rem;

      .good-img {
        flex-shrink: 0;
        width: 4.688rem;
        height: 4.688rem;
        background-color: #cfcfcf;
        border-radius: 0.313rem;
        overflow: hidden;
        margin-right: 0.75rem;
      }

      .goods-main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;

        .good-title {
          font-size: 15px;
          line-height: 20px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .goods-sku {
          color: #999;
          font-size: 12px;
        }

        .good-other {
          display: flex;
          justify-content: space-between;

          .good-num {
            color: #f14e4e;
            font-size: 12px;
          }
        }
      }
    }

    .order-price {
      height: 3.125rem;
      line-height: 3.125rem;
      display: flex;
      justify-content: flex-end;
      padding: 0 0.875rem;

      .order-price-red {
        font-size: 18px;
        color: #f14e4e;
      }
    }
  }

  .remaining-time {
    display: flex;
    width: 90%;
    margin: 0.75rem auto 0;
  }
}
</style>
