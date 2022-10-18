<template>
  <div id="circleMySet">
    <c-title :hide="false" text="我的设置"> </c-title>
    <div class="content">
      <div class="item" @click="toIssue">
        <i class="iconfont icon-fontclass-fabu icon1"></i>
        <div>我的发布</div>
        <van-icon name="arrow" />
      </div>
      <div class="item" @click="toCircle" >
        <i class="iconfont icon-fontclass-quanzi icon2"></i>
        <div>我的圈子</div>
        <van-icon name="arrow" />
      </div>
      <div class="item" @click="toAttention">
        <i class="iconfont icon-fontclass-guanzhu icon3"></i>
        <div>我的关注</div>
        <van-icon name="arrow" />
      </div>
    </div>
    <Tabbar />
  </div>
</template>

<script>
import circleMySet_controller from './circleMySet_controller';

export default circleMySet_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#circleMySet.iphoneXStyle {
  padding-bottom: 4rem;

  .nav-class {
    padding-bottom: 1.5rem;
    height: 4.5rem;
  }
}

#circleMySet {
  .content {
    background: #fff;

    .item {
      height: 3.063rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding-left: 0.938rem;
      padding-right: 1rem;
      border-bottom: 0.05rem solid #f2f2f2;

      i {
        display: flex;
        align-items: center;
        height: 100%;
        font-size: 1rem;
      }

      div {
        text-align: left;
        flex: 1;
        padding-left: 0.5rem;
      }

      .icon1 {
        color: #ffa503;
      }

      .icon2 {
        color: #fa5263;
      }

      .icon3 {
        color: #50d69b;
      }
    }
  }
}
</style>
