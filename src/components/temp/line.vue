<template>
<div id="line">
<div class="fe-mod-5-line" :style="{'border-top-width':datas.params.height,'border-top-style':datas.params.style,'border-top-color':datas.params.color}"></div>
</div>
</template>
<script>

export default {
  props: ['datas'],
  mounted(){

  },
  methods:{

  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #line {
    .fe-mod-5-line { height: 0; margin: 0.625rem 0; border-top: 0.125rem dashed #999; }
  }
</style>