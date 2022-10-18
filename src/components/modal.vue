<style scoped>
.modal-wrapper {
  position: fixed;
  z-index: 6665;
  top: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  width: 80%;
  padding: 0.9375rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255);
  border: 0.0625rem #ebebeb solid;
  border-radius: 0.25rem;
}

.modal-title {
  padding-bottom: 0.625rem;
  text-align: center;
  font-size: 16px;
  color: #333;
}

.modal-content-value {
  padding-bottom: 1rem;
  text-align: center;
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.modal-btns {
  display: flex;
  justify-content: space-around;
}

.modal-btns button {
  background: #fff;
  border: 0.0625rem #ccc solid;
  padding: 0.3125rem;
  border-radius: 0.1875rem;
  width: 5rem;
  height: 1.875rem;
}

/* .modal-btns button:first-child{
		margin-right:40px;
	} */

.modal-tips {
  padding: 0.625rem 0 0;
  font-size: 14px;
  color: #8c8c8c;
}
</style>
<template>
  <div class="modal-wrapper set-pc-style">
    <div class="modal-content">
      <div class="modal-title">
        {{ title }}
      </div>

      <div class="modal-content-value">
        {{ value }}
      </div>

      <div class="modal-btns">
        <button v-clipboard:copy="value" v-clipboard:success="onCopy">复制</button>
        <button @click="handleClose">关闭</button>
      </div>

      <div class="modal-tips">
        {{ tips }}
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  name: 'modal',

  props: {
    title: String,
    tips: String,
    value: String,
    type: String
  },

  methods: {
    handleClose: function() {
      this.$emit('onClose');
    },

    onCopy: function() {
      Toast({
        message: '复制成功',
        position: 'bottom',
        duration: 5000
      });
    }
  }
};
</script>
