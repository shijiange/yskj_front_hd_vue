<template>
  <div>
    <template v-if="fun.getPhoneEnv() == 3 && $store.state.caseLibrary!=null&&$store.state.caseLibrary.set.pc_style==1">
      <caseCategoryPC></caseCategoryPC>
    </template>

    <template v-else>
      <caseCategoryMobile></caseCategoryMobile>
    </template>
  </div>
</template>

<script>
import category_controller from "./category_controller";

export default category_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
