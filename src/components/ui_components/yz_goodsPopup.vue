<!-- 商品详情弹窗 -->
<template>
  <div id="yz_goodsPopup" :style="{ '--color': `${themeColor}` }">
    <van-popup v-model="showgp" position="bottom" :style="{ height: '80%' }" closeable @closed="close">
      <div style="height: 100%; overflow: hidden;">
        <div class="yz_goodsPopup-main">
          <!-- 顶部轮播图 -->
          <div class="yz-gp-img">
            <viewer :images="goodsInfo.thumb_url" class="section" style="position: relative;">
              <c-myswipe :style="{ height: fun.getPhoneEnv() == 3 ? '375px' : '100vw' }" :pagination-visible="true" :slides="goodsInfo.thumb_url" :repeating="true" :auto="0" class="banner_pcStyle">
                <div v-if="!fun.isTextEmpty(goodsInfo.goods_video)">
                  <video
                    id="goods_vedio"
                    style="width: 100%; height: 100%; object-fit: scale-down;"
                    :poster="goodsInfo.video_image"
                    :src="goodsInfo.goods_video"
                    controls
                    webkit-playsinline="true"
                    playsinline="true"
                    x5-playsinline="true"
                    x-webkit-airplay="true"
                    x5-video-ignore-metadata="true"
                    width="100%"
                    height="100%"
                  >
                    <source :src="goodsInfo.goods_video" />
                  </video>
                </div>
                <div v-if="!goodsInfo.thumb_url || goodsInfo.thumb_url == null || goodsInfo.thumb_url.length == 0">
                  <img :src="goodsInfo.thumb" width="100%" />
                </div>
                <div v-for="(ithumb, index) in goodsInfo.thumb_url" :key="index">
                  <template v-if="ithumb">
                    <img :src="ithumb" width="100%" />
                  </template>
                </div>
              </c-myswipe>
            </viewer>
          </div>
          <!-- 活动倒计时 -->
          <div class="rob-time" v-if="goodsInfo.end_time && (goodsInfo.end_time != '0' || goodsInfo.end_time != 0)">
            <div class="rt-text">截止倒计时：</div>
            <van-count-down :time="fun.getTimeDifference(goodsInfo.end_time)" class="bottom_time" format="DD天HH时mm分ss秒" @finish="timeEnd">
              <template #default="timeData">
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.days < 10 ? `0${timeData.days}` : timeData.days }} </em>天
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.hours < 10 ? `0${timeData.hours}` : timeData.hours }}</em>
                <b>:</b>
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.minutes < 10 ? `0${timeData.minutes}` : timeData.minutes }}</em>
                <b>:</b>
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.seconds < 10 ? `0${timeData.seconds}` : timeData.seconds }}</em>
              </template>
            </van-count-down>
          </div>
          <!-- 商品信息 -->
          <div class="yz-gp-goods-info">
            <div class="yz-g-price">
              {{ $i18n.t("money") }}
              <div class="big-font">{{ goodsInfo.price }}</div>
              <font style="text-decoration: line-through; color: #999;" v-if="Number(goodsInfo.market_price) > Number(goodsInfo.price) && Number(goodsInfo.market_price) > 0"
                >{{ fun.getMarketPrice() }}:{{ goodsInfo.market_price }}</font
              >
            </div>
            <div class="yz-g-title">{{ goodsInfo.title }}</div>
            <div class="yz-g-other">
              <div class="other-info">库存：{{ goodsInfo.stock }}</div>
              <div class="other-info">销量：{{ parseInt(goodsInfo.show_sales) + parseInt(goodsInfo.virtual_sales) }}</div>
            </div>
            <div class="yz-g-addCar" v-if="addCartBtn">
              <slot name="add-icon"><i class="iconfont icon-life-game-plus" @click="addCart"></i></slot>
            </div>
          </div>
          <div style="height: 10px; background: #f8f8f8;" v-if="!this.fun.isTextEmpty(goodsInfo.has_one_brand)"></div>
          <!-- 供应商、品牌信息 -->
          <div class="yz-gp-brand" v-if="!this.fun.isTextEmpty(goodsInfo.has_one_brand)">
            <img :src="goodsInfo.has_one_brand.logo" alt="" class="logo_img" />
            {{ goodsInfo.has_one_brand.name }}
          </div>
          <div style="height: 10px; background: #f8f8f8;"></div>
          <!-- 商品描述 -->
          <div class="yz-g-detail">
            <div class="yz-g-d-title">— 商品详情 —</div>
            <div class="yz-content" v-html="goodsInfo.content"></div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import cMyswipe from "components/myswipe";
// import yzSpecs from "components/ui_components/yz_specs";

export default {
  model: {
    prop: "showgp",
    event: "onEmit"
  },
  props: {
    showgp: {
      type: Boolean,
      required: false
    },
    goodsInfo: {
      type: Object,
      default: () => ({})
    },
    //主题色
    themeColor: {
      type: String,
      default: "#f14e4e"
    },
    //显示加入按钮
    addCartBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  components: { cMyswipe }, //yzSpecs,
  computed: {},
  methods: {
    close() {
      this.$emit("onEmit", false);
    },
    addCart() {
      this.$emit("showgoodspecs", true);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#yz_goodsPopup {
  height: 100%;
  overflow-y: scroll;

  .van-popup {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }

  /deep/.van-popup__close-icon {
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 0.25rem;
    // position: fixed;
    // top: 22%;
  }

  .yz_goodsPopup-main {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
  }

  .banner_pcStyle {
    font-size: 0;
  }

  .rob-time {
    height: 2.625rem;
    line-height: 2.625rem;
    color: #fff;
    background: var(--color);
    display: flex;
    justify-content: space-between;
    padding: 0 0.875rem;
    align-items: center;

    .rt-text {
      font-size: 1rem;
    }

    .bottom_time {
      em {
        background: #fff;
        color: #000;
      }
    }
  }

  .van-count-down {
    color: #fff;
  }

  .yz-gp-goods-info {
    padding: 0.5rem 0.875rem;
    display: flex;
    flex-direction: column;

    .yz-g-price {
      color: var(--color);
      font-size: 0.75rem;
      display: flex;
      align-items: baseline;
      padding-bottom: 0.375rem;

      .big-font {
        font-size: 1.5rem;
        margin: 0 0.5rem 0 0.125rem;
      }
    }

    .yz-g-title {
      text-align: left;
      font-size: 1rem;
      line-height: 1.25rem;
      color: #333;
      margin-bottom: 0.375rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .yz-g-other {
      display: flex;
      color: #999;
      font-size: 0.75rem;

      .other-info {
        margin-right: 0.875rem;
      }
    }

    .yz-g-addCar {
      display: flex;
      flex-direction: row-reverse;

      i {
        background: var(--color);
        color: #fff;
        width: 1.5rem;
        height: 1.5rem;
        text-align: center;
        line-height: 1.5rem;
        border-radius: 50%;
        display: block;
      }
    }
  }

  .yz-gp-brand {
    height: 3.875rem;
    line-height: 3.875rem;
    display: flex;
    align-items: center;
    padding: 0 0.875rem;
    font-size: 1rem;
    color: #333;

    .logo_img {
      width: 1.875rem;
      height: 1.875rem;
      border-radius: 100%;
      overflow: hidden;
      margin: 0 0.75rem 0 0;
    }
  }

  .yz-g-detail {
    .yz-g-d-title {
      height: 2.875rem;
      line-height: 2.875rem;
      color: #999;
    }

    .yz-content {
      /deep/img {
        max-width: 100%;
        vertical-align: bottom; //解决图片有默认的下边距问题
      }
    }
  }
}
</style>
