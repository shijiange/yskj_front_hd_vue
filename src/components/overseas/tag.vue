<template>
  <!-- 海外购 -->
  <div class="overseas-tag__wrapper" v-if="visible">
    <span class="overseas-tag">
      <img src="../../assets/images/overseas/tag.png" />
    </span>
    <div class="overseas-site">从香港发货</div>
  </div>
</template>
<script>
export default {
  props: {
    // 是否是海外商品
    visible: {
      type: Boolean,
      default: () => false,
    },
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.overseas-tag__wrapper {
  height: 16px;
  line-height: 16px;
  display: flex;
  .overseas-tag {
    height:16px;
    img {
      height:16px;
    }
  }
  .overseas-site {
    margin-left: 5px;
    display: block;
    float: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: #000;
  }
}
// 海外购 - 商品列表
.overseas-tag__wrapper.goods {
  display: flex;
  justify-content: space-between;
}

// 海外购 - 商品详情页
.overseas-tag__wrapper.details {
  height: 16px!important;
  line-height: 16px!important;
  margin: 6px 0;
}
</style>


