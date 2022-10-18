<template>
  <div class="stock-type-pop">
    <yz-popup
      :isShow="isShowPopup"
      title="减库存方式"
      @closePopup="closePopup"
      @clickConfirmBtn="confirmType"
    >
      <template>
        <van-radio-group v-model="radio" style="text-align:left" checked-color="#f15353" @change="changeType">
          <van-cell-group>
            <van-cell clickable @click="radio = 0">
              <template #title>
                <p class="title">拍下减少库存</p>
                <p class="description">买家拍下商品即减少库存，存在恶拍风险</p>
              </template>
              <template #right-icon>
                <van-radio :name="0" />
              </template>
            </van-cell>
            <van-cell clickable @click="radio = 1">
              <template #title>
                <p class="title">付款减库存</p>
                <p class="description">买家拍下并完成付款减少库存，存在超卖风险</p>
              </template>
              <template #right-icon>
                <van-radio :name="1" />
              </template>
            </van-cell>
            <van-cell clickable @click="radio = 2">
              <template #title>
                <p class="title">永不减库存</p>
                <p class="description">无论拍下或付款成功，商品永远不会扣除库存数量</p>
              </template>
              <template #right-icon>
                <van-radio :name="2" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </template>
    </yz-popup>
  </div>
</template>

<script>
import yzPopup from "../yz_popup";

export default {
  props: ['defaultType'],
  data () {
    return {
      radio: 0,
      isShowPopup: false,
    };
  },
  watch: {
    defaultType (newVal) {
      this.radio = newVal;
    }
  },
  mounted () {
    this.radio = this.defaultType ? this.defaultType : 0;
  },
  methods: {
    showPopup () {
      this.isShowPopup = true;
    },
    changeType (type) {
      this.$emit('changeType', type);
    },
    closePopup () {
      this.isShowPopup = false;
    },
    confirmType (event) {
      this.isShowPopup = event;
      this.$emit("confirmType", this.radio);
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
    .van-radio__icon {
      .van-icon {
        color: #fff;
        background-color: #c4c4c4;
      }
    }
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