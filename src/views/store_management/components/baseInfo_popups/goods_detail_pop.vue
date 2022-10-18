<template>
  <div class="goods-detail-pop">
    <yz-popup
      :isShow="isShowPopup"
      title="商品详情"
      :isFill="true"
      :isShowRight="false"
      @closePopup="closePopup"
    >
      <template>
        <bit-map-editor @saveEdit="finishEdit"></bit-map-editor>
      </template>
    </yz-popup>
  </div>
</template>

<script>
import yzPopup from "../yz_popup";
import bitMapEditor from "../bitMapEditor";

export default {
  props: ['defaultType'],
  data () {
    return {
      isShowPopup: false,
    };
  },
  mounted () {
  },
  methods: {
    showPopup () {
      this.isShowPopup = true;
    },
    closePopup () {
      this.isShowPopup = false;
    },
    checkDisTemplate () {
      this.isShowPopup = false;
    },
    finishEdit (event) {
      this.isShowPopup = false;
      this.$emit("saveDetail", event);
    },
  },

  components: {
    yzPopup,
    bitMapEditor
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.goods-detail-pop {
  /deep/ .van-cell {
    padding: 1rem 0;
  }
}

</style>