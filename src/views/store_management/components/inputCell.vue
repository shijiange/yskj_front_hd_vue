<template>
  <div>
    <van-field
      :label="labelText"
      :readonly="isReadonly"
      @click="clickField"
      :placeholder="value ? '' :placeholder"
      :required="isRequired"
    >
      <template #right-icon>
        <span>{{value}}</span>
        <van-icon name="arrow"></van-icon>
      </template>
    </van-field>
  </div>
</template>

<script>
export default {
  props: {
    labelText: {
      type: String
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    };
  },

  methods: {
    clickField () {
      this.$emit("clickField");
    }
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
/deep/ .van-cell {
  .van-cell__title {
    width: auto;
  }
  .van-field__right-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.van-cell::before{
  left: 4px;
  top: 14px;
  font-weight: 800;
}
</style>