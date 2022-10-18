<template>
  <div id="bottom-adv">
    <div class="bottom" v-if="$store.state.caseLibrary">
      <a :href="ad2.url || '#'">
        <img :src="ad2.img || emptyImage" alt="">
      </a>
    </div>
  </div>
</template>

<script>
import bottom_adv_controller from './bottom_adv_controller';

export default bottom_adv_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#bottom-adv {
  background: #fff;
  text-align: left;

  .bottom {
    width: 100%;
    height: 200px;

    img {
      width: 100%;
      height: 200px;
    }
  }
}
</style>
