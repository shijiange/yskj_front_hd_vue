<template>
  <transition>
    <div>
      <div v-if="goods_type == 'goods'">
        <component
          :is="cGoods"
          :goods_info="goods_info"
          :goods_type="goods_type"
          v-on:showComment="showCom"
          :is_room="is_room"
          :touchClose="isComment"
        ></component>
      </div>

      <div class="goods_detail_rows"></div>
    </div>
  </transition>
</template>

<script>
import managementGoods_controller from './managementGoods_controller';
export default managementGoods_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// @import '../../assets/css/goods.scss';
</style>
