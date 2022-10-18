<template>
  <div class="stock-type-pop">
    <yz-popup
      :isShow="isShowPopup"
      title="配送方式"
      @closePopup="closePopup"
      @clickConfirmBtn="confirmType"
    >
      <template>
        <van-checkbox-group v-model="checkBoxs" style="text-align:left" checked-color="#f15353" @change="changeType">
          <van-cell-group>
            <van-cell clickable v-for="(item, index) in dispatchTypeList" :key="index"
              :title="item.name"
              @click="toggle(index)"
            >
              <template #right-icon>
                <van-checkbox :name="item.id+''" ref="checkboxes" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </template>
    </yz-popup>
  </div>
</template>

<script>
import yzPopup from "../yz_popup";

export default {
  props: {
    defaultChecks: {
      type: Array,
      default () {
        return [];
      }
    },
    dispatchTypeList: {
      type: Array,
      default () {
        return [];
      }
    },
  },
  data () {
    return {
      checkBoxs: [],
      isShowPopup: false,
    };
  },
  watch: {
    defaultChecks(newValue){
      this.checkBoxs = newValue ? newValue : [];
    },
  },
  methods: {
    showPopup () {
      this.isShowPopup = true;
    },
    changeType (result) {
      this.checkBoxs = result;
      this.$emit('changeType', result);
    },
    closePopup () {
      this.isShowPopup = false;
    },
    confirmType (event) {
      this.isShowPopup = event;
      this.$emit("confirmType", this.checkBoxs);
    },
    toggle(index) {
      this.$refs.checkboxes && this.$refs.checkboxes[index].toggle();
    },
  },

  components: {
    yzPopup
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.stock-type-pop {
  /deep/ .van-cell {
    padding: 1rem 0;
  }
  .title {
    font-size: 0.88rem;
    line-height: 1.13rem;
    color: #2b2a2a;
  }
  .description {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    line-height: 1.13rem;
    letter-spacing: 0rem;
    color: #919191;
  }
}

</style>