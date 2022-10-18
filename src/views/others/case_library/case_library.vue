<template>
  <div>
    <template v-if="fun.getPhoneEnv() == 3 &&$store.state.caseLibrary!=null&&$store.state.caseLibrary.set.pc_style==1&&showPC">
      <caseLibraryPC></caseLibraryPC>
    </template>

    <template v-else>
      <caseLibraryMobile></caseLibraryMobile>
    </template>
  </div>
</template>

<script>
import case_library_controller from "./case_library_controller";

export default case_library_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
