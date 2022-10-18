<template>
  <div id="all">
    <c-title :hide="status?true:false"
             text="选择定位"
             :eteos="fun.setWXTitle($store.state.temp.item.janst)"></c-title>
    <div class="x0">
      <div class="search_box">
        <div class="close"
             @click="goback">
          <i class="iconfont icon-close11"></i>
        </div>
        <div class="search">
          <i class="iconfont icon-sousuo1"></i>
          <input @click="tosearch"
                 type="text"
                 placeholder="选择城市、小区、写字楼、学校" />
        </div>
      </div>
      <div class="x4"
           style="text-align: left;">
        <div class="x5"
             @click.stop="toGeolocation">
          <i></i>
          <p>点击定位当前地点</p>
        </div>
      </div>
      <div class="xc none">
        <ul></ul>
      </div>
    </div>
    <!-- 最多只显示6个城市 -->
    <div class="open_city">
      <h1><span>{{status?'热门':'已开通'}}</span><span>城市</span></h1>
      <ul class="open">
        <li @click.stop="setCity('')" v-if="position_switch == 1">全国</li>
        <li @click.stop="setCity(item.full_address)" v-for="(item,i) in sixCity" :key='i'>
          {{ item.full_address }}
        </li>
      </ul>
    </div>

    <!-- 城市列表 -->
    <div class="city_list">
      <ul class="city_b"
          v-for="(city,i) in citys"
          :key='i'>
        <p class="letter d_jump">{{ city.title }}</p>
        <li @click="setCity(item.full_address)"
            v-for="(item,i) in city.item"
            :key='i'>
          {{ item.full_address }}
        </li>
      </ul>
    </div>
    <!-- 城市首字母 -->
    <div class="right_letter">
      <ul class="letter_box"
          :class="{ 'clear':status }">
        <li v-if="status"
            class="hot-location"
            :class="{ 'clear':status }"
            @click="toHot">热门</li>
        <li v-for="(l, index) in shortcutList"
            @click.stop="Jump($event, index)"
            :key='index'>
          {{ l }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import home from './home_controller';

export default home;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#all {
  padding-bottom: 52px;
}

.x0 {
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  z-index: 100;
}

.x0 .x4 {
  width: 100%;
  margin-top: 0.625rem;
}

.x0 .x4 .x5 {
  height: 3.125rem;
  padding: 0 0.9375rem;
  background: #fff;
  position: relative;
}

.x0 .x4 .x5 i {
  display: inline-block;
  vertical-align: top;
  width: 1.25rem;
  height: 3.125rem;
  background: url(//static-o2o.360buyimg.com/daojia/new/images/icon/location-eye@2x.png) no-repeat 0 center;
  background-size: 1.25rem 1.25rem;
  margin-right: 0.625rem;
}

.x0 .x4 .x5 p::after {
  content: '';
  position: absolute;
  right: 0;
  width: 2.5rem;
  height: 3.125rem;
  background: url(//static-o2o.360buyimg.com/daojia/new/images/address/address_arrow_icon.png) no-repeat center;
  background-size: 0.5rem 0.8125rem;
}

.x0 .x4 .x5 p {
  line-height: 3.125rem;
  color: #47b34f;
  font-size: 16px;
  display: inline-block;
}

.x0 .xc {
  width: 100%;
}

.x0 .xc ul {
  background: #fff;
}

.x5 {
  z-index: 3;
}

.search_box {
  height: 2.8125rem;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.25rem;
  position: relative;
  top: 0;
  z-index: 10;

  input {
    border: none;
    outline: none;
  }
}

.search_box .close {
  width: 2.8125rem;
  height: 2.8125rem;
  line-height: 2.8125rem;
  background: none;
}

.close i {
  font-size: 1.25rem;
  color: #666;
}

.search_box .search {
  width: 17.5rem;
  height: 1.875rem;
  line-height: 1.875rem;
  background-color: #f5f5f5;
  border-radius: 1rem;
  padding: 0 0.625rem;
  display: flex;
  justify-content: flex-start;
}

.search i {
  font-size: 1rem;
  margin-right: 0.625rem;
  color: #999;
}

.search input {
  width: 12.5rem;
  max-width: 12.5rem;
}

.location-city h1 {
  font-weight: normal;
  padding: 0 1.25rem;
  line-height: 3.125rem;
  color: #8c8c8c;
  font-size: 15px;
  text-align: left;
}

.location-open {
  display: flex;
  flex-wrap: wrap;
  padding: 0 0.875rem;
  // border-bottom: solid 0.0625rem #ebebeb;
}

.location-open li {
  width: 6.0625rem;
  height: 2.5rem;
  line-height: 2.5rem;
  border-radius: 0.1875rem;
  border: solid 0.0625rem #ebebeb;
  background: #fff;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  margin-right: 0.5rem;
  margin-bottom: 0.625rem;
}

.history-city h1 {
  font-weight: normal;
  padding: 0 1.25rem;
  line-height: 3.125rem;
  color: #8c8c8c;
  font-size: 15px;
  text-align: left;
}

.history-open {
  display: flex;
  flex-wrap: wrap;
  padding: 0 0.875rem;
  // border-bottom: solid 0.0625rem #ebebeb;
}

.history-open li {
  width: 6.0625rem;
  height: 2.5rem;
  line-height: 2.5rem;
  border-radius: 0.1875rem;
  border: solid 0.0625rem #ebebeb;
  background: #fff;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  margin-right: 0.5rem;
  margin-bottom: 0.625rem;
}

.open_city h1 {
  font-weight: normal;
  padding: 0 1.25rem;
  line-height: 3.125rem;
  color: #8c8c8c;
  font-size: 15px;
  text-align: left;
}

.open {
  display: flex;
  flex-wrap: wrap;
  padding: 0 0.875rem;
  // border-bottom: solid 0.0625rem #ebebeb;
}

.open li {
  width: 6.0625rem;
  height: 2.5rem;
  line-height: 2.5rem;
  border-radius: 0.1875rem;
  border: solid 0.0625rem #ebebeb;
  background: #fff;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  margin-right: 0.5rem;
  margin-bottom: 0.625rem;
}

.city_list {
  background-color: #fff;
}

.city_a,
.city_b .letter {
  line-height: 1.875rem;
  text-align: left;
  padding-left: 0.875rem;
  background: #f5f5f5;
}

.city_a,
.city_b li {
  line-height: 2.5rem;
  border-bottom: solid 0.0625rem #ebebeb;
  margin-left: 0.875rem;
  text-align: left;
}

.city_b li {
  margin-left: 2.5rem;
}

.right_letter {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
  height: 100%;
  width: 2.5rem;
  text-align: center;
  box-sizing: border-box;
}

.letter_box {
  padding-top: 0.625rem;
  width: 2.5rem;
  position: absolute;
  right: 0;
  top: 26%;
  transform: translate(0, -30%);
}

.clear {
  line-height: 1.4rem !important;
  top: 50%;
  transform: translate(0, -50%);
}

.letter_box li {
  line-height: 1.875rem;
  color: #47b34f;
  font-size: 14px;
}
</style>
