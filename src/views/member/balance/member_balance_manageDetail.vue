<template>
  <section id="balance_manage_detail">
    <c-title :hide="false" text="保单详情"></c-title>
    <div class="detail_info">
      <div class="shop_name">店铺名称: {{ data.shop_name }}</div>
      <div class="shop_name">被保险人: {{ data.insured }}</div>
      <div class="shop_name">证件号码: {{ data.identification_number }}</div>
      <div class="shop_name">被保险人联系方式: {{ data.phone }}</div>
      <div class="shop_name">保险地址:{{ data.address }}</div>
      <div class="shop_name">投保财产: {{ data.insured_property }}</div>
      <div class="shop_name">用户类型: {{ data.customer_type }}</div>
      <div class="shop_name">保额 (万{{$i18n.t('元')}}): {{ data.insured_amount }}万</div>
      <div class="shop_name">保险期限 (年): {{ data.guarantee_period }}年</div>
      <div class="shop_name">保费 ({{$i18n.t('元')}}): {{ data.premium }}{{$i18n.t('元')}}</div>
      <div class="shop_name">投保险种: {{ data.insurance_coverage }}</div>
      <div class="shop_name">附加玻璃险（35{{$i18n.t('元')}}保1万）份: {{ data.additional_glass_risk }}</div>
      <div class="shop_name">投保人: {{ data.insurance_company }}</div>
      <div class="shop_name" v-if="!fun.isTextEmpty(data.company_id)">保险公司: {{ data.has_one_company?data.has_one_company.name:'' }}</div>
      <div class="shop_name">备注信息: {{ data.note }}</div>
    </div>
  </section>
</template>
<script>
import member_balance_manage_detail from "./member_balance_manage_detail_controller";

export default member_balance_manage_detail;
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#balance_manage_detail {
  .shop_name {
    display: flex;
    height: 40px;
    line-height: 40px;
    margin-left: 15px;
  }
}
</style>
