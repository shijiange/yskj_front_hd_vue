<template>
  <div class="cell-item">
    <div class="cell-label">{{title}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data () {
    return {
    };
  },

  methods: {},

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.cell-item {
  display: flex;
  text-align: left;
  padding: 0.4rem;
  word-break: break-all;
  .cell-label {
    font-size: 0.75rem;
    color: #666666;
    white-space: nowrap;
  }
}
</style>