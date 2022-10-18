<!-- 门店礼包 -->
<template>
  <div class="gift_box">
    <div class="fe-mod-8-hp-line" v-for="(item, i) in list" :key="i" @click="toGood(item)">
      <div class="fe-mod-8-hp-line-img">
        <div class="saleimg"></div>
        <img :src="item.thumb" />
      </div>
      <div class="fe-mod-8-hp-line-info">
        <div class="title">
          {{ item.title }}
        </div>
        <div class="goods_content_show" v-if="item.goods_content_show && datas.content_list">
          <!-- 商品内容显示 #81889-->
          <template v-for="contentChild in item.goods_content_show">
            <div
              class="goods_content_show_item"
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
        <div class="price fe-mod-8-main-name">
          <div style="display: flex;align-items: center;">
            <div class="p1">{{ $i18n.t("money") }}{{ item.price }}</div>
            <div class="p2">
              <span v-show="parseInt(item.market_price)">{{ $i18n.t("money") }}{{ item.market_price }}</span>
            </div>
          </div>
          <div class="fe-mod-8-main-name-buy  buy-1" style="margin-top: 0.375rem;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list", "datas"],
  data() {
    return {};
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    toGood(item) {
      if (item.id) {
        this.$router.push(this.fun.getUrl("goods", { id: item.id }));
      } else {
        this.$router.push(this.fun.getUrl("goods", { id: item }));
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.gift_box {
  padding: 0.5rem;

  /* background: #fff; */
  .fe-mod-8-main-name-buy {
    height: 1.25rem;
    width: 1.875rem;
    background-repeat: no-repeat;
  }

  .buy-1 {
    background: url(../../temp/img/ico_buy_3.png);
    background-size: 1.875rem 1.25rem;
  }

  .fe-mod-8-hp-line {
    display: flex;
    background: #fff;
    padding: 0.5rem;
    border-radius: 0.25rem;

    .fe-mod-8-hp-line-img {
      height: 5rem;
      width: 5rem;
      border-radius: 0.25rem;
      overflow: hidden;
      background: #f2f2f2;
      position: relative;

      .saleimg {
        height: 3.125rem;
        width: 3.125rem;
        position: absolute;
        top: 0;
        left: 0;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .fe-mod-8-hp-line-info {
      // height: 5rem;
      background: #fff;
      padding-left: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex: 1;

      .title {
        text-align: left;
        height: 2.5rem;
        font-size: 14px;
        color: #333;
        line-height: 1.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .goods_content_show {
        display: flex;
        flex-wrap: wrap;
        .goods_content_show_item {
          margin: 0 8px 0 0;
        }
      }

      .price {
        width: 100%;
        font-size: 14px;
        color: #bbb;
        float: left;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .p1 {
          float: left;
          color: #f60;
        }

        .p2 {
          font-size: 12px;
          padding-left: 0.3125rem;
          text-decoration: line-through;
        }

        .p3 {
          color: #999;
          padding-left: 0.625rem;
          float: left;
          font-size: 12px;
        }

        .p4 {
          color: #999;
          padding-left: 0.625rem;
          float: left;
          font-size: 12px;
          width: 5rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
