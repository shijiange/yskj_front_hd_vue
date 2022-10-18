<template>
  <div>
    <template v-if="fun.getPhoneEnv() == 3 &&$store.state.caseLibrary!=null&&$store.state.caseLibrary.set.pc_style==1">
      <caseDetailPC></caseDetailPC>
    </template>

    <template v-else>
      <caseDetailMobile></caseDetailMobile>
    </template>
  </div>
</template>

<script>
import case_detail_controller from "./case_detail_controller";

export default case_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
