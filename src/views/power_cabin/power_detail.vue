<template>
  <div id="power_detail">
    <c-title :hide="false" text='会员信息'></c-title>
    <div class="content">
      <div class="item">
        <span>会员ID:</span>
        <span>{{info.uid}}</span>
      </div>
      <div class="item">
        <span>会员昵称:</span>
        <span>{{info.nickname}}</span>
      </div>
      <div class="item">
        <span>姓名:</span>
        <span>{{info.realname}}</span>
      </div>
      <div class="item">
        <span>手机号:</span>
        <span>{{info.mobile}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import power_detail_controller from './power_detail_controller';
export default power_detail_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#power_detail {
  height: 100vh;
  background-color: #fff;

  .content {
    padding: 2rem;

    .item {
      text-align: left;
      margin-bottom: 1.25rem;
    }
  }
}
</style>
