<template>
  <div id="love_list" style="overflow: scroll; -webkit-overflow-scrolling: touch;">
    <c-title :hide="false" :text="love_name + '明细'"></c-title>
	<van-tabs v-model="selected" @click="switchItem">
      <van-tab id="0" title="全部"></van-tab>
      <van-tab id="1" :title="loveLang.change_income || '收入'"></van-tab>
      <van-tab id="2" :title="loveLang.change_expend || '支出'"></van-tab>
    </van-tabs>

    <!-- <mt-loadmore
      v-if="goload"
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      ref="coupon_loadmore"
      bottomPullText=""
      bottomDropText="上拉加载..."
      bottomLoadingText=""
      :autoFill="false"
      id="olis"
    > -->
    <div>
      <div class="coupon_card">
        <div v-show="selected==0">
          <!--全部-->
          <template v-if="!fun.isTextEmpty(allData)">
            <div class="tbs" v-for="(item, index) in allData" :key="index">
              <div class="left titles">
                <div class="source-name">{{ item.source_name }}</div>
                <div class="remark">
                  {{ item.has_one_love_recharge_records ? item.has_one_love_recharge_records.remark : '' }}
                </div>
              </div>
              <div class="right reds">
                {{ item.change_value }}
                <small></small>
              </div>
              <div class="left">{{ item.created_at }}</div>
              <div class="right">{{ item.value_type_name }}</div>
              <!-- <div class="left assignee">
                  <div class="assignee-text">受让人</div>
                  <div class="assignee-face">
                    <img src="https://img0.baidu.com/it/u=1949194731,3729628329&fm=26&fmt=auto" alt="">
                  </div>
                  <div class="assignee-text">昵称</div>
              </div> -->
            </div>
          </template>
        </div>
        <div v-show="selected==1">
          <!--收入-->
          <template v-if="!fun.isTextEmpty(incomeData)">
            <div class="tbs" v-for="(item, index) in incomeData" :key="index">
              <div class="left titles">
                <div class="source-name">{{ item.source_name }}</div>
                <div class="remark">
                  {{ item.has_one_love_recharge_records ? item.has_one_love_recharge_records.remark : '' }}
                </div>
              </div>
              <div class="right reds">
                {{ item.change_value }}
                <small></small>
              </div>
              <div class="left">{{ item.created_at }}</div>
              <div class="right">{{ item.value_type_name }}</div>
            </div>
          </template>
        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="selected==2">
        <!-- <mt-tab-container-item id="2"> -->
          <!--支出-->
          <template v-if="!fun.isTextEmpty(expendData)">
            <div class="tbs" v-for="(item, index) in expendData" :key="index">
              <div class="left titles">
                <div class="source-name">{{ item.source_name }}</div>
                <div class="remark">
                  {{ item.has_one_love_recharge_records ? item.has_one_love_recharge_records.remark : '' }}
                </div>
              </div>
              <div class="right reds">
                {{ item.change_value }}
                <small></small>
              </div>
              <div class="left">{{ item.created_at }}</div>
              <div class="right">{{ item.value_type_name }}</div>
            </div>
          </template>
        <!-- </mt-tab-container-item> -->
        </div>
      </div>
    <!-- </mt-tab-container> -->
    </div>
    <!-- </mt-loadmore> -->
  </div>
</template>
<script>
import love_list_controller from './love_list_controller';

export default love_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/css/love_list.scss';
</style>
