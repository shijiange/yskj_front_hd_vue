<template>
  <div class="pulish-form-item">
    <div class="publish-form-header" :class="{ 'publish-form-title_bottom_border': bottomBorder }" v-if="title || required">
      <div class="publish-form-title">{{ title }} <span class="publish-form-title_require" v-if="required">*</span></div>
      <slot name="title-right" />
    </div>
    <div class="publish-form-tip">
      <slot name="tip" />
    </div>
    <div class="publish-form-content" v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    },
    bottomBorder: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.pulish-form-item:first-child {
  padding-top: 0.88rem;
}

.publish-form-header {
  display: flex;
  align-items: center;
}

.publish-form-title {
  flex-shrink: 0;
  padding-right: 0.3125rem;
  font-size: 0.94rem;
  color: #333;
}

.publish-form-title_require {
  padding-left: 0.19rem;
  color: #ee2e2b;
}

.publish-form-title_bottom_border {
  padding-bottom: 0.72rem;
  border-bottom: 1px solid #f2f2f2;
}

.publish-form-content {
  margin-top: 1.16rem;
}

.pulish-form-item input {
  width: 100%;
  border: none;
}

.publish-form-tip {
  margin-top: 0.5rem;
  font-size: 0.69rem;
  color: #6e6e6e;
}
</style>