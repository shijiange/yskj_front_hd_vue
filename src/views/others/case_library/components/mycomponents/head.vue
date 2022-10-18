<template>
  <div id="head">
    <div class="head">
      <div class="left" @click="goBack">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="middle">
        <span>{{text}}</span>
      </div>
      <div class="left">
        <i class="iconfont icon-caidan" @click="openMenu" style="font-size: 20px;"></i>
      </div>
    </div>
    <div style="height: 2.5rem;"></div>
    <van-popup v-model="show" position="right" :style="{ width: '9.375rem', height: '100%' }">
      <div class="menu">
        <div class="li" @click="gotoOther('home')" :class="{'li-selected':choosed=='home'}">首页</div>
        <div class="li" @click="gotoOther('category')" :class="{'li-selected':choosed=='category'}">分类</div>
        <div class="li" @click="gotoOther('ranking')" :class="{'li-selected':choosed=='ranking'}">排行榜</div>
        <div class="li" @click="gotoOther('subject')" :class="{'li-selected':choosed=='subject'}">专题</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import head_controller from './head_controller';

export default head_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#head {
  text-align: center;
  z-index: 2005;
  position: relative;

  .head {
    width: 100%;
    height: 2.5rem;
    border-bottom: #ebebeb 1px solid;
    position: fixed;
    display: flex;
    background: #fff;
    line-height: 2.5rem;

    .left {
      width: 3rem;
      min-width: 3rem;
      text-align: center;
    }

    .middle {
      width: 10rem;
      flex: 1;
      color: #333;
      font-size: 1rem;
    }

    .right {
      width: 3rem;
      min-width: 3rem;
      text-align: center;
    }
  }

  .menu {
    .li {
      line-height: 2.718rem;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #333;
    }

    .li-selected {
      background: #fff0e8;
      border-right: 3px solid $orange;
    }
  }
}

.pcStyle #head .head {
  width: 375px;
}
</style>
