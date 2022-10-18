<template>
  <div class="item">
      <div class="item-left">{{lable}}</div>
      <div class="item-right" :style="{color:color?color:'#0c0d0e'}">{{text}}</div>
      <slot></slot>
  </div>
</template>
<script>
  export default{
    props:["lable","text","color"]
  }
</script>
<style scoped lang="scss">
  .item {
      display: flex;
      align-items: center;
      font-size: .875rem;
      padding: .4688rem 0;
      .item-left {
        width: 6rem;
        color: #747474;
      }
      .item-right {
        flex: 1;
      }
    }
</style>