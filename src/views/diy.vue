<template>
  <div id="all">
    <template v-if="$store.state.isWatchDiypage == 1">
      <div
        class="search_nav"
        v-if="sliderNav.isshow ? sliderNav.isshow : false"
        :style="{
          width: fun.getPhoneEnv() == 3 ? '375px' : '',
          'background-color': sliderNav.params.bgcolor,
          opacity: sliderNav.params.bgalpha,
          border: sliderNav.params.showborder == 1 ? '1px solid' + sliderNav.params.bordercolor : 'none'
        }"
      >
        <div class="search_box" @click="tosearch">
          <input type="text" title="搜索" readonly="readonly" :placeholder="sliderNav.params.searchword" />
          <i class="iconfont icon-sousuo1"></i>
        </div>
        <div class="nav_box">
          <ul class="nav">
            <li v-for="item in sliderNav.menus" :key="item.title" @click="gotoAdvs(item.url)">
              <span :style="{ color: sliderNav.params.textcolor }"> {{ item.title }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div style="height: 5.2625rem;" v-if="sliderNav.isshow ? sliderNav.isshow : false"></div>
      <div class="temp" v-if="temp.item">
        <div class="home" v-if="temp.item.pageinfo">
          <template v-if="temp.item.pageinfo.temp == 'topbar'">
            <!-- 浮动按钮 -->
            <div
              class="fe-floatico"
              v-if="temp.item.pageinfo.params.floatico == 1"
              :style="{
                position: 'fixed',
                width: temp.item.pageinfo.params.floatwidth,
                top: temp.item.pageinfo.params.floattop
              }"
              :class="{
                'fe-floatico-right': temp.item.pageinfo.params.floatstyle == 'right'
              }"
            >
              <a :href="temp.item.pageinfo.params.floathref">
                <img :src="temp.item.pageinfo.params.floatimg" style="height: 100%; width: 100%;" />
              </a>
            </div>
          </template>
          <div class="home" v-if="temp.item.data && !isInHome">
            <template v-for="(item, index) in temp.item.data">
              <component :is="item.temp" :datas="item" :index="index" :page_id="page_id" :key="index"> </component>
            </template>
            <div style="height: 3.3125rem;"></div>
            <div v-if="fun.isIphoneX()" style="height: 34px;"></div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="$store.state.isWatchDiypage == 0">
      <!-- 没有等级浏览权限 -->
      <div class="noPowerShow">
        <div class="warnTestBox">暂无浏览权限！</div>
      </div>
    </template>
  </div>
</template>

<script>
import diy from './diy_controller';

export default diy;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../assets/css/index.scss';
</style>
