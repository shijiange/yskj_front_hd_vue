<template>
  <div>
    <template
      v-if="fun.getPhoneEnv() == 3 && $store.state.caseLibrary != null && $store.state.caseLibrary.set.pc_style == 1"
    >
      <caseHomePC></caseHomePC>
    </template>

    <template v-else>
      <caseHomeMobile></caseHomeMobile>
    </template>
  </div>
</template>

<script>
import home_controller from './home_controller';

export default home_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
