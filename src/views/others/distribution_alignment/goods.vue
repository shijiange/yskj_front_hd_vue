<template>
  <transition>
    <div>
      <div v-if="goods_type == 'course'">
        <component :is="courseGoods"
                   :goods_type="goods_type"></component>
      </div>
      <div v-if="goods_type == 'goods' ||  goods_type == 'supplierGoods' || goods_type == 'appointment_goods'">
        <component :is="cGoods"
                   :goods_info="goods_info"
                   :goods_type="goods_type"
                   v-on:showComment="showCom"
                   :is_room='is_room'
                   :touchClose='isComment'></component>
      </div>
      <div v-if="goods_type == 'store_goods'">
        <component :is="storeGoods"
                   :showDis="showDis"
                   :show8="show8"
                   :goods_info_store="goods_info"
                   :goods_type="goods_type"
                   :store_id="store_id"
                   :is_room='is_room'
                   v-on:showComment="showCom"
                   :touchClose='isComment'></component>
      </div>
      <div v-if="goods_type == 'hotelGoods'">
        <keep-alive>
          <hotel-goods :goods_info_hotel="goods_info"></hotel-goods>
        </keep-alive>
      </div>

      <div class="goods_detail_rows"></div>
    </div>
  </transition>
</template>

<script>
import goods from "./goods_controller";
export default goods;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "./css/goods.scss";
</style>
