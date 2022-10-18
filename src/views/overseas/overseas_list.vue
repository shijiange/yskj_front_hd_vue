<template>
  <div id="love_list">
    <c-title :hide="false"
             :text='coin_name+"明细"'></c-title>
    <van-tabs v-model="selected" @click="switchItem">
      <van-tab name="0" title="全部"></van-tab>
      <van-tab name="1" :title="income_name_text"></van-tab>
      <van-tab name="2" title="支出"></van-tab>
    </van-tabs>
    <div>
    <!-- <mt-tab-container v-model="selected"> -->
      <div class="coupon_card">
        <div v-show="selected==0">
        <!-- <mt-tab-container-item id="0"> -->
          <!--全部-->
          <div class="tbs"
               v-for='(item,index) in wait_used' :key='index'>
            <div class="left titles">{{item.source_name}}</div>
            <div class="right reds">{{item.change_value}}{{$i18n.t('元')}}</div>
            <div class="left">{{item.created_at}}</div>
            <div class="right">{{item.value_type_name}}</div>
          </div>
        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="selected==1">
        <!-- <mt-tab-container-item id="1"> -->
          <!--已过期-->
          <div class="tbs"
              v-for='(item,index) in overdue' :key='index'>
            <div class="left titles">{{item.source_name}}</div>
            <div class="right reds">{{item.change_value}}{{$i18n.t('元')}}</div>
            <div class="left">{{item.created_at}}</div>
            <div class="right">{{item.value_type_name}}</div>
          </div>

        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="selected==2">
        <!-- <mt-tab-container-item id="2"> -->
          <!--已使用-->
          <div class="tbs"
               v-for='(item,index) in used' :key='index'>
            <div class="left titles">{{item.source_name}}</div>
            <div class="right reds">{{item.change_value}}{{$i18n.t('元')}}</div>
            <div class="left">{{item.created_at}}</div>
            <div class="right">{{item.value_type_name}}</div>
          </div>
        <!-- </mt-tab-container-item> -->
        </div>
      </div>

    <!-- </mt-tab-container> -->
    </div>

  </div>
</template>
<script>
import overseas_list_controller from './overseas_list_controller';

export default overseas_list_controller;

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/css/love_list.scss'
</style>
