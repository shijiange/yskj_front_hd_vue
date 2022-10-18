<template>

  <div id="messageSettings">
    <c-title :hide="false" text='消息提醒设置'></c-title>
    <h4>商城信息 提醒</h4>
    <van-cell-group :border="false">
      <van-cell :border="false" center :title="'选项 ' + value" title-style="text-align:left">
        <van-switch v-model="value" @change="switchItme" size="25px" active-color="#f15353" inactive-color="#fff"/>
      </van-cell>
    </van-cell-group>
    <van-cell-group :border="false">
      <van-cell :border="false" center :title="'选项 ' + value" title-style="text-align:left">
        <van-switch v-model="value" @change="switchItme" size="25px" active-color="#f15353" inactive-color="#fff"/>
      </van-cell>
    </van-cell-group>
    <van-cell-group :border="false">
      <van-cell :border="false" center :title="'选项 ' + value" title-style="text-align:left">
        <van-switch v-model="value" @change="switchItme" size="25px" active-color="#f15353" inactive-color="#fff"/>
      </van-cell>
    </van-cell-group>

  </div>

</template>
<script>
import messageSettingsController from "./messageSettingsController";

export default messageSettingsController;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  #messageSettings {
    .mint-cell-title {
      text-align: left;
    }

    h4 {
      margin: 0;
      line-height: 2.5rem;
      text-align: left;
      font-size: 16px;
      font-weight: normal;
      padding-left: 0.625rem;
    }

    a {
      color: #000;
    }

    ul {
      background: #fff;
      overflow: hidden;
    }

    li {
      border-bottom: 0.0625rem #f0f0f0 solid;
      padding-left: 0.625rem;
      line-height: 2.75rem;
      text-align: left;
      color: #000;
    }

    i {
      float: left;
      color: #a8a8a8;
      font-size: 26px;
      line-height: 2.75rem;
    }

    .fa-star {
      margin-right: 0.625rem;
    }

    .fa-angle-right {
      color: #999;
      width: 1.25rem;
      float: right;
    }
  }

  /deep/ .van-switch {
    float: right;
  }
</style>