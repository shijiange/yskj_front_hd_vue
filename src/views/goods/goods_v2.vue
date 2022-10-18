<template>
  <transition>
    <div v-if="goods_type">
      <!--目前商品类型-->
      <!--voiceGoods  语音商品-->
      <!--course 课程商品-->
      <!--goods  平台商品/供应链商品 plugin_id=44-->
      <!--yun_sign_goods || yun_contract_lock_goods 电子合同商品-->
      <!--yunqian_api  芸签聚合api商品-->
      <!--appointment_goods  预约商品-->
      <!--store_goods  门店商品-->
      <!--supplierGoods  供应商商品-->
      <!--hotelGoods   酒店商品-->
      <!--group_buy  拼购商品-->
      <!--group_good  拼团商品-->
      <!--grab_group 抢团商品-->
      <!--managementGoods 厂家管理 -->
      <!-- newRetailSalesGood 新零售 src\views\member\newRetail\good.vue-->
      <div v-if="goods_type == 'voiceGoods'">
        <component :is="voiceGoods" :goods_type="goods_type" :fatherTitle="fatherTitle"></component>
      </div>
      <div v-else-if="goods_type == 'course'">
        <component :is="courseGoods" :goods_type="goods_type" :goods_info="goods_info" :fatherTitle="fatherTitle"></component>
      </div>
      <div v-else-if="goods_type == 'phone_bill_pro_goods'">
        <component :is="phoneBillProGoods" :goods_type="goods_type" :goods_info="goods_info" :fatherTitle="fatherTitle"></component>
      </div>
      <div v-else-if="goods_type == 'store_goods'">
        <!--v-on:showComment="showCom" showCom报错了-->
        <component
          :is="storeGoods"
          :showDis="showDis"
          :show8="show8"
          :goods_info_store="goods_info"
          :goods_type="goods_type"
          :store_id="store_id"
          :wx_video_link="wx_video_link"
          :is_room="is_room"
          :touchClose="isComment"
          :toker="is_toker"
          :fatherTitle="fatherTitle"
        ></component>
      </div>
      <div v-else-if="goods_type == 'electricity-bill-pro'">
        <component :is="Electricity" :goods_type="goods_type" :goods_info="goods_info" :fatherTitle="fatherTitle"></component>
      </div>

      <div v-else-if="goods_type == 'sweep_buy_goods'">
        <component :is="sweepBuyGoods" :goods_type="goods_type" :goods_info="goods_info" :fatherTitle="fatherTitle"></component>
      </div>

      <div v-else-if="goods_type == 'oil_recharge_goods'">
        <component :is="oilRechargeGoods" :goods_type="goods_type" :goods_info="goods_info" :fatherTitle="fatherTitle"></component>
      </div>

      <!-- v-if="goods_type == 'goods' || goods_type == 'supplierGoods' || goods_type == 'yun_contract_lock_goods || yun_sign_goods' || goods_type == 'yunqian_api' || goods_type == 'appointment_goods' || goods_type == 'hotelGoods'" -->
      <div v-else>
        <component :is="cNewGoods" @setShowBigImg="setShowBigImg" :parent_showBigImg="showBigImg" :goods_info="goods_info" :goods_type="goods_type" :is_room="is_room" :wx_video_link="wx_video_link" :fatherTitle="fatherTitle"></component>
      </div>
      <!--供应商和平台商品合并-->

      <!-- <div v-if="goods_type == 'hotelGoods'">
        <keep-alive>
          <hotel-goods :goods_info_hotel="goods_info" :goods_type="goods_type" v-on:showComment="showCom" :is_room="is_room" :touchClose="isComment"></hotel-goods>
        </keep-alive>
      </div> -->

      <div class="goods_detail_rows"></div>
    </div>
  </transition>
</template>

<script>
import goods from "./goods_controller";
export default goods;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/goods.scss";
</style>
