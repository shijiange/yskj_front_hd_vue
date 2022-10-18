<template>
  <div>
    <template v-if="fun.getPhoneEnv() == 3&&$store.state.caseLibrary!=null&&$store.state.caseLibrary.set.pc_style==1">
      <caseSubjectDetailPC></caseSubjectDetailPC>
    </template>

    <template v-else>
      <caseSubjectDetailMobile></caseSubjectDetailMobile>
    </template>
  </div>
</template>

<script>
import subject_detail_controller from "./subject_detail_controller";

export default subject_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
