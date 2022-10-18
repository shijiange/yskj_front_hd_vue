<template>
  <div id="categories">
    <c-title :hide="false" :text="'全部类型'"></c-title>
    <div id="content">
        <h1>全部类型</h1>
        <ul class="box">
            <li>简况</li>
            <li>公告</li>
            <li>评估</li>
            <li>数字资产</li>
            <li>财务</li>
            <li>商品</li>
            <li>门店</li>
        </ul>
    </div>
  </div>
</template>

<script>
import categories_controller from "./categories_controller";

export default categories_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#categories {
  #content {
    h1 {
      line-height: 2.5rem;
      height: 2.5rem;
      font-size: 16px;
      text-align: left;
      padding: 0 0.875rem;
    }

    .box {
      display: flex;
      flex-wrap: wrap;
      padding: 0 0.875rem;

      li {
        width: 5rem;
        height: 1.875rem;
        line-height: 1.875rem;
        background: #fff;
        border: solid 0.0625rem #ebebeb;
        font-size: 16px;
        color: #666;
        margin-bottom: 0.625rem;
        margin-right: 0.375rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-radius: 0.1875rem;
      }
    }
  }
}
</style>