<template>
  <div class="shopList">
    <div class="shop_title">配送商品</div>
    <div class="shop_lis">
      <div class="lisNo" v-for="(item, index) in infoData" :key="index">
        <div class="lisleft">
          <img :src="item.thumb" alt="" />
        </div>
        <div></div>
        <div class="centenBox">
          <div class="liscenten">{{item.title}}</div>
          <div class="option" v-if="item.goods_option_title">规格：{{item.goods_option_title}}</div>
        </div>
        <div class="lisright">数量：x{{item.total}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    infoData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.shopList {
  padding: 0.94rem;
  box-sizing: border-box;
  .shop_title {
    text-align: left;
    font-size: 0.88rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
}
.shop_lis {
  display: flex;
  flex-direction: column;
  .lisNo {
    display: flex;
    margin-bottom: 0.5rem;
    .lisright {
      font-size: 0.69rem;
      color: #666666;
      flex: 0.5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .centenBox {
      flex: 1;
      display: flex;
      flex-direction: column;
      .option{
        width: 100%;
        text-align: left;
        font-size: 0.69rem;
        color: #8c8c8c;
      }
      .liscenten {
        font-size: 0.9rem;
        color: #202020;
        flex: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-align: left;
      }
    }

    .lisleft {
      flex-shrink: 0;
      width: 3.75rem;
      height: 3.75rem;
      background-color: #c3c3c3;
      border-radius: 0.31rem;
      margin-right: 0.5rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 0.31rem;
      }
    }
  }
}
</style>