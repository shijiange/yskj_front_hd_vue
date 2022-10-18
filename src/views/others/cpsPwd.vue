<template>
  <div id="cpsPwd">
    <c-title :hide="false" text="卡密"> </c-title>
    <div class="pwd-info">
      <div class="info-content">
        <div style="margin-bottom: 0.625rem;">卡号:{{info.goods_number}}</div>
        <div>卡密:{{info.goods_password}}</div>
      </div>
      <div class="copy-btn" v-clipboard:copy="`卡号:${info.goods_number} 卡密:${info.goods_password}`" v-clipboard:success="onCopy" v-clipboard:error="onError">一键复制</div>
    </div>
    <div class="operate" v-if="datas.use_notice">
      <div class="operate-title">*操作说明</div>
      <div class="operate-content" v-html="datas.use_notice" ></div>
    </div>
  </div>
</template>

<script>
import cpsPwd_controller from "./cpsPwd_controller";

export default cpsPwd_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#cpsPwd {
  .pwd-info {
    background: #fff;
    padding: 1.25rem 0.625rem;

    .info-content {
      border: solid 1px #f2f2f2;
      padding: 0.625rem;
      text-align: left;
    }

    .copy-btn {
      margin: 0 auto;
      background: #fb6b68;
      color: #fff;
      width: 13.75rem;
      border-radius: 0.9375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1.25rem;
      height: 1.5625rem;
    }
  }

  .operate {
    padding: 1.25rem;
    color: #666;

    .operate-title {
      margin-bottom: 0.625rem;
      text-align: left;
    }

    .operate-content {
      text-align: left;
      overflow: hidden;
      word-wrap: break-word;
    }
  }
}
</style>
