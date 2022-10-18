// import { Toast } from 'vant';
export default {
  props: {
    item: Object,
    index: Number,
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 0
    },
    active: { // 翻动效果生效
      type: Boolean,
      default: false
    },
    styles: {
      type: Array,
      default: () => [{}, {}, {}, {}, {}, {}]
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.TouchMove();
    });
  },
  destoryed() {
    this.$nextTick(() => {
      this.TouchMoveOut();
    });
  },
  methods: {
    TouchMove() {
      if(this.$refs.buyButton) {
        if (this.fun.getPhoneEnv() == 3) {
          this.$refs.buyButton.addEventListener("mousedown", this.handleManualTouchStart, false);
          this.$refs.buyButton.addEventListener("mouseup", this.handleManualTouchEnd, false);
        } else {
          this.$refs.buyButton.addEventListener("touchstart", this.handleManualTouchStart, false);
          this.$refs.buyButton.addEventListener("touchend", this.handleManualTouchEnd, false);
        }
      }
    },
    TouchMoveOut() {
      if(this.$refs.buyButton) {
        if (this.fun.getPhoneEnv() == 3) {
          this.$refs.buyButton.removeEventListener("mousedown", this.handleManualTouchStart, false);
          this.$refs.buyButton.removeEventListener("mouseup", this.handleManualTouchEnd, false);
        } else {
          this.$refs.buyButton.removeEventListener("touchstart", this.handleManualTouchStart, false);
          this.$refs.buyButton.removeEventListener("touchend", this.handleManualTouchEnd, false);
        }
      }
    },
    handleManualTouchStart(e) {
      e.stopPropagation();
    },
    handleManualTouchEnd(e) {
      e.stopPropagation();
      this.$emit("gotoUrl", { id: this.item.goods_id });
    }
  },
  computed: {
    clipSize() {
      return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2), 2);
    }
  }
};
