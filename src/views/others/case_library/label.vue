<template>
  <div>
    <template v-if="fun.getPhoneEnv() == 3 &&$store.state.caseLibrary!=null&&$store.state.caseLibrary.set.pc_style==1">
      <caseLabelPC></caseLabelPC>
    </template>

    <template v-else>
      <caseLabelMobile></caseLabelMobile>
    </template>
  </div>
</template>

<script>
import label_controller from "./label_controller";

export default label_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
