<template>
<div id="all">
    <c-title :hide="false" text='商家详情'></c-title>
    <div class="home-detail">
        <div class="home-detail-banner">
            <img :src="mainInfo.store_thumb">
        </div>
        <div class="home-detail-info" v-if="infoShow">
            <p v-html="info"></p>
        </div>
    </div>

</div>


</template>


<script>
import home_seller_detail from './home_seller_detail_controller';
export default home_seller_detail;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .home-detail {
    .home-detail-banner {
      height: 9.375rem;
      background: #ccc;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .home-detail-info {
      margin: 0.3125rem 3% 0 3%;

      p {
        text-align: left;
        font-size: 16px;
      }
    }
  }
</style>
