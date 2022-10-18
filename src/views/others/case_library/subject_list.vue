<template>
  <div>
    <template v-if="fun.getPhoneEnv() == 3 &&$store.state.caseLibrary!=null&&$store.state.caseLibrary.set.pc_style==1">
      <caseSubjectListPC></caseSubjectListPC>
    </template>

    <template v-else>
      <caseSubjectListMobile></caseSubjectListMobile>
    </template>
  </div>
</template>

<script>
import subject_list_controller from "./subject_list_controller";

export default subject_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
