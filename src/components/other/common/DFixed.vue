<template>
  <div class="d-fixed">
    <div class="d-fixed-container" :style="appendStyle">
      <slot />
    </div>
    <div class="d-fixed-placeholder" v-if="placecholder" :style="{ height: `${placeholderElHeight}px` }"></div>
  </div>
</template>

<script>
export default {
  props: {
    top: String,
    left: String,
    right: String,
    bottom: String,
    zIndex: {
      type: Number,
      default: 2
    },
    rootEl: {
      type: String,
      default: "#appMain"
    },
    placecholder: {
      type: Boolean,
      default: false
    },
    placeholderHeight: {
      type: Number,
      default: null
    },
    fixed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      appendStyle: {},
      placeholderElHeight: 0
    };
  },
  mounted() {
    let appendStyle = {
      position: this.fixed ? "fixed" : "unset",
      top: this.top,
      left: this.left,
      bottom: this.bottom,
      zIndex: this.zIndex,
      right: this.right
    };
    if (this.fun.getPhoneEnv() == 3) {
      if (this.right) {
        let el = document.querySelector(this.rootEl);
        appendStyle["right"] = `calc(${el.offsetLeft}px + ${this.right})`;
      }
      if (this.left) {
        let el = document.querySelector(this.rootEl);
        appendStyle["left"] = `calc(${el.offsetLeft}px + ${this.right})`;
      }
    }

    this.appendStyle = appendStyle;
    if (this.placecholder) {
      let placeholderElHeight = 0;
      if (this.placeholderHeight) {
        placeholderElHeight = this.placecholder;
      } else {
        for (const elItem of this.$slots.default) {
          if (elItem.elm.offsetHeight) {
            placeholderElHeight += elItem.elm.offsetHeight + elItem.elm.offsetTop;
          }
        }
      }

      this.placeholderElHeight = placeholderElHeight;
    }
  }
};
</script>