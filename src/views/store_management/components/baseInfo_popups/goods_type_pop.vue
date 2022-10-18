<template>
  <div class="goods-type-pop">
    <yz-popup
      :isShow="isShowPopup"
      title="选择商品类型"
      @closePopup="cancelSelect"
      @clickConfirmBtn="confirmType"
    >
      <template>
        <div class="select">
          <div :class="['option', active==1?'active-red':'']" @click="selectType(1)">
            <i class="iconfont icon-fontclass-fahuo"></i>
            <p class="type-description">实体商品</p>
          </div>
          <div :class="['option', active==2?'active-red':'']" @click="selectType(2)">
            <i class="iconfont icon-fontclass-xuni"></i>
            <p class="type-description">虚拟商品</p>
          </div>
        </div>
      </template>
    </yz-popup>
  </div>
</template>

<script>
import yzPopup from "../yz_popup";

export default {
  props: {
    defaultType: {
      type: [String, Number, Boolean, Object],
      default: ''
    },
  },
  data () {
    return {
      active: '',
      isShowPopup: false,
    };
  },
  methods: {
    showPopup (val) {
      this.isShowPopup = true;
      this.active = val;
    },
    cancelSelect () {
      this.isShowPopup = false;
    },
    selectType (type) {
      this.active = type;
      this.$emit('changeType', this.active);
    },
    confirmType (event) {
      this.isShowPopup = event;
      this.$emit("confirmType", this.active);
    },
  },

  components: {
    yzPopup
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.goods-type-pop {
  .select {
      display: flex;
      justify-content: space-between;
      padding: 2rem 1rem;
      .option {
        padding: 1.5rem 1.79rem;
        border-radius: 0.31rem;
        color: #bababa;
        border: solid 0.03rem #d2d2d2;
        .iconfont {
          font-size: 2.6rem;
        }
        .type-description {
          margin-top: 1rem;
        }
      }
      .active-red {
        color: #f15353;
        border: solid 0.03rem #f15353;
      }
  }
}

</style>