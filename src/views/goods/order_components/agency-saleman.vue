<!-- 创达通-销售员分红 #85033 -->
<!-- 输入销售员id -->
<template>
  <div class="tbs coupon-list agency-saleman">
    <p style="color:#e84e40;">请输入销售员ID</p>
    <van-cell-group :border="false" style="width:100%;">
      <van-field
        ref="field"
        :error="error"
        @input="inputChange"
        @blur="blurInput"
        v-model="self_member_id"
        :error-message="mid == self_member_id ? '禁止输入自己的销售员ID' : ''"
        label="销售员ID"
        :placeholder="placeholder"
        style="padding:0;"
        right-icon="warning-o"
      />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  props: {
    mid: {
      type: [String, Number],
      default: "0"
    }
  },
  data() {
    return {
      error: false,
      timeoutId: null, //防抖，防止触发
      self_member_id: "",
      placeholder: "请输入销售员ID（选填）"
    };
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    inputChange(e) {
      if (this.error) this.error = false;
      if (this.self_member_id == this.mid) {
        this.placeholder = "禁止输入自己的销售员ID";
      }
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      }
      // clearTimeout方法，以便控制连续触发带来的无用调用
      this.timeoutId = setTimeout(() => {
        // time 毫秒以后执行方法
        this.$refs.field.blur();
      }, 1500); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    blurInput() {
      if (this.self_member_id == this.mid) {
        this.error = true;
        this.self_member_id = "";
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.tbs.coupon-list {
  margin-top: 0.625rem;
}
</style>
