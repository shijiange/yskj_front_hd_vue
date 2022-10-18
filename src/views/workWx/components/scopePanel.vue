<template>
  <div class="scope-panel">
    <slot name="header-box"></slot>
    <div class="panel-title" v-if="title!==''">
      <div class="mini-col"></div>
      <div>{{title}}</div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },

  },
  data () {
    return {
    };
  },

  methods: {},

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.scope-panel {
  padding: 0.8rem;
  margin-top: 0.8rem;
	background-color: #ffffff;
	border-radius: 0.45rem;
  .panel-title {
    display: flex;
    align-items: center;
    .mini-col {
      width: 0.21rem;
      height: 1.05rem;
      margin-right: 0.5rem;
      background-color: #f05152;
      border-radius: 0.16rem;
    }
  }
}
</style>