<template>
  <div id="search" transition="fadeInLeft">
    <c-title :hide="false" :text="storeName"></c-title>
    <div id="soso" class="uou" :class="{ mout: amout }">
      <c-storeList :stores="stores" :listStyle="openTemplate" @changList="changList" :text="storeName" :page="page" :totalPage="total_page"></c-storeList>
    </div>
    <div style="height: 3.4375rem; display: block;"></div>
  </div>
</template>

<script>
import category_controller from "./category_controller";

export default category_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#search {
  .osll {
    min-height: 100vh;
    overflow: scroll;
  }

  .uou {
    z-index: 99;
    top: 0;
    transition: 0.2s;
    -webkit-transition: 0.2s;
    background: #fff;
  }

  .mout {
    top: -2.25rem;
  }
}

.search {
  overflow: hidden;
  background: #fff;
  border-bottom: 0.0625rem solid #f5f5f5;
}
</style>
