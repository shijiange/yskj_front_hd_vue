<template>
  <div id="case-label-mobile" v-if="view_show">
    <headTemplate :text="label_title"></headTemplate>
    <div class="label">{{label_title}}</div>
    <div class="case-li1">
      <caseMobile :datas="list"></caseMobile>
      <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;" v-if="!isLoadMore">
        {{ $i18n.t('没有更多了') }}~
      </div>
    </div>
    <serviceTemplate></serviceTemplate>
  </div>
</template>

<script>
import case_label_mobile_controller from './case_label_mobile_controller';

export default case_label_mobile_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#case-label-mobile {
  background: #fff;
  min-height: 100vh;

  .label {
    padding: 1rem 0.9375rem 0 0.9375rem;
    text-align: left;
    font-size: 0.875rem;
  }

  .case-li {
    padding: 0 0.9375rem;
  }
}
</style>
