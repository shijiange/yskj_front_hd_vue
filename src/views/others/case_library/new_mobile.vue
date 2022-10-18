<template>
  <div id="case-new-mobile">
    <headTemplate :text="title_word"></headTemplate>
    <div class="new" v-if="page_type == 'caseLibraryNewMobile'">
      <span :class="{'new1':order_by=='new'}" @click="getList('new','new')">最新</span>
      <span class="new2">|</span>
      <span :class="{'new1':order_by=='hot'}" @click="getList('new','hot')">最热</span>
    </div>
    <div class="area" id="area" v-if="page_type == 'caseLibraryAreaMobile'">
      <div class="text" @click="openArea">
        <span class="text1" v-if="!area_text">全国</span>
        <span class="text1" v-else>{{area_text}}</span>
        <van-icon name="arrow-up" v-if="show" />
        <van-icon name="arrow-down" v-else />
      </div>
      <van-popup v-model="show" get-container="#area" overlay-class="pop1" position="top" :style="{ height: '30%' }">
        <div class="area-li">
          <div class="pro-li">
            <li class="li" @click="changePro(item)" v-for="(item, index) in province_list" :key="index" :class="{'li-selected':item.v==province_id}">{{ item.n }}</li>
          </div>
          <div class="city-li">
            <li class="li" @click="changeCity(item)" v-for="(item, index) in city_list" :key="index" :class="{'li-selected':item.v==city_id}">{{ item.n }}</li>
          </div>
        </div>
      </van-popup>
    </div>
    <div class="case-li">
      <caseMobile :datas="list"></caseMobile>
      <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;" v-if="!isLoadMore">
        {{ $i18n.t('没有更多了') }}~
      </div>
    </div>
    <serviceTemplate></serviceTemplate>
  </div>
</template>

<script>
import new_mobile_controller from './new_mobile_controller';

export default new_mobile_controller;
</script>

<style lang="scss" rel="stylesheet/scss">
$orange: #ff5c00;

#case-new-mobile {
  background: #fff;

  .new {
    padding: 1rem 0.9375rem 0 0.9375rem;
    text-align: left;
    color: #999;
    font-weight: 600;
    font-size: 0.875rem;

    span {
      display: inline-block;
    }

    .new1 {
      color: $orange;
    }

    .new2 {
      margin: 0 0.5rem;
    }
  }

  .area {
    padding: 0 0.9375rem;
    text-align: left;
    border-bottom: 1px solid #ebebeb;

    .text {
      line-height: 2.5rem;

      .text1 {
        display: inline-block;
        margin-right: 0.5rem;
      }
    }
  }

  .area-li {
    border: 1px solid #ebebeb;
    display: flex;

    .pro-li {
      width: 11.5rem;
      height: 12.4rem;
      overflow: auto;
      line-height: 2.5rem;
      color: #494949;
      font-size: 0.875rem;
      background: #fff;

      .li {
        padding-left: 0.9375rem;
      }

      .li-selected {
        background: #f8f8f8;
        color: $orange;
      }
    }

    .city-li {
      width: 11.5rem;
      height: 12.4rem;
      padding: 0 0.9375rem;
      overflow: auto;
      line-height: 2.5rem;
      color: #494949;
      font-size: 0.875rem;
      background: #f8f8f8;

      .li-selected {
        color: $orange;
      }
    }
  }

  .pop1 {
    height: calc(100% - 5rem) !important;
    top: 5rem !important;
  }

  .van-popup--top {
    top: 5rem;
  }
}
</style>
