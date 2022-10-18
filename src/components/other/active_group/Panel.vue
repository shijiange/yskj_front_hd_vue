<template>
  <div class="panel">
    <div class="panel-title" v-if="!$slots.title" v-show="title">
      <ul class="panel-title-decoration">
        <li class="panel-title-decoration-item"></li>
        <li class="panel-title-decoration-item"></li>
      </ul>
      {{ title }}
      <ul class="panel-title-decoration">
        <li class="panel-title-decoration-item"></li>
        <li class="panel-title-decoration-item"></li>
      </ul>
    </div>
    <slot name="title"></slot>
    <slot></slot>
  </div>
</template>

<script>
//* 带Scoped 就是模块 组件
export default {
  props: {
    title: String
  },
  components: {}
};
</script>

<style scoped>
.panel {
  position: relative;
  z-index: 1;
  padding: 0.72rem;
  text-align: left;
  border-radius: 0.63rem;
  background-color: white;
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.06rem;
  margin-bottom: 1.34rem;
  text-align: center;
  font-size: 1.06rem;
  color: var(--page-main-color);
  font-weight: bold;
}

.panel-title-decoration {
  height: 0.81rem;
}

.panel-title-decoration:first-child {
  margin-right: 1.2rem;
}

.panel-title-decoration:last-child {
  margin-left: 0.78rem;
}

.panel-title-decoration-item {
  display: inline-block;
  margin-left: 0.375rem;
  width: 0.1875rem;
  height: 0.8125rem;
  background: linear-gradient(to bottom, var(--page-main-color), transparent);
  transform: skew(-25deg, 10deg);
}
</style>